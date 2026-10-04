// ロボ・ファイト オンラインサーバー(静的配信 + WebSocket ルーム対戦)
// 対戦のシミュレーションはサーバーが実行し、フレームを参加者・観戦者に配信します。
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const C = require('./public/core.js');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') { res.writeHead(200); res.end('ok'); return; }
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(PUB, path.normalize(p));
  if (!f.startsWith(PUB)) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (e, b) => {
    if (e) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(b);
  });
});

const wss = new WebSocketServer({ server, maxPayload: 16 * 1024 });
const rooms = new Map();
let uid = 1;
const MAX_CLIENTS = 8, MAX_ROOMS = 100;
const all = new Set();
process.on('uncaughtException', e => console.error('uncaught', e));
process.on('unhandledRejection', e => console.error('unhandled', e));

const newCode = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c;
  do { c = Array.from({ length: 5 }, () => a[Math.random() * a.length | 0]).join(''); } while (rooms.has(c));
  return c;
};
const send = (ws, o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
const bcast = (r, o) => { const s = JSON.stringify(o); for (const c of r.cl) if (c.ws.readyState === 1) c.ws.send(s); };
const info = r => ({
  t: 'room', code: r.code, state: r.state, host: r.cl[0] && r.cl[0].id,
  players: r.cl.slice(0, 2).map((c, i) => ({ id: c.id, name: c.load.name, slot: i, ready: c.ready })),
  spec: Math.max(0, r.cl.length - 2),
});

function startMatch(r) {
  const m = C.mkMatch(C.loadFighter(r.cl[0].load), C.loadFighter(r.cl[1].load));
  C.startMatch(m);
  r.m = m; r.state = 'fight'; r.acc = 0; r.last = Date.now();
  bcast(r, { t: 'start', a: C.staticOf(m.p), b: C.staticOf(m.r) });
  bcast(r, info(r));
}
function endMatch(r, w, ko) {
  bcast(r, { t: 'end', w, ko });
  r.state = 'lobby'; r.m = null;
  r.cl.forEach((c, i) => { c.ready = i === 0; });
  bcast(r, info(r));
}
function leave(me) {
  const r = me.room; if (!r) return;
  const idx = r.cl.indexOf(me);
  if (idx < 0) return;
  me.room = null;
  if (r.state === 'fight' && idx < 2) {
    r.cl.splice(idx, 1);
    endMatch(r, idx === 0 ? 'r' : 'p', false);
  } else r.cl.splice(idx, 1);
  if (!r.cl.length) { rooms.delete(r.code); return; }
  if (r.cl[0]) r.cl[0].ready = true;
  bcast(r, info(r));
}

function handle(me, m) {
  if (!m || typeof m !== 'object') return;
  switch (m.t) {
    case 'create': {
      if (me.room) return;
      if (rooms.size >= MAX_ROOMS) return send(me.ws, { t: 'err', msg: 'サーバーが混雑しています。しばらくしてからお試しください' });
      const L = C.validLoad(m.load);
      if (!L) return send(me.ws, { t: 'err', msg: '機体データが不正です' });
      me.load = L; me.ready = true;
      const r = { code: newCode(), cl: [me], state: 'lobby', m: null };
      rooms.set(r.code, r); me.room = r;
      send(me.ws, { t: 'joined', code: r.code, you: me.id });
      bcast(r, info(r)); break;
    }
    case 'join': {
      if (me.room) return;
      const r = rooms.get(String(m.code || '').toUpperCase().slice(0, 6));
      if (!r) return send(me.ws, { t: 'err', msg: 'ルームが見つかりません' });
      if (r.cl.length >= MAX_CLIENTS) return send(me.ws, { t: 'err', msg: 'ルームが満員です' });
      const L = C.validLoad(m.load);
      if (!L) return send(me.ws, { t: 'err', msg: '機体データが不正です' });
      me.load = L; me.ready = false; me.room = r; r.cl.push(me);
      send(me.ws, { t: 'joined', code: r.code, you: me.id });
      bcast(r, info(r)); break;
    }
    case 'load': {
      const r = me.room; if (!r || r.state !== 'lobby') return;
      const L = C.validLoad(m.load); if (!L) return send(me.ws, { t: 'err', msg: '機体データが不正です' });
      me.load = L; bcast(r, info(r)); break;
    }
    case 'ready': {
      const r = me.room; if (!r || r.state !== 'lobby') return;
      me.ready = !!m.v; bcast(r, info(r)); break;
    }
    case 'start': {
      const r = me.room;
      if (r && r.state === 'lobby' && r.cl[0] === me && r.cl.length >= 2 && r.cl[1].ready) startMatch(r);
      break;
    }
    case 'chat': {
      const r = me.room; if (!r) return;
      const t = String(m.text || '').replace(/[<>]/g, '').trim().slice(0, 40);
      if (t) bcast(r, { t: 'chat', name: me.load.name, text: t });
      break;
    }
    case 'leave': leave(me); break;
  }
}

wss.on('connection', ws => {
  const me = { id: uid++, ws, load: null, ready: false, room: null, n: 0 };
  all.add(me);
  ws.on('pong', () => { me.alive = true; });
  ws.on('message', raw => { if (++me.n > 60) return; let m; try { m = JSON.parse(raw); } catch (e) { return; } handle(me, m); });
  ws.on('close', () => { all.delete(me); leave(me); });
  ws.on('error', () => {});
});

// 対戦ティック(60Hz)
setInterval(() => {
  const now = Date.now();
  for (const r of rooms.values()) {
    if (r.state !== 'fight' || !r.m) continue;
    r.acc += now - r.last; r.last = now;
    if (r.acc > 250) r.acc = 250;
    const fs = [];
    while (r.acc >= 1000 / 60) {
      r.acc -= 1000 / 60;
      try { fs.push(C.stepOnline(r.m)); } catch (e) { console.error(e); endMatch(r, 'd', false); break; }
      if (C.isDone(r.m)) break;
    }
    if (fs.length) bcast(r, { t: 'fs', f: fs });
    if (r.m && C.isDone(r.m)) { const o = r.m.out; endMatch(r, o.w, o.ko); }
  }
}, 10);

setInterval(() => { for (const c of all) c.n = 0; }, 1000);
// 定期ping(Renderのアイドル切断対策)
setInterval(() => { wss.clients.forEach(ws => { try { ws.ping(); } catch (e) {} }); }, 25000);

server.listen(PORT, '0.0.0.0', () => console.log('robo-fight server on :' + PORT));
