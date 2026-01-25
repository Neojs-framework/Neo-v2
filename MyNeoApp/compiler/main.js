import { NeoParser } from './NeoParser.js';
import { NeoCore } from '../core/NeoCore.js';

let currentPath = 'App.neo';

async function render() {
  const app = document.getElementById('app');

  try {
    const response = await fetch(`../src/${currentPath}`);
    const rawCode = await response.text();

    const parsed = NeoParser.parse(rawCode);
    const ui = NeoCore.create(parsed);

    app.replaceChildren(ui);
  } catch (e) {
    app.innerHTML = `<pre style="color:red">${e.message}</pre>`;
    console.error(e);
  }
}

// async function loadUserCode(path) {
//   const res = await fetch(path);
//   const code = await res.text();

//   // ⭐ window 스코프에서 실행
//   new Function(`
//     with (window) {
//       ${code}
//     }
//   `)();
// }

window.__neoRender = render;
// await loadUserCode('../src/actions.js');
render();