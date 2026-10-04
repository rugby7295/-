// ロボ・ファイト 3D クライアント(シングル+オンライン)
const $=id=>document.getElementById(id);
const UNL={hook:['フック',250,'中速の横パンチ'],upper:['アッパー',500,'長いひるみを奪う'],low:['ローキック',400,'当てると相手が鈍足に'],kick:['ハイキック',600,'ガードを崩しやすい大技'],rush:['突進パンチ',700,'踏み込んで遠くから当てる'],throw:['投げ',900,'ガードを無視する近距離技'],beam:['ビーム',1500,'遠距離から撃てる'],dodge:['バックステップ',300,'滑って下がり一瞬無敵'],slip:['サイドステップ',400,'横へ滑って一瞬無敵'],flip:['バク宙回避',900,'宙返りで大きく避ける'],counter:['カウンター',1200,'受けたら倍返し'],repair:['修理',800,'隙は大きいがHPが戻る'],focus:['集中',400,'隙は大きいがエネルギー急速回復']};
const CR={face:['顔',[['ノーマルバイザー',0,'シンプルなスリット'],['ツインアイ',200,'丸い2つの目'],['モノアイ',400,'赤い一つ目'],['Vバイザー',500,'吊り目のV字'],['ゴーグル',600,'戦場のゴーグル'],['スカル',900,'ドクロの顔'],['マスク',700,'口元グリル付き'],['スキャナー',1200,'左右に走る光'],['デュアルスラッシュ',700,'交差する2本のライン'],['ヒーローアイ',1500,'大きな白い目']]],
crest:['頭飾り',[['なし',0,'飾りなし'],['モヒカン',300,'ライト色のトサカ'],['ツインホーン',600,'湾曲した2本の角'],['アンテナ',400,'光るロングアンテナ'],['ヘッドブレード',900,'大型フィン'],['たてがみ',1500,'燃えるたてがみ'],['炎の冠',2500,'揺らめく炎'],['ヘッドホン',500,'ライト付きヘッドホン'],['ハロー',2000,'光る輪'],['ユニコーン',1800,'金色の長い角']]],
shoulder:['肩',[['なし',0,'標準の肩パッド'],['スパイクパッド',400,'トゲトゲの肩'],['ラウンドアーマー',500,'大型の丸い肩当て'],['ブレードショルダー',900,'後ろへ伸びる刃'],['ロケットポッド',1400,'発射口付き'],['ドラゴンショルダー',2200,'赤い竜のトゲ肩'],['ショルダーキャノン',2400,'肩の砲身'],['ホーンパッド',1000,'角付き肩当て']]],
back:['背中',[['なし',0,'装備なし'],['ジェットパック',800,'噴射ノズル付き'],['ウイング',1500,'羽ばたく翼'],['テール',1000,'しなる尻尾'],['マント',700,'風になびくマント'],['バナー',600,'ライト色の旗'],['リアクターリング',2500,'光る背面リング'],['ガトリング',2800,'背負い式ガトリング'],['ツインブースター',2200,'大型ブースター'],['アンテナアレイ',1200,'揺れる多重アンテナ']]],
paint:['塗装',[['なし',0,'無地'],['ストライプ',300,'レーシングストライプ'],['ツートン',300,'手足をライト色に'],['フレイム',800,'炎柄'],['カーボン',600,'黒い胴体'],['ゴールドトリム',1500,'金の縁取り'],['ハザード',500,'黄黒の警告柄'],['迷彩',600,'ミリタリー迷彩'],['ネオンライン',1400,'光るライン']]],
armc:['腕飾り',[['なし',0,'装飾なし'],['ナックルスパイク',600,'拳のトゲ'],['アームブレード',1200,'前腕の刃'],['アームシールド',900,'前腕の盾'],['フレイムリング',1800,'手首の炎の輪']]],
legc:['脚飾り',[['なし',0,'装飾なし'],['ニースパイク',600,'膝のトゲ'],['ジェットフィン',1100,'ふくらはぎのフィン'],['ショックバンド',700,'発光する足首リング']]],
embl:['胸飾り',[['なし',0,'装飾なし'],['ナンバープレート',300,'白いゼッケン'],['ドラゴンエンブレム',1200,'赤く光る紋章'],['スカルプレート',1000,'ドクロの胸当て'],['チャンピオンベルト',2500,'金のベルト'],['勲章',900,'金色のメダル']]]};
const COS={};for(const k in CR)COS[k]={n:CR[k][0],i:CR[k][1].map(a=>({n:a[0],c:a[1],d:a[2]}))};const CK=Object.keys(COS);
const sg=v=>(v>0?'+':'')+v,FM={hp:v=>'HP'+sg(v),en:v=>'電池'+sg(v),pw:v=>'攻撃'+sg(Math.round(v*100))+'%',sp:v=>'速度'+sg(Math.round(v*100))+'%',rn:v=>'回復'+sg(Math.round(v*100))+'%',rg:v=>'リーチ'+sg(v),dr:v=>'被ダメ'+sg(-Math.round(v*100))+'%',kb:v=>'踏ん張り'+sg(-Math.round(v*100))+'%',react:v=>'反応時間'+sg(v)+'秒'};
const fmt=it=>it.s?Object.keys(it.s).map(k=>FM[k](it.s[k])).join(' ')+' ／ 重量'+it.w:it.d;
const TP=[{n:'ボクサー型(ジャブ中心)',r:[['lowen','retreat'],['near','jab'],['far','approach']]},{n:'ガード&反撃',r:[['oppatk','guard'],['oppstun','straight'],['lowen','retreat'],['near','jab'],['far','approach']]},{n:'突撃型',r:[['mid','rush'],['near','hook'],['near','jab'],['far','approach']]},{n:'持久戦型',r:[['lowen','focus'],['oppatk','guard'],['near','jab'],['far','approach']]},{n:'カウンター型',r:[['oppatk','counter'],['lowen','focus'],['near','jab'],['far','approach']]},{n:'ビーム型',r:[['near','jab'],['faraway','beam'],['far','approach']]},{n:'インファイター',r:[['oppatk','slip'],['lowen','focus'],['oppstun','upper'],['near','hook'],['near','jab'],['mid','rush'],['far','approach']]},{n:'アウトボクサー',r:[['lowen','retreat'],['near','jab'],['mid','side'],['far','approach']]},{n:'ヒット&アウェイ',r:[['oppatk','slip'],['lowen','focus'],['near','hook'],['near','jab'],['far','approach']]},{n:'ショーマン(バク宙)',r:[['oppatk','flip'],['lowen','focus'],['oppstun','straight'],['near','jab'],['far','approach']]}];
const ACC=['#f5b400','#66ffff','#ff5a7a','#7dff6a','#ffffff','#c08cff'],COL=['#3d6ea8','#a8433b','#4b7a54','#6b5a8a','#b8782f','#9aa0a6'],MC=['#999','#f08a24','#4aa8ff','#c08cff','#ffd24a','#4cd37b','#ff4aff','#4aff9a','#ff9a4a','#4ad0ff','#ffd24a','#ff4a6a'];
const RZ=[{},{crest:1,face:1},{crest:4,back:3,face:7},{shoulder:2,paint:1,face:4,embl:1},{crest:2,shoulder:3,back:2,face:3},{shoulder:6,back:7,face:8,armc:1,embl:3},{crest:3,shoulder:1,paint:6,face:6,legc:1,embl:1},{crest:9,back:2,face:9,legc:2,paint:8},{crest:6,shoulder:5,back:4,paint:3,face:5,embl:2},{crest:7,shoulder:6,back:9,face:2,armc:3},{crest:5,back:3,face:9,paint:4,legc:3,embl:4},{crest:6,shoulder:3,back:6,paint:5,face:7,armc:4,embl:5},{crest:5,shoulder:5,back:8,paint:3,face:5,armc:2,legc:2,embl:2},{crest:8,shoulder:7,back:6,paint:8,face:2,armc:4,legc:3,embl:4}];
const LG=[{n:'町内ロボ格闘',fee:0,pz:300,x:0.85,pt:[0,0,0,0,0,0],rn:'ミナト工業 MK-1',rc:'#c9c9c9',rules:[['near','jab'],['far','approach']]},
{n:'地区大会',fee:100,pz:700,x:0.9,pt:[1,1,4,1,1,2],rn:'サクラ高専 いちごZ',rc:'#e88fb0',rules:[['oppatk','guard'],['near','jab'],['far','approach']]},
{n:'地方大会',fee:200,pz:1300,x:1.1,pt:[2,6,6,4,5,2],rn:'シノビ工房 かげろう',rc:'#6b7fd6',rules:[['lowen','retreat'],['oppatk','slip'],['near','hook'],['near','jab'],['far','approach']]},
{n:'全国大会',fee:400,pz:2500,x:1.6,pt:[4,3,2,2,3,1],rn:'ネオ・ダイナミクス N7',rc:'#43c0b0',rules:[['lowen','focus'],['oppatk','guard'],['oppstun','upper'],['near','jab'],['far','approach']]},
{n:'世界選手権',fee:700,pz:4500,x:1.6,pt:[3,5,3,0,5,4],rn:'チャンプ・ブレイザー',rc:'#f06a3a',rules:[['lowen','retreat'],['oppatk','guard'],['oppguard','throw'],['oppstun','straight'],['mid','rush'],['near','jab'],['far','approach']]},
{n:'ボクシングジム杯',fee:1000,pz:7000,x:1.3,pt:[8,8,3,8,2,9],rn:'ジム・ジャガー',rc:'#d4a24a',rules:[['lowen','retreat'],['oppatk','slip'],['oppstun','straight'],['near','hook'],['near','jab'],['far','approach']]},
{n:'解体屋トーナメント',fee:1500,pz:10000,x:1.6,pt:[10,9,11,9,0,9],rn:'クラッシャー・ガンツ',rc:'#8a8f99',rules:[['lowen','focus'],['oppatk','guard'],['mid','rush'],['near','straight'],['near','jab'],['far','approach']]},
{n:'空中戦リーグ',fee:2200,pz:14000,x:1.25,pt:[11,10,9,10,6,10],rn:'ハヤブサ・イグニス',rc:'#4ad0ff',rules:[['oppatk','flip'],['lowen','retreat'],['oppstun','kick'],['near','low'],['near','jab'],['mid','side'],['far','approach']]},
{n:'王者決定戦',fee:3000,pz:20000,x:1.6,pt:[6,7,7,3,6,5],rn:'王者 ZERO',rc:'#b04bd6',rules:[['lowen','focus'],['oppatk','flip'],['oppguard','throw'],['oppstun','kick'],['faraway','beam'],['near','jab'],['far','approach']]},
{n:'軍事演習杯',fee:4200,pz:28000,x:1.6,pt:[9,11,3,4,5,11],rn:'ガルム Mk-II',rc:'#4b7a54',rules:[['lowen','focus'],['oppatk','guard'],['near','jab'],['mid','beam'],['faraway','beam'],['far','approach']]},
{n:'幽霊屋敷リーグ',fee:5500,pz:38000,x:0.9,pt:[11,6,6,4,11,10],rn:'マスクド・ファントム',rc:'#9a7ad6',rules:[['oppatk','flip'],['oppatk','slip'],['lowen','focus'],['oppstun','upper'],['near','hook'],['near','jab'],['far','side']]},
{n:'最強決定戦 OMEGA',fee:7000,pz:50000,x:0.8,pt:[7,2,5,5,7,6],rn:'OMEGA',rc:'#ffd24a',rules:[['lowen','focus'],['oppatk','counter'],['oppguard','throw'],['oppstun','kick'],['faraway','beam'],['mid','rush'],['near','jab'],['far','approach']]},
{n:'竜王の間',fee:9500,pz:70000,x:0.8,pt:[7,9,7,6,9,11],rn:'ドラゴン・キング',rc:'#c0392b',rules:[['lowen','focus'],['oppatk','counter'],['oppguard','throw'],['oppstun','kick'],['mid','rush'],['near','straight'],['near','jab'],['far','approach']]},
{n:'神々の頂 GOD-9',fee:13000,pz:100000,x:0.8,pt:[7,7,7,7,7,7],rn:'GOD-9',rc:'#ffffff',rules:[['lowen','focus'],['oppatk','flip'],['oppguard','throw'],['oppstun','kick'],['faraway','beam'],['mid','rush'],['near','jab'],['far','approach']]}];
const DEF=()=>({money:600,parts:PTO([0,0,0,0,0,0]),own:Object.assign(PTO(PK.map(()=>[0])),Object.fromEntries(CK.map(k=>[k,[0]]))),cz:Object.fromEntries(CK.map(k=>[k,0])),col:COL[0],acc:ACC[0],name:'RX-1',prog:[{c:'near',a:'jab'},{c:'far',a:'approach'},{c:'always',a:'wait'}],slots:3,unl:Object.fromEntries(Object.keys(UNL).map(k=>[k,0])),open:1,w:0,ko:0,snd:1,bgm:1,prs:[null,null,null],st:{},ach:{},ls:0,best:0,tipx:{}});
let S=DEF();try{const x=JSON.parse(localStorage.getItem('robobox4'));if(x)S=Object.assign(S,x)}catch(e){}
for(const k of CK)S.own[k]=S.own[k]||[0];S.cz=Object.assign(Object.fromEntries(CK.map(k=>[k,0])),S.cz);
const save=()=>{try{localStorage.setItem('robobox4',JSON.stringify(S))}catch(e){}};
let T='garage',GT='face',speed=1,rs=0,PT=[],FT=[],BM=[],RG=[],TRL=[[],[]],Q=[],RP=null,GH=null,GA=1,ctx=$('cv').getContext('2d'),AU,OL=null;
function snd(f,d=.1,ty='square',v=.04){if(!S.snd)return;try{AU=AU||new(window.AudioContext||window.webkitAudioContext)();const o=AU.createOscillator(),g=AU.createGain();o.type=ty;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,AU.currentTime+d);o.connect(g);g.connect(AU.destination);o.start();o.stop(AU.currentTime+d)}catch(e){}}
const burstR=(x,y,z,c,n)=>{for(let i=0;i<n;i++){const a=Math.random()*6.3,s=30+Math.random()*100;PT.push({x,y,z,vx:Math.cos(a)*s,vy:20+Math.random()*90,vz:Math.sin(a)*s,l:.5,c})}},flR=(x,z,t,c)=>FT.push({x,y:120,z,t,c,l:.9});
/* ---- 金属音 ---- */
const actx=()=>{AU=AU||new(window.AudioContext||window.webkitAudioContext)();if(AU.state==='suspended')AU.resume();return AU};let NB=null;
function noise(dur,vol,fc,q,fe){const a=actx(),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime;if(!NB){NB=a.createBuffer(1,a.sampleRate>>1,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}s.buffer=NB;f.type='bandpass';f.frequency.setValueAtTime(fc,t);if(fe)f.frequency.exponentialRampToValueAtTime(fe,t+dur);f.Q.value=q;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(a.destination);s.start(t);s.stop(t+dur+.02)}
function ringS(base,dur,vol,rat){const a=actx(),t=a.currentTime;rat.forEach((r,i)=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=base*r*(1+(Math.random()-.5)*.02);g.gain.setValueAtTime(vol/(1+i*.6),t);g.gain.exponentialRampToValueAtTime(.0005,t+dur/(1+i*.5));o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.02)})}
function thump(f0,f1,dur,vol){const a=actx(),t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.02)}
const MR=[1,2.76,5.4,8.93,13.3],SFX={hitL:()=>{ringS(700+Math.random()*250,.22,.09,MR);noise(.05,.28,3500,1.2)},hitH:()=>{ringS(210+Math.random()*60,.7,.14,MR);ringS(520,.3,.07,MR);noise(.12,.5,2200,.8,500);thump(110,40,.25,.35)},hitK:()=>{ringS(260+Math.random()*60,.6,.14,MR);noise(.1,.45,2600,.9,700);thump(130,45,.22,.3)},guard:()=>{ringS(1300+Math.random()*300,.35,.1,[1,2.4,4.1,6.2]);noise(.04,.2,5000,2)},cnt:()=>{ringS(170,.9,.18,MR);noise(.2,.5,1800,.7,300);thump(90,35,.35,.4)},break:()=>{noise(.6,.5,1500,.6,200);ringS(140,1,.14,MR);for(let i=0;i<6;i++)setTimeout(()=>noise(.03,.25,4000+Math.random()*2000,3),i*50+Math.random()*40)},whiff:()=>noise(.14,.12,1200,1.2,500),swing:v=>noise(v?.07:.12,.1,v?2200:1400,1.5,600),beam:()=>{const a=actx(),t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.type='sawtooth';o.frequency.setValueAtTime(1800,t);o.frequency.exponentialRampToValueAtTime(200,t+.25);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.3);noise(.2,.15,3000,1)},dodge:()=>{noise(.22,.14,2500,.8,300);ringS(900,.12,.03,[1,2.7])},flip:()=>{noise(.5,.16,3000,.7,250);ringS(700,.18,.04,[1,2.7])}};
H.burst=(...a)=>burstR(...a);H.fl=(...a)=>flR(...a);H.rgf=(x,z)=>RG.push({x,z,l:.35,r:10});H.bm=o=>BM.push(Object.assign({},o));H.sfx=(n,v)=>{if(!S.snd)return;try{SFX[n]&&SFX[n](v)}catch(e){}};H.say=t=>{if(M&&M.run&&!RP&&!(OL&&OL.live))$('msg').textContent=t};

const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]};
const mm=(a,b)=>[a[0]*b[0]+a[1]*b[3]+a[2]*b[6],a[0]*b[1]+a[1]*b[4]+a[2]*b[7],a[0]*b[2]+a[1]*b[5]+a[2]*b[8],a[3]*b[0]+a[4]*b[3]+a[5]*b[6],a[3]*b[1]+a[4]*b[4]+a[5]*b[7],a[3]*b[2]+a[4]*b[5]+a[5]*b[8],a[6]*b[0]+a[7]*b[3]+a[8]*b[6],a[6]*b[1]+a[7]*b[4]+a[8]*b[7],a[6]*b[2]+a[7]*b[5]+a[8]*b[8]];
const mv=(m,v)=>[m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];
const rz=a=>{const c=Math.cos(a),s=Math.sin(a);return[c,-s,0,s,c,0,0,0,1]},ry=a=>{const c=Math.cos(a),s=Math.sin(a);return[c,0,s,0,1,0,-s,0,c]},rx=a=>{const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,c,-s,0,s,c]};
let CAM;const LT=nrm([.4,1,.6]),FI=[[[0,4,6,2],[1,3,7,5]],[[0,1,5,4],[2,6,7,3]],[[0,2,3,1],[4,5,7,6]]];
function setCam(P,Tg){const f=nrm(sub(Tg,P)),r=nrm(crs(f,[0,1,0]));CAM={p:P,r,u:crs(r,f),f,F:600}}
const pj=(x,y,z)=>{const v=[x-CAM.p[0],y-CAM.p[1],z-CAM.p[2]],zc=dot(v,CAM.f),s=CAM.F/Math.max(zc,1);return[320+dot(v,CAM.r)*s,200-dot(v,CAM.u)*s,zc]};
const CC={};function sh(c,f){const k=c+(f*16|0);if(CC[k])return CC[k];const n=parseInt(c.slice(1),16),q=v=>Math.min(255,v*f|0);return CC[k]='rgb('+q(n>>16)+','+q(n>>8&255)+','+q(n&255)+')'}
const PAL={},shd=(c,i)=>{const a=PAL[c]||(PAL[c]=[]);return a[i]||(a[i]=sh(c,.4+i/14))};
const hx=(c,f)=>{const n=parseInt(c.slice(1),16),q=v=>Math.min(255,v*f|0);return'#'+((1<<24)+(q(n>>16)<<16)+(q(n>>8&255)<<8)+q(n&255)).toString(16).slice(1)};
function box(c,R,s,col,gl){const h=[s[0]/2,s[1]/2,s[2]/2],A=[[R[0],R[3],R[6]],[R[1],R[4],R[7]],[R[2],R[5],R[8]]],P=[];
for(let i=0;i<8;i++){const a=i&1?h[0]:-h[0],b=i&2?h[1]:-h[1],d=i&4?h[2]:-h[2];P.push(pj(c[0]+a*A[0][0]+b*A[1][0]+d*A[2][0],c[1]+a*A[0][1]+b*A[1][1]+d*A[2][1],c[2]+a*A[0][2]+b*A[1][2]+d*A[2][2]))}
const dgx=P[7][0]-P[0][0],dgy=P[7][1]-P[0][1],dg=Math.abs(dgx)+Math.abs(dgy);if(dg<1.5||(GH&&s[0]*s[1]*s[2]<500))return;
const fs=[];for(let ax=0;ax<3;ax++)for(let g=-1;g<=1;g+=2){const n=A[ax],fc0=c[0]+g*n[0]*h[ax],fc1=c[1]+g*n[1]*h[ax],fc2=c[2]+g*n[2]*h[ax];if(g*(n[0]*(CAM.p[0]-fc0)+n[1]*(CAM.p[1]-fc1)+n[2]*(CAM.p[2]-fc2))<=0)continue;
const f=GH?.8:gl?1.15:.42+.58*Math.max(0,g*(n[0]*LT[0]+n[1]*LT[1]+n[2]*LT[2]));fs.push({a:FI[ax][g>0?1:0],i:Math.max(0,Math.min(12,((f-.4)*14)|0))})}
const dx=c[0]-CAM.p[0],dy=c[1]-CAM.p[1],dz=c[2]-CAM.p[2],q={d:dx*dx+dy*dy+dz*dz,P,fs,col:GH||col,al:GA,st:dg>7};if(gl&&!GH)q.hc=[(P[0][0]+P[7][0])/2,(P[0][1]+P[7][1])/2,dg*.55];Q.push(q)}
function cyl(c,R,rb,rt,len,col,n,sx,sz,gl){n=n||8;sx=sx||1;sz=sz||1;const A0=[R[0],R[3],R[6]],A1=[R[1],R[4],R[7]],A2=[R[2],R[5],R[8]],P=[],h=len/2,fs=[],tl=(rb-rt)*(sx+sz)/2/len;
for(let k=0;k<2;k++){const rr=k?rt:rb,y=k?h:-h;for(let i=0;i<n;i++){const a=i/n*6.2832,x=rr*Math.cos(a)*sx,z=rr*Math.sin(a)*sz;P.push(pj(c[0]+x*A0[0]+y*A1[0]+z*A2[0],c[1]+x*A0[1]+y*A1[1]+z*A2[1],c[2]+x*A0[2]+y*A1[2]+z*A2[2]))}}
const vis=(nx,ny,nz,fx,fy,fz)=>nx*(CAM.p[0]-fx)+ny*(CAM.p[1]-fy)+nz*(CAM.p[2]-fz)>0,shd=(nx,ny,nz)=>Math.max(0,Math.min(12,((GH?.8:gl?1.15:.42+.58*Math.max(0,nx*LT[0]+ny*LT[1]+nz*LT[2]))-.4)*14|0));
for(let i=0;i<n;i++){const j=(i+1)%n,am=(i+.5)/n*6.2832,lx=Math.cos(am)/sx,lz=Math.sin(am)/sz,nl=Math.hypot(lx,tl,lz),a=lx/nl,b=tl/nl,d=lz/nl,w0=a*A0[0]+b*A1[0]+d*A2[0],w1=a*A0[1]+b*A1[1]+d*A2[1],w2=a*A0[2]+b*A1[2]+d*A2[2],rm=(rb+rt)/2;
const fx=c[0]+rm*Math.cos(am)*sx*A0[0]+rm*Math.sin(am)*sz*A2[0],fy=c[1]+rm*Math.cos(am)*sx*A0[1]+rm*Math.sin(am)*sz*A2[1],fz=c[2]+rm*Math.cos(am)*sx*A0[2]+rm*Math.sin(am)*sz*A2[2];if(vis(w0,w1,w2,fx,fy,fz))fs.push({a:[i,j,n+j,n+i],i:shd(w0,w1,w2)})}
const bot=[],top=[];for(let i=0;i<n;i++){bot.push(i);top.push(n+i)}
if(vis(-A1[0],-A1[1],-A1[2],c[0]-h*A1[0],c[1]-h*A1[1],c[2]-h*A1[2]))fs.push({a:bot,i:shd(-A1[0],-A1[1],-A1[2])});if(vis(A1[0],A1[1],A1[2],c[0]+h*A1[0],c[1]+h*A1[1],c[2]+h*A1[2]))fs.push({a:top,i:shd(A1[0],A1[1],A1[2])});
const dx=c[0]-CAM.p[0],dy=c[1]-CAM.p[1],dz=c[2]-CAM.p[2];Q.push({d:dx*dx+dy*dy+dz*dz,P,fs,col:GH||col,al:GA,st:false})}
function ell(c,R,rx_,ry_,rz_,col,gl){const u=y=>[c[0]+R[1]*y,c[1]+R[4]*y,c[2]+R[7]*y];cyl(u(-.72*ry_),R,.62,1,.56*ry_,col,8,rx_,rz_,gl);cyl(c,R,1,1,.9*ry_,col,8,rx_,rz_,gl);cyl(u(.72*ry_),R,1,.62,.56*ry_,col,8,rx_,rz_,gl)}
function rod(a,b,w,col){const d=sub(b,a),L=Math.hypot(d[0],d[1],d[2]);if(L<.1)return;const y=[d[0]/L,d[1]/L,d[2]/L];let x=nrm(crs(y,[0,0,1]));if(Math.abs(y[2])>.95)x=nrm(crs(y,[1,0,0]));const z=crs(x,y);box([(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],[x[0],y[0],z[0],x[1],y[1],z[1],x[2],y[2],z[2]],[w,L,w],col)}
function flush(){Q.sort((a,b)=>b.d-a.d);ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=.7;for(const q of Q){if(q.al<1)ctx.globalAlpha=q.al;const P=q.P,cl=q.col;for(const f of q.fs){const a=f.a;ctx.fillStyle=shd(cl,f.i);ctx.beginPath();ctx.moveTo(P[a[0]][0],P[a[0]][1]);for(let k=1;k<a.length;k++)ctx.lineTo(P[a[k]][0],P[a[k]][1]);ctx.closePath();ctx.fill();if(q.st&&q.al>=1)ctx.stroke()}
if(q.hc){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.22;ctx.fillStyle=cl;ctx.beginPath();ctx.arc(q.hc[0],q.hc[1],q.hc[2],0,6.3);ctx.fill();ctx.globalCompositeOperation='source-over'}if(q.al<1||q.hc)ctx.globalAlpha=1}Q=[]}
function poly(a,fill,st){ctx.beginPath();a.forEach((q,i)=>{const p=pj(q[0],q[1],q[2]);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])});ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(st){ctx.strokeStyle=st;ctx.stroke()}}
const circ=(x,z,r,y=0)=>Array.from({length:20},(_,i)=>[x+Math.cos(i/20*6.283)*r,y,z+Math.sin(i/20*6.283)*r]);
function pose(r,tm){if(r.rp)return r.ps;const P=Object.assign({},PS0),s=r.st,mdx=r.md[0],mdz=r.md[1],bn=Math.sin(tm*7+r.wt),pd=r.pd;
P.cr=.1+.025*bn;P.l0y=.02+.03*Math.max(0,bn);P.l1y=.02+.03*Math.max(0,-bn);P.lean+=.02*bn;P.twist+=.05*Math.sin(tm*3+r.wt);P.off=1.5*bn;P.a0s+=.05*bn;P.a1s-=.05*bn;
if(r.mv){const c=r.wph,S1=14,A0=Math.cos(c),A1=Math.cos(c+3.1416);P.l0x=14+mdx*S1*A0;P.l0z=2+mdz*S1*A0;P.l0y=Math.max(0,-Math.sin(c))*.16;P.l1x=-12+mdx*S1*A1;P.l1z=-2+mdz*S1*A1;P.l1y=Math.max(0,Math.sin(c))*.16;P.cr=.12+.03*Math.abs(Math.sin(c));P.lean=.16;P.twist=.2+.08*Math.sin(c);P.a0s=.95+.08*Math.sin(c);P.a1s=.85-.08*Math.sin(c)}
if(s==='atk'){const a=r.atk,e=r.ph==='wind'?-.3*(1-r.t/r.tw):Math.max(0,r.t/r.tr);
if(a==='jab'){P.a0s=.95+.6*e;P.a0e=2-1.95*e;P.twist=.2+.18*e;P.off=7*e;P.l0x=14+8*e;P.lean=.1+.1*e;P.cr=.1+.03*e}
else if(a==='hook'){P.a0s=1.45;P.a0e=1.3;P.a0y=-1+1.7*e;P.a0b=-.25;P.twist=.2+.7*e;P.lean=.1+.1*e;P.off=7*e;P.l1x=-12+6*e;P.cr=.12}
else if(a==='straight'){P.a1s=.85+.7*e;P.a1e=2.1-2.05*e;P.twist=.2-.6*e;P.off=13*e;P.l0x=14+6*e;P.l1x=-12+10*e;P.l1y=.03+.04*e;P.lean=.1+.28*e;P.cr=.1+.05*e}
else if(a==='upper'){const dp=Math.max(0,-e*3);P.cr=.1+.18*dp-.05*Math.max(0,e);P.a1s=.9+1.5*e;P.a1e=2-e;P.lean=.1-.25*e+.1*dp;P.off=8*e;P.twist=.2-.5*e;P.l1y=.03+.03*e}
else if(a==='kick'||a==='low'){const k=a==='kick'?.72:.26,w=e<0?-e/.3:0;P.l0x=14+(e>0?34*e:-8*w);P.l0y=e>0?.04+k*e:.04+.3*w;P.l1x=-4;P.l1y=0;P.cr=.12;P.lean=-.2*Math.max(0,e);P.a0s=1.5;P.a1s=1.25;P.a0e=P.a1e=1.2;P.twist=.2-.3*e;P.off=6*e}
else if(a==='rush'){const q=Math.sin(tm*24),u=Math.cos(tm*24);P.lean=.55;P.cr=.2;P.l0x=14+22*q;P.l0y=.2*Math.max(0,u);P.l1x=-12-22*q;P.l1y=.2*Math.max(0,-u);P.a0s=P.a1s=1.4+.2*e;P.a0e=P.a1e=.6-.4*e;P.off=14*Math.max(0,e);P.twist=.1}
else if(a==='throw'){P.a0s=P.a1s=1.3+.3*e;P.a0e=P.a1e=.6-.5*e;P.lean=.3+.3*e;P.off=10*e;P.cr=.18;P.l0x=22;P.l1x=-8;P.twist=0}
else if(a==='beam'){P.a0s=P.a1s=1.55;P.a0e=P.a1e=.1;P.lean=-.12;P.cr=.22;P.l0x=20;P.l1x=-20;P.off=-4;P.twist=0}}
else if(s==='guard'){P.a0s=1.2;P.a1s=1.1;P.a0e=2.3;P.a1e=2.45;P.a0b=P.a1b=.28;P.lean=.25;P.cr=.22;P.head=.3;P.l0x=10;P.l1x=-8;P.off=-3}
else if(s==='counter'){P.a0s=P.a1s=.9;P.a0e=P.a1e=1.2;P.cr=.28;P.lean=.2;P.l0x=18;P.l1x=-14}
else if(s==='rest'){P.a0s=P.a1s=.3;P.a0e=P.a1e=.5;P.cr=.38;P.head=.5;P.lean=.35;P.l0x=8;P.l1x=-6}
else if(s==='hit'){P.lean=-.45;P.head=-.6;P.a0s=.4;P.a1s=.7;P.a0e=.8;P.a1e=.6;P.cr=.2;P.l0x=-4;P.l0y=.14;P.l1x=-18;P.off=-12;P.roll=.25*Math.sin(r.t*40);P.twist=-.1}
else if(s==='dodge'){const k=r.dk;if(k==='flip'){P.l0y=P.l1y=.5;P.l0x=P.l1x=16;P.cr=0;P.a0s=P.a1s=1.9;P.a0e=P.a1e=1.5;P.lean=.2}
else if(k==='slip'){P.roll=.5*r.cs;P.twist=.2+.6*r.cs;P.lean=.25;P.cr=.2;P.l0z=2+22*r.cs;P.l1z=-2+8*r.cs;P.l0y=.08;P.l1y=.03;P.a0s=1.4;P.a1s=.9;P.a0e=P.a1e=1.5;P.off=-4}
else{P.lean=-.5;P.head=-.3;P.cr=.2;P.l0x=24;P.l1x=2;P.l0y=.06;P.l1y=.04;P.a0s=1.1;P.a1s=.9;P.a0e=P.a1e=1.6;P.off=-10}}
else if(s==='down'){P.a0s=-.4;P.a0e=.3;P.a1s=.6;P.a1e=.4;P.l0x=26;P.l1x=-18;P.l0y=P.l1y=0;P.cr=0;P.head=-.3;P.lean=0;P.off=0;P.twist=0}
if(s!=='down'){if(pd.larm<=0){P.a0s=.15+.1*Math.sin(tm*3+r.wt);P.a0e=.25;P.a0b=-.1}if(pd.rarm<=0){P.a1s=.1+.1*Math.sin(tm*3+1+r.wt);P.a1e=.3;P.a1b=-.1}if(pd.legs<=0){P.cr+=.16;P.lean+=.08}if(pd.head<=0)P.head=.9+.1*Math.sin(tm*2.3)}
const kk=s==='atk'||s==='dodge'?.7:s==='hit'?.6:s==='down'?.12:.3;for(const q in P){const f=q[0]==='l'&&q!=='lean'?Math.max(kk,.5):kk;r.ps[q]+=(P[q]-r.ps[q])*f}return r.ps}
const D_HD=[[18,16,18],[21,15,21],[16,15,16],[20,17,22],[22,20,22],[18,15,18],[19,17,19],[22,19,22],[22,18,22],[19,14,19],[24,20,24],[16,15,16],[20,17,20],[21,18,21]],D_CH=[[20,32,38],[14,24,34],[24,34,40],[26,44,44],[22,34,38],[24,40,42],[16,26,34],[28,48,46],[22,38,40],[30,50,50],[14,22,30],[24,36,40],[22,40,42],[26,38,44]],D_AR=[[24,22,8,9],[28,27,7,9],[24,22,12,12],[24,22,9,16],[20,18,10,12],[24,22,10,10],[26,24,7,8],[26,24,11,14],[22,20,10,12],[28,26,7,9],[24,22,12,13],[26,24,11,13],[24,22,11,12],[26,24,8,10]],D_LG=[[28,28,10],[30,30,8],[24,22,14],[28,28,10],[34,32,7],[26,22,11],[26,24,16],[28,26,9],[30,30,7],[24,24,15],[28,26,10],[28,28,12],[28,28,13],[32,32,8]],FC_=['#9aa0a6','#9aa0a6','#7b8088','#c0392b','#8a8f99','#c9772a','#cfd8e6','#4a90d9','#888','#cfd8e6','#555','#e8892a','#9aa0a6','#aab'];
function robot3(r,tm){const pt=r.pt,cz=r.cz||{},P=pose(r,tm),[L1,L2,lw]=D_LG[pt.leg],[tx,tz,th]=D_CH[pt.chest],[ul,fl,aw,fs]=D_AR[pt.arm],hs=D_HD[pt.head],acc=r.acc,col=r.col,bc=cz.paint===4?'#23272e':col,dkb=cz.paint===2?hx(acc,.55):hx(col,.62),ad=hx(acc,.7),dkc='#2a2e35',hy=hs[1]/2,hh=pt.head,ch=pt.chest,fa=r.fa||0,jmp=fa?Math.sin(fa/2)*38:0,mvg=r.mv,atk=r.st==='atk',pd=r.pd;
const V=z=>lvl(pd[z]),pc=(c,l)=>l===0?c:l===1?hx(c,.92):l===2?hx(c,.8):l===3?hx(c,.64):'#2a2420',lh=V('head'),lt=V('torso'),lL=V('legs'),cH=pc('#59606c',lh),cT=pc(bc,lt),cL=pc(col,lL),dkL=pc(dkb,lL);
let root0=mm(ry(r.ang),rx(P.roll));if(r.fall)root0=mm(root0,rz(r.fall));const root=fa?mm(root0,rz(fa)):root0;
const O=[r.x+r.ux*P.off,0,r.z+r.uz*P.off],at=(R,o,v)=>{const q=mv(R,v);return[o[0]+q[0],o[1]+q[1],o[2]+q[2]]};
const Lt=L1+L2,H=Lt*(1-P.cr)+4,Wp=at(root0,O,[0,H+jmp,0]);
const ik=(ax,ay)=>{let vx=ax,vy=ay-(H-5),d=Math.hypot(vx,vy);const mx=Lt-.5;if(d>mx){vx*=mx/d;vy*=mx/d;d=mx}if(d<10)d=10;const phi=Math.atan2(vx,-vy),al=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d)))),h=phi+al,kx=L1*Math.sin(h),ky=-L1*Math.cos(h);return[h,Math.atan2(vx-kx,-(vy-ky))-h]};
if(!GH){if(!r.fall){poly(circ(r.x,r.z,30),'rgba(0,0,0,'+(.35-jmp*.006)+')');if(r.st==='counter'||r.st==='rest'){ctx.lineWidth=3;poly(circ(r.x,r.z,44+Math.sin(tm*12)*3),null,r.st==='counter'?'#f5b400':r.rk==='hp'?'#4cd37b':'#4aa8ff')}}
if(r.gh&&r.gh.length){const n=r.gh.length;r.gh.forEach((g,i)=>{GH='#8ff';GA=.1+.14*(i+1)/n;robot3(g,tm);GH=null;GA=1})}}
box(Wp,mm(root,ry(.4*P.twist)),[16,10,26],dkc);
const Rl=mm(root,mm(rz(-P.lean),ry(P.twist))),Wt=at(Rl,Wp,[0,5+th/2,0]),TT=v=>at(Rl,Wt,v);
box(at(Rl,Wp,[0,5,0]),Rl,[tx+2,3,tz+2],'#1c1f24');box(at(Rl,Wp,[tx/2+1,5,0]),Rl,[1.5,4,7],acc,1);
if(ch===12){cyl(Wt,Rl,.78,1.05,th,cT,8,tx/2,tz/2);for(const z of[-1,1])ell(TT([tx/2-1,th*.2,z*tz*.23]),Rl,5,5,7,cT);for(let q=0;q<3;q++)for(const z of[-1,1])box(TT([tx/2-.6,-th*.05-q*5,z*4]),Rl,[2,4,6],hx(col,1.12))}
else if(ch===13){ell(Wt,Rl,tx/2,th/2,tz/2,cT)}else box(Wt,Rl,[tx,th,tz],cT);
if(ch!==12&&ch!==13){box(TT([0,-th*.36,0]),Rl,[tx+.6,th*.26,tz+.6],hx(col,.45));for(let i=0;i<3;i++)box(TT([tx/2+.4,-4+i*4,0]),Rl,[1,1.4,tz*.55],'#15181d')}
if(lt<4)box(TT([tx/2+.4,th*.18,0]),Rl,[1.5,5,12],acc,1);
if(lt>=4){box(TT([tx/2+.5,0,0]),Rl,[1.2,th*.7,tz*.8],'#140c0c');box(TT([tx/2+1,2,0]),Rl,[1,9,9],'#ff2a2a',1)}
if(ch===1)box(TT([-tx/2-3,6,0]),mm(Rl,rz(.5)),[2,16,tz*.7],dkc);
if(ch===2){for(const z of[-8,8])box(TT([-tx/2-5,0,z]),Rl,[8,th*.7,9],'#2e9e6b');box(TT([-tx/2-9.6,0,0]),Rl,[1.5,6,tz*.5],'#ffcf3a',1)}
if(ch===3||ch===9){box(TT([tx/2+1,0,0]),Rl,[2,th*.6,tz*.85],'#cfd3d8');for(let k=0;k<4;k++)box(TT([tx/2+1.8,-th*.38+k*3.5,0]),Rl,[1,1.6,tz*.7],k%2?'#e8b100':'#222');if(ch===9)box(TT([-tx/2-2,0,0]),Rl,[3,th*.7,tz*.9],'#7b8088')}
if(ch===4){box(TT([tx/2+1,4,0]),Rl,[2,13,13],'#ffb040',1);box(TT([-tx/2-3,4,0]),Rl,[4,13,13],'#ffb040',1)}
if(ch===5)for(const z of[-1,1]){box(TT([tx/2+2,6,z*tz*.22]),Rl,[4,th*.32,tz*.4],hx(col,1.15));box(TT([tx/2+1,-8,z*5]),Rl,[2,5,7],hx(col,.8))}
if(ch===6){box(TT([tx/2+1,4,0]),mm(Rl,rz(-.5)),[3,16,tz*.8],dkc);for(const z of[-10,10])box(TT([-tx/2-3,8,z]),mm(Rl,rz(.7)),[2,14,3],dkc)}
if(ch===7){box(TT([tx/2+1,8,0]),Rl,[3,6,tz*.9],'#7b8088');box(TT([tx/2+1.5,0,0]),Rl,[1.5,10,10],'#66ffff',1)}
if(ch===8){box(TT([tx/2+1,-th*.3,0]),Rl,[3,5,tz+1],'#ffd24a');box(TT([tx/2+2.5,-th*.3,0]),Rl,[1,4,4],'#f33',1)}
if(ch===10)for(const z of[-8,8])box(TT([-tx/2-2,6,z]),mm(Rl,rz(.8)),[2,12,4],dkc);
if(ch===11){box(TT([tx/2+1,4,0]),Rl,[2,14,14],'#66ffff',1);for(const z of[-1,1])box(TT([0,-6,z*tz/2]),Rl,[tx*.7,8,1],'#66ffff',1)}
const em=cz.embl;if(em===1){box(TT([tx/2+.5,6,0]),Rl,[1,9,13],'#eee');box(TT([tx/2+1,6,-3]),Rl,[1,6,2],'#222');box(TT([tx/2+1,6,3]),Rl,[1,6,2],'#222')}
if(em===2){for(const z of[-1,1])box(TT([tx/2+.8,4,z*3.5]),mm(Rl,rx(z*.5)),[1,12,3],'#ff3030',1)}
if(em===3){box(TT([tx/2+.6,6,0]),Rl,[1,10,12],'#e8e8e8');for(const z of[-3,3])box(TT([tx/2+1.2,7,z]),Rl,[1,3,3],'#111');box(TT([tx/2+1.2,2,0]),Rl,[1,3,6],'#111')}
if(em===4){box(TT([tx/2+1,-th*.3,0]),Rl,[3,5,tz+1],'#ffd24a');box(TT([tx/2+2.5,-th*.3,0]),Rl,[1,5,6],'#c0392b',1)}
if(em===5){box(TT([tx/2+.5,6,-8]),Rl,[1.5,5,5],'#ffd24a',1);box(TT([tx/2+.4,10,-8]),Rl,[1,5,3],'#c0392b')}
if(cz.paint===1)for(const z of[-6,6])box(TT([0,0,z]),Rl,[tx+.8,th*.92,3],acc);
if(cz.paint===3)for(let i=0;i<5;i++)box(TT([tx/2+.4,-th/2+4+(i%2)*2,(i-2)*6]),Rl,[1,8+(i%2?0:5),4],'#ff6a1e',1);
if(cz.paint===5){box(TT([0,th/2,0]),Rl,[tx+1,2,tz+1],'#ffd24a');box(TT([0,-th/2,0]),Rl,[tx+1,2,tz+1],'#ffd24a')}
if(cz.paint===6)for(let k=0;k<6;k++)box(TT([tx/2+.4,-th*.15,(k-2.5)*5]),Rl,[1,6,5],k%2?'#222':'#e8b100');
if(cz.paint===7)for(const[a,b,c]of[[3,-2,6],[6,2,-5],[-3,6,3],[8,-8,-4],[2,10,-8]])box(TT([tx/2+.3,b,c]),Rl,[1,a+2,6],a>5?hx(col,.55):hx(col,1.25));
if(cz.paint===8)for(const z of[-1,1])box(TT([tx/2+.4,0,z*tz*.4]),Rl,[1,th*.8,1.5],acc,1);
const bk=cz.back;
if(bk===1)for(const z of[-8,8]){box(TT([-tx/2-6,2,z]),Rl,[8,24,7],'#555');box(TT([-tx/2-6,-11,z]),Rl,[6,3,5],mvg||atk?'#ffb040':'#66ffff',1)}
if(bk===2)for(const z of[-1,1]){const f2=.9+.15*Math.sin(tm*4*(mvg?2:1)),Rw=mm(Rl,rx(z*f2)),Rv=mm(Rl,rx(z*(f2+.5))),b=TT([-tx/2-4,10,z*8]);box(at(Rw,b,[0,13,0]),Rw,[2.5,26,6],dkc);box(at(Rw,b,[0,13,0]),Rw,[3,18,2],acc,1);box(at(Rv,b,[0,9,0]),Rv,[2,18,5],'#444')}
if(bk===3){let R=root,p=at(root,Wp,[-8,0,0]);for(let i=0;i<6;i++){R=mm(R,mm(rz(-.22),ry(Math.sin(tm*5+i*.9)*.3)));box(at(R,p,[-4,0,0]),R,[8,4-i*.4,4-i*.4],i>3?acc:dkc,i>4);p=at(R,p,[-8,0,0])}}
if(bk===4){const Rc=mm(Rl,rz(-(.12+.08*Math.sin(tm*3+r.wt)+(mvg?.3:0))));box(at(Rc,TT([-tx/2-1,th/2-3,0]),[0,-17,0]),Rc,[1.5,34,tz+8],'#8a1d2b')}
if(bk===5){box(TT([-tx/2-3,th/2+14,0]),Rl,[2,48,2],'#bbb');const Rg=mm(Rl,ry(Math.sin(tm*4)*.3));box(at(Rg,TT([-tx/2-3,th/2+30,0]),[0,0,-10]),Rg,[1.5,14,20],acc)}
if(bk===6){box(TT([-tx/2-5,4,0]),Rl,[3,26,26],'#66ffff',1);box(TT([-tx/2-6.6,4,0]),Rl,[3,16,16],'#102030')}
if(bk===7){box(TT([-tx/2-6,th/2,0]),Rl,[8,7,10],'#555');for(const z of[-3,0,3])box(TT([-tx/2-8,th/2+10,z]),mm(Rl,rz(.3)),[3,16,2.5],'#777');box(TT([-tx/2-11,th/2+18,0]),Rl,[3,3,10],'#ff8a1e',1)}
if(bk===8)for(const z of[-1,1]){const Rb=mm(Rl,rx(z*.35)),b=TT([-tx/2-6,4,z*10]);box(b,Rb,[9,26,9],'#444');box(at(Rb,b,[0,-14,0]),Rb,[7,3,7],mvg||atk?'#ffb040':'#66ffff',1)}
if(bk===9)for(let k=0;k<4;k++){const Ra=mm(Rl,rz(.2+.12*Math.sin(tm*3+k)));box(at(Ra,TT([-tx/2-4,th/2,(k-1.5)*6]),[0,10-k,0]),Ra,[1.5,20-k*2,1.5],'#aaa');box(at(Ra,TT([-tx/2-4,th/2,(k-1.5)*6]),[0,20-k*2,0]),Ra,[3,3,3],acc,1)}
const Rh=mm(Rl,mm(ry(-.7*P.twist),rz(-P.head))),Wh=at(Rl,Wp,[0,5+th+hy+3,0]),HP=v=>at(Rh,Wh,v),NK=at(Rl,Wp,[0,5+th,0]);
box(at(Rl,Wp,[0,5+th+1,0]),Rl,[6,4,6],dkc);
if(hh===12)ell(Wh,Rh,hs[0]/2,hy,hs[2]/2,cH);else if(hh===13){ell(HP([1,2,0]),Rh,hs[0]/2,hy*.8,hs[2]/2,cH);ell(HP([4,-hy*.6,0]),Rh,hs[0]*.35,hy*.5,hs[2]*.4,pc('#6b717c',lh))}else box(Wh,Rh,hs,cH);
for(const z of[-1,1])box(HP([0,0,z*(hs[2]/2+1.5)]),Rh,[6,6,3],dkc);
rod(at(Rl,NK,[-tx/2+2,-4,5]),HP([-hs[0]/2,-hy,5]),1.6,'#15181d');rod(at(Rl,NK,[-tx/2+2,-4,-5]),HP([-hs[0]/2,-hy,-5]),1.6,'#15181d');
box(HP([hs[0]/2-.5,hy-1,0]),Rh,[2,2,hs[2]],hx(col,.7));
if(hh===1)box(HP([0,hy+2.5,0]),Rh,[hs[0]-4,5,hs[2]-4],col);
if(hh===2){box(HP([hs[0]/2+4,3,hs[2]/2+2]),Rh,[9,4,4],'#222');box(HP([hs[0]/2+9,3,hs[2]/2+2]),Rh,[1,3,3],'#6ff',1)}
if(hh===3)for(const z of[-1,1])box(HP([hs[0]/2+1,hy-2,z*(hs[2]/2+1)]),mm(Rh,mm(rz(-1.1),rx(z*.5))),[3,10,3],'#eee');
if(hh===4){for(const z of[-1,1])box(HP([0,-1,z*(hs[2]/2+.5)]),Rh,[hs[0]-2,9,2],'#7b8088');box(HP([hs[0]/2-1,-hy-1,0]),Rh,[7,5,hs[2]-4],'#7b8088');box(HP([0,hy+.5,0]),Rh,[hs[0]-6,2,hs[2]-6],'#222')}
if(hh===5)box(HP([-3,hy+5,0]),mm(Rh,rz(.5)),[3,11,hs[2]*.8],acc);
if(hh===6)for(let k=0;k<6;k++){const a=k*1.047+tm;box(HP([Math.cos(a)*10,hy+7,Math.sin(a)*10]),Rh,[3,3,3],'#6ff',1)}
if(hh===7){for(let k=-2;k<=2;k++)box(HP([0,hy+3+(2-Math.abs(k)),k*4.5]),Rh,[3,5+(2-Math.abs(k))*2,3],'#ffd24a');for(const z of[-1,1])box(HP([hs[0]/2-2,-hy-1,z*6]),Rh,[6,5,3],'#7b8088')}
if(hh===8){box(HP([hs[0]/2-1,hy-2,0]),Rh,[3,4,hs[2]+1],'#7b8088');box(HP([hs[0]/2-2,-hy+1,0]),Rh,[7,5,hs[2]-3],'#7b8088')}
if(hh===9)box(HP([hs[0]/2-1,hy+1,0]),mm(Rh,rz(-.6)),[3,9,hs[2]*.9],acc);
if(hh===10){box(HP([-hs[0]/2-2,0,0]),Rh,[7,hs[1]+2,hs[2]+2],'#7b8088');box(HP([0,hy+2,0]),Rh,[hs[0],3,3],'#7b8088');for(const z of[-1,1])box(HP([2,-2,z*(hs[2]/2+1)]),Rh,[hs[0]*.7,8,2],'#7b8088')}
if(hh===11)box(HP([-hs[0]/2-6,hy-1,0]),mm(Rh,rz(1.1)),[3,16,3],'#222');
const fv=cz.face||0,fx=hs[0]/2+.4,FZ=hs[2];
if(lh>=4)box(HP([0,hy,0]),Rh,[3,3,3],'#ff3b2a',1);
if(lh<4){
if(fv===0)box(HP([fx,2,0]),Rh,[1.5,3,FZ*.7],acc,1);
if(fv===1)for(const z of[-4,4])box(HP([fx,2,z]),Rh,[1.5,4.5,4.5],acc,1);
if(fv===2){box(HP([fx,1,0]),Rh,[1,10,10],dkc);box(HP([fx+.5,1,Math.sin(tm*2)*1.5]),Rh,[1.5,5,5],'#ff3b30',1)}
if(fv===3)for(const z of[-1,1])box(HP([fx,2,z*FZ*.22]),mm(Rh,rx(z*.45)),[1.5,3,FZ*.42],acc,1);
if(fv===4){box(HP([0,2,0]),Rh,[hs[0]+1,3,FZ+1],dkc);for(const z of[-4.5,4.5]){box(HP([fx,2,z]),Rh,[1.5,8,8],dkc);box(HP([fx+.4,2,z]),Rh,[1,5.5,5.5],acc,1)}}
if(fv===5){for(const z of[-4,4]){box(HP([fx,2,z]),Rh,[1.5,5,5],'#111');box(HP([fx+.4,2,z]),Rh,[1,1.5,1.5],acc,1)}for(let k=-2;k<=2;k++)box(HP([fx,-4,k*3]),Rh,[1.5,3,1.6],'#ddd')}
if(fv===6){box(HP([fx,3,0]),Rh,[1.5,2,FZ*.5],acc,1);for(let k=0;k<4;k++)box(HP([fx,-1-k*2.2,0]),Rh,[1.5,1,FZ*.65],'#15181d')}
if(fv===7)box(HP([fx,2,Math.sin(tm*2.5)*FZ*.3]),Rh,[1.5,2.5,FZ*.35],acc,1);
if(fv===8)for(const q of[-1,1])box(HP([fx,2,0]),mm(Rh,rx(q*.6)),[1.5,3,FZ*.8],acc,1);
if(fv===9)for(const z of[-1,1]){box(HP([fx,2,z*4.5]),Rh,[1.5,6,5],'#fff',1);box(HP([fx,6.5,z*4.5]),mm(Rh,rx(z*-.25)),[1.5,1.5,6],dkc)}}
const sn=pt.sen;if(sn>=1)box(HP([-hs[0]/2+3,hy-1,-hs[2]/2-2]),Rh,[5,5,3],'#222');if(sn>=2&&lh<4)box(HP([-hs[0]/2+6,hy-1,-hs[2]/2-2]),Rh,[1,3,3],'#6ff',1);
if(sn===3||sn===6)box(HP([-4,hy+7,6]),Rh,[2,12,2],'#888');if(sn===4)box(HP([-6,hy+4,-6]),Rh,[2,8,8],'#ffb040');if(sn===5)box(HP([hs[0]/2,hy+1,0]),Rh,[9,1.2,1.2],'#ff3b30',1);if(sn===7)box(HP([0,hy+8,0]),Rh,[4,4,4],'#ffd24a',1);
if(sn===8)box(HP([hs[0]/2-1,hy-2,hs[2]/2+3]),Rh,[5,6,6],'#222');if(sn===9)for(const z of[-1,1])box(HP([-3,hy+3,z*5]),Rh,[3,3,3],'#7dff6a',1);if(sn===10)for(let k=0;k<5;k++){const a=k*1.257+tm*2;box(HP([-2+Math.cos(a)*6,hy+5,Math.sin(a)*6]),Rh,[2,2,2],'#6ff',1)}if(sn===11)box(HP([hs[0]/2-1,hy+4,0]),Rh,[3,5,5],'#ffd24a',1);
const cr=cz.crest;
if(cr===1)for(let i=-2;i<=2;i++)box(HP([i*4,hy+3+(3-Math.abs(i))*2,0]),Rh,[3,4+(3-Math.abs(i))*3,2.5],acc);
if(cr===2)for(const z of[-1,1]){const Rc=mm(Rh,rx(z*.5)),c1=HP([0,hy+4,z*6]);box(c1,Rc,[3.5,11,3.5],'#eee');const Rd=mm(Rc,rx(z*.7));box(at(Rd,at(Rc,c1,[0,5.5,0]),[0,5,0]),Rd,[3,10,3],'#ffd24a')}
if(cr===3)for(const z of[-1,1]){box(HP([-3,hy+11,z*5]),mm(Rh,rz(.25)),[1.5,22,1.5],'#aaa');box(HP([-8,hy+22,z*5]),Rh,[3,3,3],acc,1)}
if(cr===4){box(HP([-5,hy+9,0]),mm(Rh,rz(.45)),[3,22,2],acc,1);box(HP([-9,hy+5,0]),mm(Rh,rz(.9)),[3,14,2],'#ddd')}
if(cr===5)for(let i=0;i<5;i++){const z=(i-2)*4;box(HP([-hs[0]/2-4,1+(i%2)*3,z]),mm(Rh,rz(1.25)),[3,13-Math.abs(i-2),3],'#ff8a1e');box(HP([-hs[0]/2-1,hy+1,z]),mm(Rh,rz(.9)),[3,12,3],'#d23')}
if(cr===6)for(let i=0;i<5;i++){const f2=(i%2?8:13)*(1+.25*Math.sin(tm*10+i));box(HP([0,hy+f2/2+1,(i-2)*5]),Rh,[3,f2,3],'#ff6a1e',1)}
if(cr===7){for(const z of[-1,1]){box(HP([0,-1,z*(hs[2]/2+3.5)]),Rh,[8,9,3],'#222');box(HP([0,-1,z*(hs[2]/2+5)]),Rh,[6,6,.8],acc,1)}box(HP([0,hy+2,0]),Rh,[3,2,hs[2]+8],'#222')}
if(cr===8)for(let k=0;k<8;k++){const a=k*.785+tm*.8;box(HP([Math.cos(a)*11,hy+14,Math.sin(a)*11]),Rh,[3,2,3],'#ffe9a0',1)}
if(cr===9)box(HP([hs[0]/2,hy+8,0]),mm(Rh,rz(-.5)),[3,16,3],'#ffd24a',1);
const sc=cz.shoulder,tl=TRL[r.sd||0],ac_=cz.armc,V2=[V('larm'),V('rarm')];
for(let i=0;i<2;i++){const sd=i?-1:1,la=V2[i],cA=pc(col,la),dA=pc(dkb,la),S0=at(Rl,Wp,[0,5+th-6,sd*(tz/2+aw/2+1)]),Ru=mm(Rl,mm(rx((i?P.a1b:P.a0b)*sd),mm(ry(i?P.a1y:P.a0y),rz(i?P.a1s:P.a0s))));
box(S0,Rl,[8,8,8],MC[pt.mot],1);
if(ch===3||ch===7||ch===9)box(at(Rl,S0,[0,4,0]),Rl,[tx*.7,6,aw+7],'#cfd3d8');else if(!sc&&pt.arm<12)box(at(Rl,S0,[0,4,0]),Rl,[12,5,aw+5],hx(col,.8));
if(sc===1)for(let k=0;k<3;k++)box(at(Rl,S0,[(k-1)*4,6+(k===1?3:0),sd*2]),Rl,[3,8+(k===1?4:0),3],'#ccc');
if(sc===2){box(at(Rl,S0,[0,4,0]),Rl,[16,9,aw+10],hx(col,.8));box(at(Rl,S0,[0,8.6,0]),Rl,[14,1.5,aw+8],acc)}
if(sc===3)box(at(Rl,S0,[-8,9,sd*2]),mm(Rl,rz(.9)),[3,20,2],'#dde');
if(sc===4){box(at(Rl,S0,[-2,8,0]),Rl,[9,6,8],'#555');box(at(Rl,S0,[3,8.5,0]),Rl,[2,3,6],'#ff8a1e',1)}
if(sc===5){box(at(Rl,S0,[0,4,0]),Rl,[14,6,aw+8],'#7a1d2b');for(let k=0;k<3;k++)box(at(Rl,S0,[-4+k*4,8+k,sd*(5+k*2)]),mm(Rl,rx(sd*.6)),[3,9,3],'#d23')}
if(sc===6){box(at(Rl,S0,[0,9,0]),Rl,[16,5,5],'#555');box(at(Rl,S0,[8,9,0]),Rl,[2,6,6],'#f80',1)}
if(sc===7){box(at(Rl,S0,[0,4,0]),Rl,[16,9,aw+10],hx(col,.8));box(at(Rl,S0,[-2,12,sd*3]),mm(Rl,rx(sd*.4)),[3,12,3],'#eee')}
const E=at(Ru,S0,[0,-ul,0]),Rf=mm(Ru,rz(i?P.a1e:P.a0e));
if(pt.arm===12){cyl(at(Ru,S0,[0,-ul*.25,0]),Ru,.72,.55,ul*.5,cA,8,aw/2+1,aw/2+1);cyl(at(Ru,S0,[0,-ul*.75,0]),Ru,.4,.78,ul*.5,cA,8,aw/2+1,aw/2+1);cyl(at(Rf,E,[0,-fl/2,0]),Rf,.35,.7,fl,dA,8,aw/2+1,aw/2+1)}
else if(pt.arm===13){cyl(at(Ru,S0,[0,-ul/2,0]),Ru,.42,.55,ul,cA,8,aw/2+1,aw/2+1);cyl(at(Rf,E,[0,-fl/2,0]),Rf,.32,.46,fl,dA,8,aw/2+1,aw/2+1)}
else{box(at(Ru,S0,[0,-ul/2,0]),Ru,[aw,ul,aw],cA);box(at(Rf,E,[0,-fl/2,0]),Rf,[aw-1,fl,aw-1],dA)}
box(E,Ru,[aw+2,aw+2,aw+2],la>=4?'#ff3b2a':dkc,la>=4);box(at(Rf,E,[0,-fl*.4,0]),Rf,[aw+2,fl*.32,aw+2],la>=4?'#2a2420':ad);
rod(at(Ru,S0,[-aw/2-2,-ul*.25,0]),at(Rf,E,[-aw/2-2,-fl*.3,0]),2,'#aab');
const Wr=at(Rf,E,[0,-fl,0]);box(at(Rf,Wr,[0,-fs/2+1,0]),Rf,[fs,fs,fs],la>=4?'#2a2420':FC_[pt.arm],false);
if(pt.arm===2)box(at(Rf,Wr,[0,-fs+2,0]),Rf,[fs+2,3,fs+2],'#444');
if(pt.arm===5)box(at(Rf,Wr,[0,-fs-3,0]),Rf,[4,9,4],'#ddd');
if(pt.arm===6)box(at(Rf,E,[-aw/2-2,-fl*.45,0]),Rf,[2,fl*1.2,4],'#e8f0ff');
if(pt.arm===7)box(at(Rf,Wr,[0,-fs+3,0]),Rf,[fs+3,3,fs+3],'#66ffff',1);
if(pt.arm===4)box(at(Rf,Wr,[0,-fs/2,0]),Rf,[fs+3,fs-4,fs+3],'#555');
if(pt.arm===8)for(const z of[-1,0,1])box(at(Rf,Wr,[0,-fs-1,z*3]),Rf,[2,4,2],'#ccc');
if(pt.arm===9)box(at(Rf,E,[0,-fl-6,0]),Rf,[2,18,5],'#e8f0ff');
if(pt.arm===10)box(at(Rf,E,[0,-fl*.5,0]),Rf,[aw+5,fl*.7,aw+5],'#7b8088');
if(pt.arm===11){box(at(Rf,Wr,[0,-fs-8,0]),Rf,[3,16,3],'#ddd');box(at(Rf,Wr,[0,-fs+2,0]),Rf,[fs+3,3,fs+3],'#555')}
if(ac_===1)for(const z of[-1,0,1])box(at(Rf,Wr,[0,-fs-1,z*3]),Rf,[2,4,2],'#ccc');
if(ac_===2)box(at(Rf,E,[0,-fl*.5,sd*(aw/2+3)]),Rf,[2,fl*1.2,3],'#e8f0ff');
if(ac_===3)box(at(Rf,E,[0,-fl*.45,sd*(aw/2+2)]),Rf,[3,fl*.8,10],'#7b8088');
if(ac_===4)box(Wr,Rf,[aw+4,2,aw+4],'#ff7a1e',1);
if(atk&&r.ph==='rec'&&((i===0&&(r.atk==='jab'||r.atk==='hook'))||(i===1&&(r.atk==='straight'||r.atk==='upper'))))tl.push(Wr)}
const lg=cz.legc,pl=pt.leg;
for(let i=0;i<2;i++){const sd=i?-1:1,fx2=i?P.l1x:P.l0x,fy=i?P.l1y:P.l0y,fz=i?P.l1z:P.l0z,[h,k]=ik(fx2,4+fy*Lt),g=Math.atan2(fz,Math.max(12,H-5)),Hp=at(root,Wp,[0,-5,sd*7]),R1=mm(mm(root,rx(-g)),rz(h)),R2=mm(R1,rz(k)),Rt=mm(root,rz(.5*(h+k)));
box(Hp,root,[7,7,7],MC[pt.mot],1);const K=at(R1,Hp,[0,-L1,0]),A=at(R2,K,[0,-L2,0]);
if(pl===12){cyl(at(R1,Hp,[0,-L1*.25,0]),R1,.8,.7,L1*.5,cL,8,lw/2+2,lw/2+2);cyl(at(R1,Hp,[0,-L1*.75,0]),R1,.45,.85,L1*.5,cL,8,lw/2+2,lw/2+2);cyl(at(R2,K,[0,-L2/2,0]),R2,.4,.8,L2,dkL,8,lw/2+1,lw/2+1)}
else if(pl===13){cyl(at(R1,Hp,[0,-L1/2,0]),R1,.45,.6,L1,cL,8,lw/2+1,lw/2+1);cyl(at(R2,K,[0,-L2/2,0]),R2,.3,.5,L2,dkL,8,lw/2+1,lw/2+1)}
else{box(at(R1,Hp,[0,-L1/2,0]),R1,[lw,L1,lw],cL);box(at(R2,K,[0,-L2/2,0]),R2,[lw-1,L2,lw-1],dkL);for(let b=0;b<3;b++)box(at(R2,K,[0,-L2*.45-b*3,0]),R2,[lw,1.8,lw],b%2?'#222':'#e8b100')}
box(at(R1,Hp,[0,-L1*.4,0]),R1,[lw+1,3,lw+1],lL>=4?'#2a2420':ad);box(K,R1,[lw+2,lw+2,lw+3],lL>=4?'#ff3b2a':cz.paint===5?'#ffd24a':dkc,lL>=4);box(at(R1,K,[lw/2+1.5,1,0]),R1,[3,lw*.8,lw+1],hx(col,.7));
box(at(Rt,A,[5,-2,0]),Rt,[20,5,lw+3],'#1c1f24');box(at(Rt,A,[13,-1,0]),Rt,[6,4,lw+4],'#333');
rod(at(R1,Hp,[-lw/2-2,-L1*.3,0]),at(R2,K,[-lw/2-2,-L2*.3,0]),2.2,'#aab');
if(pl===3)box(at(R2,K,[-lw/2-2,-L2*.4,0]),R2,[3,8,5],'#ff8a1e',1);
if(pl===4)for(const z of[-1,1])box(at(Rt,A,[11,-2,z*5]),Rt,[8,2,2],'#ccc');
if(pl===5)box(at(Rt,A,[3,-5,0]),Rt,[22,2,lw+8],'#66ffff',1);
if(pl===6)box(at(R2,K,[0,-L2*.2,0]),R2,[lw+3,6,lw+3],'#7b8088');
if(pl===7)box(at(R2,K,[-lw/2-3,-L2*.5,0]),R2,[4,L2*.5,4],'#aab');
if(pl===8)rod(at(R1,K,[-lw/2-1,0,0]),at(R2,A,[-lw/2-1,4,0]),1.5,'#ddd');
if(pl===9)box(at(Rt,A,[5,-4,0]),Rt,[22,3,lw+6],'#555');
if(pl===10)box(at(R2,K,[-lw/2-3,-L2*.45,0]),R2,[4,12,6],'#66ffff',1);
if(pl===11){box(at(R2,K,[lw/2+1,-L2*.5,0]),R2,[3,L2*.7,lw],'#cfd3d8');box(at(Rt,A,[14,-1,0]),Rt,[7,5,lw+5],'#9aa0a6')}
if(lg===1)box(at(R1,K,[lw/2+4,0,0]),R1,[7,3,3],'#ccc');
if(lg===2)box(at(R2,K,[-lw/2-3,-L2*.55,0]),mm(R2,rz(.5)),[8,12,2],'#444');
if(lg===3){box(A,R2,[lw+1,2.5,lw+1],acc,1);box(K,R1,[lw+3,2.5,lw+3],acc,1)}
if(cz.paint===8)box(at(R1,Hp,[lw/2+.6,-L1*.5,0]),R1,[1,L1*.7,1.5],acc,1);
if(i===0&&atk&&r.ph==='rec'&&(r.atk==='kick'||r.atk==='low'))tl.push(A)}
if(!(atk&&r.ph==='rec'))tl.length=0;if(tl.length>9)tl.shift();
if(r.atk==='beam'&&atk&&r.ph==='wind')box(TT([tx/2+14,4,0]),Rl,[10*(1-r.t/r.tw)+4,10*(1-r.t/r.tw)+4,10*(1-r.t/r.tw)+4],'#66ffff',1)}
const BGC=document.createElement('canvas');BGC.width=960;BGC.height=600;(()=>{const c=BGC.getContext('2d');c.scale(1.5,1.5);const g=c.createLinearGradient(0,0,0,400);g.addColorStop(0,'#0b0e16');g.addColorStop(1,'#1c2333');c.fillStyle=g;c.fillRect(0,0,640,400);
for(let i=0;i<64;i++){const x=i*10+3,y=70+(i*37%5)*9;c.fillStyle=['#161b28','#222a3c','#2b3350'][i%3];c.beginPath();c.arc(x,y,6,0,7);c.fill();c.fillRect(x-7,y+4,14,40)}
c.fillStyle='rgba(255,240,200,.06)';for(const x of[120,320,520]){c.beginPath();c.moveTo(x-8,0);c.lineTo(x+8,0);c.lineTo(x+110,300);c.lineTo(x-110,300);c.fill()}})();
const CRN=[[-280,-200],[280,-200],[280,200],[-280,200]];
function ropes(front){const cd=dot(sub([0,0,0],CAM.p),sub([0,0,0],CAM.p));for(let i=0;i<4;i++){const a=CRN[i],b=CRN[(i+1)%4],m=[(a[0]+b[0])/2,0,(a[1]+b[1])/2],md=dot(sub(m,CAM.p),sub(m,CAM.p));if((md<cd)!==front)continue;
for(let h=0;h<3;h++){const y=32+h*26,A=pj(a[0],y,a[1]),B=pj(b[0],y,b[1]);ctx.strokeStyle=['#c0392b','#ddd','#2f6fdb'][h];ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke()}}}
function ring(){poly([[-340,0,-250],[340,0,-250],[340,0,250],[-340,0,250]],'#161a24');
poly([[-280,0,-200],[0,0,-200],[0,0,200],[-280,0,200]],'#2c4a7a');poly([[0,0,-200],[280,0,-200],[280,0,200],[0,0,200]],'#7a3640');
ctx.lineWidth=1.5;poly([[-280,0,-200],[280,0,-200],[280,0,200],[-280,0,200]],null,'#ddd');poly(circ(0,0,60),null,'rgba(255,255,255,.35)');
for(const c of CRN){box([c[0],55,c[1]],[1,0,0,0,1,0,0,0,1],[9,110,9],'#8a8f99');box([c[0],40,c[1]],[1,0,0,0,1,0,0,0,1],[12,50,12],c[0]<0?'#2f6fdb':'#c0392b')}}
function draw(){const on=OL&&OL.live,m=on?OL.m:RP?rpM():M,tm=performance.now()/1000,pre=!on&&!m.run&&!m.res&&(T==='garage'||T==='online');ctx.setTransform(1.5,0,0,1.5,0,0);ctx.drawImage(BGC,0,0,640,400);
if(m.run&&Math.random()<.2){ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(Math.random()*640,70+Math.random()*60,2,2)}
if(pre)setCam([Math.sin(tm*.5)*340,135,Math.cos(tm*.5)*340],[0,62,0]);
else{const mx=(m.p.x+m.r.x)/2*.5,mz=(m.p.z+m.r.z)/2*.5,j=m.sh;let v=[150+Math.sin(tm*.3)*50,300,500];
if(m.cd>0){const k=m.cd/3,a=k*1.1,c=Math.cos(a),s=Math.sin(a);v=[v[0]*c+v[2]*s,v[1]*(1-.55*k),-v[0]*s+v[2]*c]}
let cp=[mx+v[0]+(Math.random()-.5)*j,v[1]+(Math.random()-.5)*j,mz+v[2]],ct=[mx,30,mz];
if(m.slow>0&&m.lo){const k=Math.min(1,(2.2-m.slow)*2),lo=m.lo,zp=[lo.x+110,115,lo.z+240],zt=[lo.x,45,lo.z];cp=cp.map((q,i)=>q+(zp[i]-q)*k);ct=ct.map((q,i)=>q+(zt[i]-q)*k)}setCam(cp,ct)}
CAM.F*=1+(m.zm||0);ring();for(const g of RG){ctx.lineWidth=2.5;poly(circ(g.x,g.z,g.r),null,'rgba(255,255,255,'+Math.min(1,g.l*3)+')')}
ropes(false);for(const r of pre?[Object.assign({},m.p,{x:0,z:0,ang:0})]:[m.r,m.p])robot3(r,tm);
flush();ropes(true);for(const t of TRL)for(let k=1;k<t.length;k++){const a=pj(t[k-1][0],t[k-1][1],t[k-1][2]),b=pj(t[k][0],t[k][1],t[k][2]);ctx.strokeStyle='rgba(255,255,255,'+k/t.length*.8+')';ctx.lineWidth=2+k*.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()}
ctx.textAlign='center';for(const p of PT){const q=pj(p.x,p.y,p.z);ctx.globalAlpha=Math.max(0,p.l*2);if(p.c==='#ffcf6a'){const e=pj(p.x-p.vx*.03,p.y-p.vy*.03,p.z-p.vz*.03);ctx.strokeStyle=p.c;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(e[0],e[1]);ctx.stroke()}else{ctx.fillStyle=p.c;ctx.fillRect(q[0],q[1],p.c==='#666'||p.c==='#aaa'?4:3,p.c==='#666'||p.c==='#aaa'?4:3)}}
for(const f of FT){const q=pj(f.x,f.y,f.z),big=typeof f.t==='number'?Math.min(26,12+f.t*.8):15;ctx.globalAlpha=Math.min(1,f.l*2);ctx.fillStyle=f.c;ctx.font='900 '+big+'px sans-serif';ctx.fillText(f.t,q[0],q[1])}ctx.globalAlpha=1;
if(pre){ctx.fillStyle='rgba(255,255,255,.7)';ctx.font='700 12px sans-serif';ctx.fillText('PREVIEW — '+S.name,320,388);return}
for(const q of[m.p,m.r])q.hv+=(q.hp-q.hv)*.06;
bar(14,14,240,m.p.hv,m.p.o.hp,'#fff');bar(14,14,240,m.p.hp,m.p.o.hp,'#4cd37b');bar(14,26,160,m.p.en,m.p.o.en,'#4aa8ff');bar(386,14,240,m.r.hv,m.r.o.hp,'#fff',1);bar(386,14,240,m.r.hp,m.r.o.hp,'#4cd37b',1);bar(466,26,160,m.r.en,m.r.o.en,'#4aa8ff',1);
zones(14,58,m.p.pd);zones(594,58,m.r.pd);ruleHud(m);ctx.fillStyle='#fff';ctx.textAlign='left';ctx.font='900 12px sans-serif';ctx.fillText(m.p.name,14,52);ctx.textAlign='right';ctx.fillText(m.r.name,626,52);
ctx.textAlign='center';ctx.font='900 24px sans-serif';ctx.fillText(Math.ceil(Math.max(0,m.t)),320,34);ctx.font='700 9px sans-serif';ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillText('頭・胴・左腕・右腕・脚の損傷',320,46);
if(RP){ctx.fillStyle='#ff5a5a';ctx.font='900 13px sans-serif';ctx.textAlign='left';ctx.fillText((tm*2%2<1?'● ':'○ ')+'REPLAY x'+RP.sp,14,70);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(0,396,640,4);ctx.fillStyle='#ff5a5a';ctx.fillRect(0,396,640*Math.min(1,RP.a/FR.length),4);ctx.textAlign='center'}
if(m.slow>1.9){ctx.fillStyle='rgba(255,255,255,'+(m.slow-1.9)*3+')';ctx.fillRect(0,0,640,400)}
if(m.run&&m.cd>0){const k=m.cd/3;ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,130,640,70);ctx.font='900 30px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='left';ctx.fillText(m.p.name,40-k*300,175);ctx.textAlign='right';ctx.fillText(m.r.name,600+k*300,175);ctx.textAlign='center';ctx.fillStyle='#f5b400';ctx.font='900 40px sans-serif';ctx.fillText('VS',320,176);ctx.fillStyle='#fff';ctx.font='900 18px sans-serif';ctx.fillText(Math.ceil(m.cd),320,120)}
else{const big=m.res||(m.fl>0?'FIGHT!':'');if(big){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,110,640,80);ctx.fillStyle=m.res&&/勝/.test(m.res)?'#f5b400':'#fff';ctx.font='900 54px sans-serif';ctx.fillText(big,320,170)}}}
const ZC=['#4cd37b','#ff9a2e','#ffd84a','#e03b3b','#444'];
function zones(x,y,pd){const f=z=>ZC[lvl(pd[z])],R=(z,a,b,w,h)=>{ctx.fillStyle=f(z);ctx.fillRect(x+a,y+b,w,h);ctx.strokeStyle='rgba(0,0,0,.7)';ctx.lineWidth=1;ctx.strokeRect(x+a,y+b,w,h);if(pd[z]<=0){ctx.strokeStyle='#e03b3b';ctx.beginPath();ctx.moveTo(x+a,y+b);ctx.lineTo(x+a+w,y+b+h);ctx.moveTo(x+a+w,y+b);ctx.lineTo(x+a,y+b+h);ctx.stroke()}};R('head',11,0,10,9);R('torso',8,11,16,15);R('larm',0,11,6,17);R('rarm',26,11,6,17);R('legs',8,28,16,15)}
function bar(x,y,w,v,mx,c,rt){ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(x,y,w,9);ctx.fillStyle=c;const ww=w*Math.max(0,v/mx);ctx.fillRect(rt?x+w-ww:x,y,ww,9)}
function rpM(){const f=FR[Math.min(FR.length-1,RP.a|0)];return{p:f.p,r:f.r,t:f.t,sh:f.sh,zm:f.zm,run:true,cd:0,fl:0,res:null,li:M.li,slow:0}}
function rpStep(){const n=FR.length,tl=RP.ko&&RP.a>FRk-40&&RP.a<FRk+10,i=Math.min(n-1,RP.a|0);RP.a+=RP.sp*(tl?.3:1);
while(RP.i<=i&&RP.i<n){for(const[k,a]of FR[RP.i].ev){if(k==='b')burstR(...a);else if(k==='f')flR(...a);else if(k==='g')RG.push({x:a[0],z:a[1],l:.35,r:10});else if(k==='s')H.sfx(...a);else if(k==='m')BM.push(Object.assign({},a[0]))}RP.i++}
if(RP.a>=n+40){RP.a=0;RP.i=0;PT=[];FT=[];BM=[];RG=[];TRL[0].length=TRL[1].length=0}}
function loop(){const on=OL&&OL.live,m=on?OL.m:M;bgmCtl(on?(m.cd<=0&&!OL.fin):(m.run&&m.cd<=0&&!RP));if(on)olStep();else if(RP)rpStep();else if(m.run){if(m.cd>0){const c=Math.ceil(m.cd);m.cd-=1/60;if(Math.ceil(m.cd)!==c){snd(m.cd>0?440:880,.12);if(m.cd<=0)m.fl=.8}}else if(m.sm>0){m.sm--;if(m.sm%3===0)tick()}else for(let i=0;i<speed&&m.run;i++)tick()}
const ts=m.slow>0?.25:1;if(m.fl>0)m.fl-=1/60;if(!on){m.sh*=.85;m.zm*=.88;for(const r of[m.p,m.r])if(r.st==='down')r.fall=Math.min(1.5,r.fall+.07*ts);if(m.slow>0){m.slow-=1/60;if(!RP&&FR.length)pf(m)}}
for(const p of PT){p.x+=p.vx/60*ts;p.y+=p.vy/60*ts;p.z+=p.vz/60*ts;p.vy-=4*ts;p.l-=1/60*ts}PT=PT.filter(p=>p.l>0);for(const f of FT){f.y+=.7*ts;f.l-=1/60*ts}FT=FT.filter(f=>f.l>0);for(const b of BM)b.l-=1/60*ts;BM=BM.filter(b=>b.l>0);for(const g of RG){g.r+=140/60*ts;g.l-=1/60*ts}RG=RG.filter(g=>g.l>0);draw();requestAnimationFrame(loop)}
const IT=k=>PRT[k]||COS[k],EQ=k=>PRT[k]?S.parts:S.cz,gb=k=>`<button class="b s ${GT===k?'':'k'}" data-g="${k}">${IT(k).n}</button>`;
function opts(sel,map,lk){return Object.keys(map).map(k=>{const l=lk&&S.unl[k]===0;return`<option value="${k}" ${k===sel?'selected':''} ${l?'disabled':''}>${l?'🔒 ':''}${map[k]}</option>`}).join('')}
function render(){$('cash').textContent='¥'+S.money.toLocaleString();$('st').textContent=(S.w<3?'ルーキー':S.w<10?'ファイター':S.w<25?'チャンプ':'レジェンド')+' ／ '+S.w+'勝('+S.ko+'KO)';$('snd').textContent=S.snd?'🔊':'🔇';$('bgmb').textContent=S.bgm?'🎵':'🔈';
$('tabs').innerHTML=[['garage','ガレージ'],['prog','プログラム'],['match','試合'],['online','オンライン']].map(t=>`<button class="${T===t[0]?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('');
let h='';
if(T==='garage'){const b=build(S.parts);h=`<div class="st">HP ${b.hp|0} ／ 電池 ${b.en|0} ／ 攻撃 x${b.pw.toFixed(2)} ／ 速度 x${b.sp.toFixed(2)}<br>反応 ${b.react.toFixed(2)}秒 ／ リーチ ${b.rg>=0?'+':''}${b.rg} ／ 被ダメ x${b.dr.toFixed(2)} ／ 踏ん張り x${(2-b.kb).toFixed(2)}<br>重量 ${b.w}(標準78)→ 速度補正 x${b.wf.toFixed(2)}</div><h3>アセンブル(性能パーツ)</h3><div class="sm">${PK.map(gb).join('')}</div><h3>外装カスタム(見た目のみ)</h3><div class="sm">${CK.map(gb).join('')}</div>`+
IT(GT).i.map((it,i)=>{const o=S.own[GT].includes(i),q=EQ(GT)[GT]===i;return`<div class="row"><div class="n"><b>${it.n}</b><div class="mu">${fmt(it)}</div></div><button class="b ${q?'k':''}" data-i="${i}" ${!o&&S.money<it.c?'disabled':''}>${q?'装備中':o?'装備':'¥'+it.c}</button></div>`}).join('')+
`<h3>ペイント</h3><div class="row"><div style="display:flex;gap:6px;flex-wrap:wrap">${COL.map(c=>`<button class="sw ${c===S.col?'on':''}" style="background:${c}" data-c="${c}" aria-label="ボディ色 ${c}"></button>`).join('')}</div><input type="text" id="nm" maxlength="12" value="${S.name}" aria-label="機体名"></div><div class="row"><span class="n mu">ライト色</span><div style="display:flex;gap:6px;flex-wrap:wrap">${ACC.map(c=>`<button class="sw ${c===S.acc?'on':''}" style="background:${c}" data-k="${c}" aria-label="ライト色 ${c}"></button>`).join('')}</div></div><div class="row"><div class="n mu">所持パーツから最適な組み合わせを自動で選ぶ</div><button class="b" data-x="auto">おまかせ構築</button></div><h3>セーブデータ</h3><div class="row"><textarea id="sv" rows="2" style="width:100%;font-size:11px" aria-label="セーブデータ"></textarea></div><div class="row"><button class="b s k" data-x="exp">出力</button><button class="b s k" data-x="imp">読み込み</button><span class="n mu">バックアップや引っ越しに</span></div><div class="row"><span class="n mu">データを消して最初から</span><button class="b k" data-x="reset">${rs?'本当に消す':'リセット'}</button></div>`}
if(T==='prog'){h='<p class="mu" style="margin:0 0 6px">上から順に調べ、条件に合い、エネルギーが足りる最初の行を実行します。</p><div class="row"><div class="n"><b>テンプレート</b></div><select id="tpl" aria-label="テンプレート"><option value="">読み込む…</option>'+TP.map((t,i)=>`<option value="${i}">${t.n}</option>`).join('')+'</select></div><div class="row" style="flex-wrap:wrap"><span class="n mu">プログラム保存枠</span>'+[0,1,2].map(i=>`<button class="b s k" data-ps="s${i}">保存${i+1}</button><button class="b s" data-ps="l${i}" ${S.prs[i]?'':'disabled'}>読込${i+1}</button>`).join('')+'</div>'+S.prog.map((q,i)=>`<div class="row"><div class="n">${i+1}. もし <select data-r="${i}c" aria-label="条件${i+1}">${opts(q.c,CD)}</select> かつ <select data-r="${i}d" aria-label="追加条件${i+1}"><option value="" ${q.c2?'':'selected'}>(なし)</option>${opts(q.c2||'',CD)}</select><br>なら <select data-r="${i}a" aria-label="動作${i+1}">${opts(q.a,AC,1)}</select></div></div>`).join('')+
`<div class="row"><div class="n"><b>ルール枠を増やす</b><div class="mu">最大8行</div></div><button class="b" data-x="slot" ${S.slots>=8||S.money<300*(S.slots-2)?'disabled':''}>${S.slots>=8?'MAX':'¥'+300*(S.slots-2)}</button></div><h3>技・動作の開発</h3>`+
Object.keys(UNL).map(k=>`<div class="row"><div class="n"><b>${UNL[k][0]}</b><div class="mu">${UNL[k][2]}</div></div><button class="b" data-x="${k}" ${S.unl[k]||S.money<UNL[k][1]?'disabled':''}>${S.unl[k]?'開発済み':'¥'+UNL[k][1]}</button></div>`).join('')}
if(T==='online')h=olPanel();
if(T==='match')h=matchPanel();
const fo=document.activeElement,keep=fo&&fo.id==='ct'?fo.value:null;if(!S.tipx[T]&&TIPS[T])h=`<div class="st" style="margin-bottom:8px">💡 ${TIPS[T]} <button class="b s k" data-x="tip">閉じる</button></div>`+h;
$('pane').innerHTML=h;if(keep!==null){const c=$('ct');if(c){c.value=keep;c.focus()}}}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
if(t.id==='snd'){S.snd=S.snd?0:1;save();snd(600,.08)}
else if(t.id==='bgmb'){S.bgm=S.bgm?0:1;save()}
else if(d.o){olAct(d.o);return}
else if(d.pr){startPractice();return}else if(d.sv){svAct(d.sv);return}else if(d.ps){psAct(d.ps)}
else if(d.t){T=d.t}else if(d.g){GT=d.g}
else if(d.i!==undefined){const i=+d.i,it=IT(GT).i[i];if(S.own[GT].includes(i))EQ(GT)[GT]=i;else if(S.money>=it.c){S.money-=it.c;S.own[GT].push(i);EQ(GT)[GT]=i;snd(880,.2)}save()}
else if(d.k){S.acc=d.k;save()}else if(d.c){S.col=d.c;save()}
else if(d.x==='slot'){const c=300*(S.slots-2);if(S.money>=c&&S.slots<8){S.money-=c;S.slots++;S.prog.push({c:'always',a:'wait'});save()}}
else if(d.x==='tip'){S.tipx[T]=1;save()}else if(d.x==='auto'){autoBuild()}else if(d.x==='exp'){expSave();return}else if(d.x==='imp'){impSave();render();return}
else if(UNL[d.x]){if(S.money>=UNL[d.x][1]){S.money-=UNL[d.x][1];S.unl[d.x]=1;save();snd(740,.2)}}
else if(d.x==='reset'){if(rs){S=DEF();save();rs=0}else{rs=1;render();return}}
else if(d.v){speed=+d.v;render();return}
else if(d.rp!==undefined){if(d.rp==='1'){const n=FR.length;RP={a:0,i:0,sp:1,ko:FR[n-1].p.hp<=0||FR[n-1].r.hp<=0};PT=[];FT=[];BM=[];RG=[];TRL[0].length=TRL[1].length=0}else RP=null;render();return}
else if(d.rs){RP.sp=+d.rs;render();return}
else if(d.m!==undefined){const i=+d.m;S.money-=LG[i].fee;save();beginMatch(newMatch(i),LG[i].n+'　対 '+LG[i].rn+' '+RD[i]);return}
else return;rs=0;if(!M.run)M=newMatch(M.li);render()});
document.addEventListener('change',e=>{if(e.target.id==='tpl'&&e.target.value!==''){let rr=TP[+e.target.value].r.filter(q=>S.unl[q[1]]!==0).map(q=>({c:q[0],a:q[1]})).slice(0,S.slots);while(rr.length<S.slots)rr.push({c:'always',a:'wait'});S.prog=rr;save();if(!M.run)M=newMatch(M.li);render();return}const r=e.target.dataset.r;if(r){S.prog[+r[0]][r[1]==='d'?'c2':r[1]]=e.target.value;save();if(!M.run)M=newMatch(M.li)}});
document.addEventListener('input',e=>{if(e.target.id==='nm'){S.name=e.target.value;save();if(!M.run)M.p.name=S.name}});

/* ===== ゲーム性の強化(ボーナス・実績・練習・サバイバル・レポートなど) ===== */
let LASTREP=null,SV=null,BG=null,BS=0;
const RD=['「まずは町内で腕試しだ。」','「先輩の意地、見せてやる!」','「見えるか? 俺の動きが。」','「装甲こそ最強の武器だ。」','「世界の壁は厚いぞ。」','「ジャブ一本で上り詰めた男だ。」','「全部まとめて解体してやる。」','「空は俺のリングだ。」','「王者に挑む覚悟はあるか。」','「標的を捕捉。排除する。」','「……(仮面の奥で笑っている)」','「最強は一人でいい。」','「竜の咆哮を聞け!」','「神に挑むか、人間よ。」'];
const TIPS={garage:'まずは「ガレージ」で装備を選ぼう。重いパーツは強いが速度が落ちる。「おまかせ構築」で所持パーツから自動選択もできるよ。',prog:'上の行ほど優先。基本は「相手が近い→ジャブ」「相手が離れている→近づく」「エネルギーが少ない→下がる」。「かつ」で条件を組み合わせられる。',match:'まずは町内大会へ。勝つと賞金と次の大会が解放される。ボーナス条件を達成すると追加賞金!試合後のレポートでプログラムを見直そう。',online:'ルームを作ってコードを友達に伝えよう。シングルで作ったマイロボで対戦できる。観戦もチャットもOK。'};
const BON=[{t:'KOで勝つ',r:.25,f:m=>m.out.w==='p'&&m.out.ko},{t:'30秒以内に勝つ',r:.3,f:m=>m.out.w==='p'&&m.out.tm<=30},{t:'被ダメージを最大HPの25%未満に抑えて勝つ',r:.3,f:m=>m.out.w==='p'&&m.dt<m.p.o.hp*.25},{t:'回避を3回成功させる',r:.2,f:m=>m.sa.dodge[0]>=3},{t:'ガードを5回成功させる',r:.2,f:m=>m.sa.guard[0]>=5},{t:'カウンターを決める',r:.25,f:m=>m.sa.counter[0]>=1},{t:'相手の部位を破壊する',r:.25,f:m=>m.sa.broke[0]>=1}];
const ACH=[{id:'w1',n:'初勝利',r:200,f:()=>S.w>=1},{id:'w10',n:'10勝',r:1000,f:()=>S.w>=10},{id:'k10',n:'KO王(10KO)',r:1500,f:()=>S.ko>=10},{id:'b10',n:'破壊者(部位破壊10回)',r:1200,f:()=>(S.st.b||0)>=10},{id:'d30',n:'回避の達人(30回)',r:1000,f:()=>(S.st.d||0)>=30},{id:'c10',n:'カウンターの名手(10回)',r:1200,f:()=>(S.st.c||0)>=10},{id:'clr',n:'全大会制覇',r:5000,f:()=>S.st.clr},{id:'sv5',n:'サバイバル WAVE5',r:1500,f:()=>S.best>=5},{id:'sv10',n:'サバイバル WAVE10',r:4000,f:()=>S.best>=10},{id:'ow1',n:'オンライン初勝利',r:800,f:()=>(S.ow||0)>=1},{id:'fc',n:'フルカスタム(外装すべて装備)',r:600,f:()=>CK.every(k=>S.cz[k]>0)}];
function checkAch(){const got=[];for(const a of ACH)if(!S.ach[a.id]&&a.f()){S.ach[a.id]=1;S.money+=a.r;got.push(a)}if(got.length){save();return got.map(a=>'🏆実績「'+a.n+'」達成 +¥'+a.r).join(' ')}return''}
const RN=['スクラップ','ブリキ','ガンマ','ロックス','ヴァイパー','タイタン','ミラージュ','ノヴァ','クロウ','ブラスト','ゴースト','アイアン'],RC=['#c9c9c9','#e88fb0','#6b7fd6','#43c0b0','#f06a3a','#d4a24a','#8a8f99','#4ad0ff','#b04bd6','#4b7a54'];
const RRU=[[['near','jab'],['far','approach']],[['oppatk','guard'],['near','jab'],['far','approach']],[['lowen','retreat'],['oppatk','slip'],['near','hook'],['near','jab'],['far','approach']],[['lowen','focus'],['oppatk','guard'],['oppstun','upper'],['near','jab'],['far','approach']],[['lowen','retreat'],['oppatk','guard'],['oppguard','throw'],['oppstun','straight'],['mid','rush'],['near','jab'],['far','approach']],[['lowen','focus'],['oppatk','flip'],['oppstun','kick'],['faraway','beam'],['near','jab'],['far','approach']]];
function genRival(w){const bud=500+w*2500,cost=a=>PK.reduce((t,k,i)=>t+PRT[k].i[a[i]].c,0);let best=null,bc=-1;for(let n=0;n<300;n++){const a=PK.map(k=>Math.random()*PRT[k].i.length|0),c=cost(a);if(c<=bud&&c>bc&&build(PTO(a)).wf>.75){best=a;bc=c}}if(!best)best=[0,0,0,0,0,0];
const ri=Math.min(RRU.length-1,Math.floor((w-1)/2)+(Math.random()*2|0));return{pt:best,rules:RRU[ri],x:Math.min(1.9,.8+w*.07),rn:RN[Math.random()*RN.length|0]+'-'+(100+w),rc:RC[Math.random()*RC.length|0],pz:0,cz:{crest:Math.random()*7|0,face:Math.random()*10|0,paint:Math.random()*9|0}}}
function newMatchG(Lg,li,opt){opt=opt||{};const pb=build(S.parts),rb=build(PTO(Lg.pt)),x=Lg.x*(opt.x||1);rb.hp*=x;rb.pw*=x;const rules=opt.dummy?[{c:'always',a:'wait'}]:Lg.rules.map(q=>({c:q[0],a:q[1]})).concat([{c:'always',a:'wait'}]);
const A={o:pb,rules:S.prog,col:S.col,pt:S.parts,name:S.name,acc:S.acc,cz:S.cz};if(opt.hpf){A.hpf=opt.hpf;A.pd=opt.pd}
const m=mkMatch(A,{o:rb,rules,col:Lg.rc,pt:PTO(Lg.pt),name:Lg.rn,acc:'#ff5a5a',cz:Lg.cz||RZ[li]||{}});m.li=li;m.opt=opt;m.Lg=Lg;return m}
function newMatch(li,opt){return newMatchG(LG[li],li,opt)}
function beginMatch(m,msg){M=m;M.run=true;M.cd=3;FR=[];EV=[];REC=2;RP=null;PT=[];FT=[];BM=[];RG=[];if(!(m.opt.practice||m.opt.sv)){const b=BON.slice().sort(()=>Math.random()-.5).slice(0,2);m.bonus=b;msg+='　ボーナス:'+b.map(q=>q.t+'(+'+Math.round(q.r*100)+'%)').join(' / ')}$('msg').textContent=msg;rs=0;render()}
function startPractice(){const i=+$('pr_l').value,x=+$('pr_x').value,d=$('pr_d').checked;beginMatch(newMatch(i,{x,dummy:d,practice:1}),'スパーリング　対 '+LG[i].rn+(d?'(動かない的)':''))}
function svNext(){const L=genRival(SV.wave);beginMatch(newMatchG(L,0,{sv:1,hpf:SV.hpf,pd:SV.pd}),'サバイバル WAVE'+SV.wave+'　対 '+L.rn)}
function svAct(a){if(a==='start'){SV={wave:1,hpf:1,pd:null};svNext()}else if(a==='next')svNext();else if(a==='quit'){SV=null;render()}}
const repOf=m=>({rules:m.p.rules.map(q=>({c:q.c,a:q.a,c2:q.c2})),ru:m.p.ru.slice(),sa:JSON.parse(JSON.stringify(m.sa)),dd:m.dd,dt:m.dt});
H.finish=m=>{const Lg=m.Lg,o=m.out,op=m.opt||{},st=S.st;let g=0,txt,tag,ex='';st.p=(st.p||0)+1;st.d=(st.d||0)+m.sa.dodge[0];st.c=(st.c||0)+m.sa.counter[0];st.b=(st.b||0)+m.sa.broke[0];
if(o.w==='p'){tag=o.ko?'KO勝利!':'判定勝ち';snd(523,.15);setTimeout(()=>snd(784,.3),160)}else if(o.w==='d'){tag='引き分け';snd(440,.3)}else{tag=m.p.hp<=0?'KO負け…':'判定負け…';snd(180,.4,'sawtooth')}
if(op.sv){if(o.w==='p'){g=150*SV.wave;S.money+=g;SV.wave++;SV.hpf=Math.min(1,m.p.hp/m.p.o.hp+.3);const pd={};for(const z in m.p.pd)pd[z]=Math.min(1,m.p.pd[z]+.25);SV.pd=pd;S.best=Math.max(S.best,SV.wave-1);txt=tag+'　WAVE'+(SV.wave-1)+'突破 +¥'+g+'(次はWAVE'+SV.wave+')'}else{S.best=Math.max(S.best,SV.wave-1);txt=tag+'　サバイバル終了 — WAVE'+(SV.wave-1)+'まで到達(ベスト WAVE'+S.best+')';SV=null}}
else if(op.practice){txt=tag+'(スパーリング:賞金なし)'}
else{if(o.w==='p'){g=Math.floor(Lg.pz*(o.ko?1.5:1));S.w++;if(o.ko)S.ko++;if(m.li+1<LG.length&&S.open<m.li+2){ex='　次の大会が解放！';S.open=m.li+2}if(m.li===LG.length-1)st.clr=1;S.ls=0}
else if(o.w==='d'){g=Math.floor(Lg.pz*.4);S.ls=(S.ls||0)+1}else{g=Math.floor(Lg.pz*.1);S.ls=(S.ls||0)+1}
let bn=0;const bl=[];for(const b of m.bonus||[])if(b.f(m)){bn+=Math.floor(Lg.pz*b.r);bl.push(b.t)}if(bn){g+=bn;ex+='　ボーナス達成「'+bl.join('・')+'」+¥'+bn}
if(S.ls>=3){const h=Math.floor(Lg.pz*.5)+100;g+=h;S.ls=0;ex+='　連敗救済ボーナス +¥'+h}S.money+=g;txt=tag+'　賞金 ¥'+g+ex}
m.res=tag;const ac=checkAch();save();LASTREP=repOf(m);$('msg').textContent=txt+'　[与'+(m.dd|0)+' / 被'+(m.dt|0)+']'+(ac?'　'+ac:'');render()};
function ruleHud(m){const p=m.p;if(!p.rules||!p.rules.length||p.ri===undefined)return;ctx.save();ctx.textAlign='left';ctx.font='700 10px sans-serif';const q=p.rules[p.ri],t='▶ '+(q?(p.ri+1)+'. '+CD[q.c]+(q.c2?'＋'+CD[q.c2]:'')+' → '+AC[q.a]:'どの条件にも合わず待機');ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(10,108,Math.min(262,ctx.measureText(t).width+10),14);ctx.fillStyle='#ffe28a';ctx.fillText(t,14,118,250);ctx.restore()}
function repHtml(){const r=LASTREP;if(!r)return'';const tot=r.ru.reduce((a,b)=>a+b,0)||1;let h=`<div class="st" style="margin:8px 0">📊 前の試合のレポート<br>与ダメ ${r.dd|0} ／ 被ダメ ${r.dt|0} ／ ヒット ${r.sa.hit[0]} ／ ミス ${r.sa.miss[0]} ／ ガード ${r.sa.guard[0]} ／ 回避 ${r.sa.dodge[0]} ／ カウンター ${r.sa.counter[0]} ／ 部位破壊 ${r.sa.broke[0]}</div><div class="mu">ルール使用率(上の行ほど優先)</div>`;
r.rules.forEach((q,i)=>{const p=Math.round(r.ru[i]/tot*100);h+=`<div class="row" style="padding:2px 0"><div class="n mu" style="font-size:12px">${i+1}. ${CD[q.c]}${q.c2?'＋'+CD[q.c2]:''}→${AC[q.a]}</div><div style="width:80px;height:8px;background:var(--ln);border-radius:4px;overflow:hidden"><i style="display:block;height:100%;width:${p}%;background:var(--ac)"></i></div><span class="mu" style="width:34px;text-align:right">${p}%</span></div>`});
return h+`<div class="mu" style="font-size:12px">どの条件にも合わず「待つ」: ${Math.round(r.ru[r.rules.length]/tot*100)}%</div>`}
function matchPanel(){const run=M.run;let h='';
if(SV)h+=`<div class="st">🔥 サバイバル WAVE ${SV.wave}(ベスト ${S.best})<br>HPと部位の損傷は持ち越し(勝つと少し回復)。負けか引き分けで終了</div><div class="row"><button class="b" data-sv="next" ${run?'disabled':''}>WAVE${SV.wave}へ</button><button class="b k" data-sv="quit">棄権</button></div>`;
h+=LG.map((g,i)=>{const lk=i+1>S.open;return`<div class="row"><div class="n"><b>${g.n}</b><div class="mu">対 ${g.rn}</div><div class="mu">${RD[i]}</div><div class="mu">賞金 ¥${g.pz.toLocaleString()}(KOで1.5倍)　参加費 ¥${g.fee}</div></div><button class="b" data-m="${i}" ${lk||S.money<g.fee||run||SV?'disabled':''}>${lk?'🔒':'出場'}</button></div>`}).join('');
h+=`<h3>スパーリング(賞金なしの練習)</h3><div class="row" style="flex-wrap:wrap"><select id="pr_l" aria-label="練習相手">${LG.map((g,i)=>`<option value="${i}" ${i>=S.open?'disabled':''}>${g.rn}</option>`).join('')}</select><select id="pr_x" aria-label="強さ"><option value=".7">弱め</option><option value="1" selected>普通</option><option value="1.3">強め</option></select><label class="mu"><input type="checkbox" id="pr_d"> 動かない的</label><button class="b" data-pr="1" ${run||SV?'disabled':''}>開始</button></div>`;
h+=`<h3>サバイバル(連勝チャレンジ)</h3><div class="row"><div class="n mu">ランダムな敵と連戦。勝つたびに賞金(WAVE×¥150)。ベスト WAVE ${S.best}</div><button class="b" data-sv="start" ${run||SV?'disabled':''}>挑戦</button></div>`;
if(FR.length>20&&!run)h+=`<div class="row"><div class="n"><b>前の試合のリプレイ</b><div class="mu">KOの瞬間はスローで再生</div></div>${RP?[.5,1,2].map(v=>`<button class="b s ${v===RP.sp?'':'k'}" data-rs="${v}">x${v}</button>`).join('')+'<button class="b s k" data-rp="0">停止</button>':'<button class="b" data-rp="1">▶ 再生</button>'}</div>`;
if(run)h+=`<div class="row"><div class="n">再生速度</div>${[1,3,6].map(v=>`<button class="b ${v===speed?'':'k'}" data-v="${v}">x${v}</button>`).join('')}</div>`;
else h+=repHtml()+`<h3>実績(${ACH.filter(a=>S.ach[a.id]).length}/${ACH.length})</h3>`+ACH.map(a=>`<div class="row" style="padding:3px 0"><div class="n ${S.ach[a.id]?'':'mu'}">${S.ach[a.id]?'🏆':'・'} ${a.n}</div><span class="mu">+¥${a.r}</span></div>`).join('');return h}
function psAct(a){const i=+a[1];if(a[0]==='s')S.prs[i]=JSON.stringify(S.prog);else if(S.prs[i]){let p=JSON.parse(S.prs[i]).filter(q=>S.unl[q.a]!==0).slice(0,S.slots).map(q=>({c:q.c,a:q.a,c2:q.c2||''}));while(p.length<S.slots)p.push({c:'always',a:'wait'});S.prog=p}save()}
const rate=pt=>{const b=build(pt);return b.hp*b.pw*b.sp*(1+(.22-b.react)*2.5)*(1+b.rg/80)/b.dr*(1+(b.regen-8)/30)*(1+(b.en-40)/120)};
function autoBuild(){const pt=Object.assign({},S.parts);for(let p=0;p<3;p++)for(const k of PK){let bi=pt[k],bs=-1;for(const i of S.own[k]){const t=Object.assign({},pt);t[k]=i;const v=rate(t);if(v>bs){bs=v;bi=i}}pt[k]=bi}S.parts=pt;save();snd(740,.2);$('msg').textContent='所持パーツからおすすめの組み合わせを装備しました'}
function expSave(){const t=btoa(unescape(encodeURIComponent(JSON.stringify(S))));$('sv').value=t;$('sv').select();$('msg').textContent='セーブデータを出力しました。コピーして保管してください'}
function impSave(){try{const o=JSON.parse(decodeURIComponent(escape(atob($('sv').value.trim()))));if(typeof o.money!=='number'||!o.parts||!o.own)throw 0;S=Object.assign(DEF(),o);S.cz=Object.assign(Object.fromEntries(CK.map(k=>[k,0])),S.cz);for(const k of CK)S.own[k]=S.own[k]||[0];while(S.prog.length<S.slots)S.prog.push({c:'always',a:'wait'});save();M=newMatch(0);$('msg').textContent='セーブデータを読み込みました'}catch(e){$('msg').textContent='読み込みに失敗しました(データが正しくありません)'}}
function bassN(f,d){const a=actx(),t=a.currentTime,o=a.createOscillator(),g=a.createGain(),fl=a.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=420;g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(fl);fl.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02)}
function bgmStep(s){const k=s%16;try{if(k%4===0)thump(120,48,.1,.11);if(k===4||k===12)noise(.09,.06,3200,.9);if(k%2===1)noise(.03,.03,7000,2);if(k%2===0)bassN(55*Math.pow(2,[0,0,3,0,5,0,3,7][k>>1]/12),.12)}catch(e){}}
function bgmCtl(w){if(w&&S.bgm&&!BG){try{actx()}catch(e){return}BG=setInterval(()=>{if(S.bgm)bgmStep(BS++)},107)}else if((!w||!S.bgm)&&BG){clearInterval(BG);BG=null}}

while(S.prog.length<S.slots)S.prog.push({c:'always',a:'wait'});
M=newMatch(0);render();requestAnimationFrame(loop);

/* ================= オンライン(ルーム形式) ================= */
const myLoad=()=>({name:S.name,parts:S.parts,col:S.col,acc:S.acc,cz:S.cz,rules:S.prog.map(q=>[q.c,q.a,q.c2||''])});
const srvDef=()=>S.srv||(location.protocol==='file:'?'':(location.protocol==='https:'?'wss://':'ws://')+location.host);
function olSend(o){if(OL&&OL.ws&&OL.ws.readyState===1)OL.ws.send(JSON.stringify(o))}
function olConnect(first){const el=$('srv'),url=((el&&el.value)||srvDef()).trim();if(!url){OL={err:'サーバーURLを入力してください(例: wss://xxxx.onrender.com)'};render();return}S.srv=url;save();let ws;try{ws=new WebSocket(url)}catch(e){OL={err:'サーバーURLが不正です'};render();return}
OL={ws,err:'',live:false,q:[],slot:'s',n:0};ws.onopen=()=>ws.send(JSON.stringify(first));ws.onmessage=e=>{try{olMsg(JSON.parse(e.data))}catch(x){}};
ws.onclose=()=>{if(OL&&OL.ws===ws){if(!OL.bye)OL.err='サーバーとの接続が切れました';OL.live=false;OL.ws=null;OL.room=null;render()}};ws.onerror=()=>{if(OL&&OL.ws===ws){OL.err='接続できませんでした。URLを確認してください(Renderの無料枠は起動に最大1分かかります)';render()}}}
function olMsg(m){switch(m.t){case'joined':OL.you=m.you;OL.code=m.code;break;case'room':OL.room=m;{const p=m.players.find(q=>q.id===OL.you);OL.slot=p?p.slot:'s'}break;case'err':OL.err=m.msg;break;case'start':OL.replaying=false;olStart(m);break;case'fs':for(const f of m.f){OL.q.push(f);OL.hist.push(f)}return;case'end':OL.endMsg=m;OL.endSaved=m;break;case'chat':OL.log=(OL.log||[]).concat({n:m.name,t:m.text}).slice(-6);break}render()}
const mkF=(s,side)=>({sd:side,cz:s.cz,x:side?170:-170,z:0,ux:side?-1:1,uz:0,ang:side?Math.PI:0,hp:s.hp,hv:s.hp,pd:{head:1,torso:1,rarm:1,larm:1,legs:1},sl:0,en:s.en,st:'idle',t:0,inv:0,ph:'',el:0,atk:null,tw:1,tr:1,mv:0,wph:0,wt:Math.random()*9,fall:0,fa:0,cs:1,th:0,md:[0,0],gh:[],dk:'',dd:.3,ps:Object.assign({},PS0),o:{hp:s.hp,en:s.en},rules:[],col:s.col,pt:s.pt,name:s.name,acc:s.acc});
function olStart(m){if(!OL.replaying){OL.hist=[];OL.info=m}OL.live=true;OL.p=mkF(m.a,0);OL.r=mkF(m.b,1);OL.q=[];OL.go=0;OL.endMsg=null;OL.fin=0;OL.n=0;OL.m={li:-1,p:OL.p,r:OL.r,t:60,sh:0,zm:0,run:true,cd:3,fl:0,res:null,slow:0,lo:null,k:0};PT=[];FT=[];BM=[];RG=[];TRL[0].length=TRL[1].length=0;$('msg').textContent=m.a.name+' VS '+m.b.name}
function olApply(f){const m=OL.m;for(const[r,a,pa]of[[OL.p,f.a,f.pa],[OL.r,f.b,f.pb]]){DK.forEach((k,i)=>r[k]=a[i]);PDK.forEach((k,i)=>r.pd[k]=pa[i]);const rush=r.st==='atk'&&r.atk&&AT[r.atk].mv&&r.ph==='wind';if((r.st==='dodge'||rush)&&OL.n%3===0)r.gh=[...r.gh,snap(r)].slice(-3);else if(r.gh.length&&OL.n%4===0)r.gh=r.gh.slice(1)}
OL.n++;const pc=m.cd;m.t=f.tm;m.sh=f.sh;m.zm=f.zm;m.cd=f.cd;m.slow=f.sl;m.lo=f.lo<0?null:f.lo?OL.r:OL.p;
if(pc>0&&Math.ceil(m.cd)!==Math.ceil(pc)){snd(m.cd>0?440:880,.12);if(m.cd<=0)m.fl=.8}
for(const[k,a]of f.ev){if(k==='b')burstR(...a);else if(k==='f')flR(...a);else if(k==='g')RG.push({x:a[0],z:a[1],l:.35,r:10});else if(k==='m')BM.push(Object.assign({},a[0]));else if(k==='s')H.sfx(...a);else if(k==='t')$('msg').textContent=a[0]}}
function olStep(){const q=OL.q;if(!OL.go){if(q.length>=5||OL.endMsg)OL.go=1;else return}let n=q.length>12?2:1;while(n--&&q.length)olApply(q.shift());
if(!q.length&&OL.endMsg&&!OL.fin){OL.fin=1;const e=OL.endMsg,me=OL.slot,pl=me===0||me===1;let res;if(e.w==='d')res='引き分け';else{const win=e.w==='p'?0:1;if(pl){res=win===me?(e.ko?'KO勝利!':'判定勝ち'):(e.ko?'KO負け…':'判定負け…');if(win===me){S.ow=(S.ow||0)+1;snd(523,.15);setTimeout(()=>snd(784,.3),160)}else snd(180,.4,'sawtooth')}else res=(win?OL.r.name:OL.p.name)+'の勝利'}
OL.m.res=res;const ac=checkAch();save();$('msg').textContent=res+(ac?' '+ac:'');render()}}
function olAct(a){if(a==='create')olConnect({t:'create',load:myLoad()});else if(a==='join'){const c=($('rc').value||'').trim().toUpperCase();if(!c){OL={err:'ルームコードを入力してください'};render();return}olConnect({t:'join',code:c,load:myLoad()})}
else if(a==='ready')olSend({t:'ready',v:!(OL.room&&OL.room.players.find(p=>p.id===OL.you)||{}).ready});else if(a==='start')olSend({t:'start'});else if(a==='upd'){olSend({t:'load',load:myLoad()});$('msg').textContent='現在の機体を送信しました'}
else if(a==='rep'){if(OL.hist&&OL.hist.length&&OL.info){OL.replaying=true;olStart(OL.info);OL.q=OL.hist.slice();OL.endMsg=OL.endSaved;OL.go=1}}else if(a==='chat'){const c=$('ct');if(c&&c.value.trim()){olSend({t:'chat',text:c.value.trim()});c.value=''}}else if(/^e\d$/.test(a)){olSend({t:'chat',text:EM[+a[1]]})}
else if(a==='back'){OL.live=false;OL.endMsg=null;OL.q=[];PT=[];FT=[];BM=[];RG=[]}else if(a==='leave'){if(OL&&OL.ws){OL.bye=1;olSend({t:'leave'});OL.ws.close()}OL=null}render()}
function olPanel(){const o=OL,b=build(S.parts);let h=`<div class="st">オンライン対戦(ルーム形式)<br>シングルで作った機体とプログラムで戦います ／ オンライン勝利 ${S.ow||0}</div>`;
if(!o||!o.ws){h+=`<div class="row"><div class="n"><b>サーバーURL</b><div class="mu">RenderのURLの https:// を wss:// に変えて入力(同じサイトで開いた場合は自動)</div></div></div><div class="row"><input type="text" id="srv" value="${srvDef()}" style="width:100%" aria-label="サーバーURL"></div>
<div class="row"><div class="n"><b>ルームを作る</b><div class="mu">コードを友達に伝えよう</div></div><button class="b" data-o="create">作成</button></div>
<div class="row"><input type="text" id="rc" maxlength="6" placeholder="コード" style="width:90px;text-transform:uppercase" aria-label="ルームコード"><div class="n"><b>ルームに入る</b><div class="mu">満員なら観戦になります</div></div><button class="b" data-o="join">入室</button></div>`+(o&&o.err?`<p class="mu" style="color:#d64545">${o.err}</p>`:'');return h}
const r=o.room;if(!r)return h+'<p class="mu">接続中…</p>'+(o.err?`<p class="mu" style="color:#d64545">${o.err}</p>`:'');
h+=`<div class="row"><div class="n"><span class="mu">ルームコード</span><div style="font-size:26px;font-weight:900;letter-spacing:4px">${r.code}</div></div><div class="mu">観戦 ${r.spec}人</div></div>`;
for(let i=0;i<2;i++){const p=r.players[i];h+=`<div class="row"><div class="n"><b>${i?'挑戦者':'ホスト'}</b>　${p?p.name+(p.id===o.you?'(あなた)':''):'<span class="mu">待機中…</span>'}</div><span class="mu">${p?(i===0||p.ready?'準備OK':'準備中'):''}</span></div>`}
if(o.live)h+=`<p class="mu">試合中…</p>`;else{const me=r.players.find(p=>p.id===o.you);h+=`<div class="row" style="flex-wrap:wrap">`+(o.slot===1?`<button class="b" data-o="ready">${me&&me.ready?'準備を取り消す':'準備OK'}</button>`:'')+(o.slot===0?`<button class="b" data-o="start" ${r.players.length<2||!r.players[1].ready?'disabled':''}>試合開始</button>`:'')+((o.slot===0||o.slot===1)?`<button class="b k" data-o="upd">機体を更新</button>`:'')+(o.endMsg&&OL.live===false&&OL.fin?'':'')+`</div>`;if(o.slot==='s')h+='<p class="mu">観戦中:ホストが開始すると試合が見られます</p>'}
if(o.live&&OL.fin)h+=`<div class="row"><button class="b" data-o="back">ロビーに戻る</button><button class="b k" data-o="rep">▶ リプレイ</button></div>`;
h+=`<div class="mu" style="min-height:3.4em;margin-top:6px">${(o.log||[]).map(l=>'<b>'+l.n+'</b>: '+l.t).join('<br>')}</div><div class="row"><input type="text" id="ct" maxlength="40" placeholder="チャット" style="flex:1" aria-label="チャット"><button class="b s" data-o="chat">送信</button></div><div class="row">${EM.map((e,i)=>`<button class="b s k" data-o="e${i}">${e}</button>`).join('')}</div>`;
h+=`<div class="row"><button class="b k" data-o="leave">退出</button></div><p class="mu">あなたの機体:HP ${b.hp|0} ／ 攻撃 x${b.pw.toFixed(2)} ／ 速度 x${b.sp.toFixed(2)}</p>`+(o.err?`<p class="mu" style="color:#d64545">${o.err}</p>`:'');return h}

const EM=['👏','🔥','😎','GG','もう一度!'];
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='ct')olAct('chat')});
