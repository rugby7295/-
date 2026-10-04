// 1ファイル版(オフライン用 dist/robo-fight.html)を作る: node tools/build-single.js
const fs = require('fs'), path = require('path');
const pub = path.join(__dirname, '..', 'public');
let html = fs.readFileSync(path.join(pub, 'index.html'), 'utf8');
const core = fs.readFileSync(path.join(pub, 'core.js'), 'utf8');
const game = fs.readFileSync(path.join(pub, 'game.js'), 'utf8');
html = html.replace('<script src="core.js"></script>', () => '<script>\n' + core + '\n</script>')
           .replace('<script src="game.js"></script>', () => '<script>\n' + game + '\n</script>');
fs.mkdirSync(path.join(__dirname, '..', 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'robo-fight.html'), html);
console.log('dist/robo-fight.html を作成しました');
