export class NeoCore {
  static create(data, loopContext = {}) {
    
    if (data.type === "ifBlock") {
      let isTrue = false;
      try {
        // "$Store.state" -> "false" 로 변환
        const conditionStr = NeoCore.renderTemplate(data.condition, loopContext);
        // "return false" 를 자바스크립트로 실행해서 진짜 false로 만듦
        isTrue = new Function(`return ${conditionStr}`)();
      } catch (e) {
        console.warn("Neo if condition error:", e);
      } 

      if (isTrue) {
        // 참일 때: 껍데기(div) 없이 알맹이만 DocumentFragment로 묶어서 반환
        const frag = document.createDocumentFragment();
        if (Array.isArray(data.children)) {
          data.children.forEach(child => {
            frag.appendChild(NeoCore.create(child, loopContext));
          });
        }
        return frag;
      } else {
        // 거짓일 때: 화면에 아무것도 안 그리는 '빈 텍스트 노드' 반환 ⭐ (이게 핵심!)
        return document.createTextNode('');
      }
    }

    if (data.type === "forBlock") {
      let list = [];
      try {
        const listPath = data.listPath;
        list = listPath
          .split('.')
          .reduce((obj, key) => obj?.[key], window) ?? [];
      } catch (e) {
        console.warn("Neo for list error:", e);
      }

      const frag = document.createDocumentFragment();
      if (Array.isArray(list)) {
        list.forEach((item, index) => {
          data.children.forEach(child => {
            const loopContext = { [data.itemName]: item, index: index };
            frag.appendChild(NeoCore.create(child, loopContext)); 
          });
        });
      }
      return frag;
    }

    const el = document.createElement(data.tag || 'div');

    if (data.id) el.id = data.id;
    if (Array.isArray(data.styles)) {
      el.className = data.styles.join(' ');
    }

    if (data.attrs && typeof data.attrs === 'object') {
      for (const [key, rawValue] of Object.entries(data.attrs)) {

        // ⭐ 핵심: 먼저 렌더링
        const value = NeoCore.renderTemplate(String(rawValue), loopContext);

        // boolean attribute
        if (value === 'true' || value === 'false') {
          el[key] = value === 'true';
          continue;
        }

        // input / textarea / select property
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          el instanceof HTMLSelectElement
        ) {
          if (key in el) {
            el[key] = value;
            continue;
          }
        }

        // fallback attribute
        el.setAttribute(key, value);
      }
    }

    // 1️⃣ 텍스트 먼저
    if (data.innerHTML) {
      el.innerHTML = NeoCore.renderTemplate(data.innerHTML, loopContext);
    }

    // 2️⃣ ⭐ 자식 태그 렌더링 (이게 핵심)
    if (Array.isArray(data.children)) {
      data.children.forEach(child => {
        const childEl = NeoCore.create(child, loopContext);
        el.appendChild(childEl);
      });
    }
    
    (data.events || []).forEach(evt => {
      el.addEventListener(evt.type, (e) => {
        try {
          const keys = Object.keys(loopContext);
          const values = Object.values(loopContext);

          // 1. 함수 생성
          const runner = new Function(...keys, evt.action);

          // 2. ⭐ 핵심: .call()을 사용해서 'this'를 현재 엘리먼트(el)로 고정!
          runner.call(el, ...values); 

          if (window.__neoRender) {
            window.__neoRender();
          }
        } catch (err) {
          console.error("Neo Event Error:", err);
        }
      });
    });

    return el;
  }

  static renderTemplate(template = "", loopContext = {}) {
    return template.replace(/\$([\w.]+)/g, (_, path) => {
      const keys = path.split('.');
      const firstKey = keys[0];

      // 1. 만약 loopContext(예: todo)에 첫 번째 키가 있다면 거기서 찾기
      if (loopContext.hasOwnProperty(firstKey)) {
        return keys.reduce((obj, key) => obj?.[key], loopContext) ?? '';
      }

      // 2. 없다면 전역 window(Store)에서 찾기
      return keys.reduce((obj, key) => obj?.[key], window) ?? '';
    });
  }
}