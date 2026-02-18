export class NeoCore {
  static create(data) {
    
    if (data.type === "ifBlock") {
      let isTrue = false;
      try {
        // "$Store.state" -> "false" 로 변환
        const conditionStr = NeoCore.renderTemplate(data.condition);
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
            frag.appendChild(NeoCore.create(child));
          });
        }
        return frag;
      } else {
        // 거짓일 때: 화면에 아무것도 안 그리는 '빈 텍스트 노드' 반환 ⭐ (이게 핵심!)
        return document.createTextNode('');
      }
    }

    const el = document.createElement(data.tag || 'div');

    if (data.id) el.id = data.id;
    if (Array.isArray(data.styles)) {
      el.className = data.styles.join(' ');
    }

    if (data.attrs && typeof data.attrs === 'object') {
      for (const [key, rawValue] of Object.entries(data.attrs)) {

        // ⭐ 핵심: 먼저 렌더링
        const value = NeoCore.renderTemplate(String(rawValue));

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
      el.innerHTML = NeoCore.renderTemplate(data.innerHTML);
    }

    // 2️⃣ ⭐ 자식 태그 렌더링 (이게 핵심)
    if (Array.isArray(data.children)) {
      data.children.forEach(child => {
        const childEl = NeoCore.create(child);
        el.appendChild(childEl);
      });
    }
    
    (data.events || []).forEach(evt => {
      el.addEventListener(evt.type, () => {
        try {
          new Function(evt.action)();

          if (window.__neoRender) {
            window.__neoRender();
          }
        } catch (e) {
          console.error("Neo Event Error:", e);
        }
      });
    });

    return el;
  }

  static renderTemplate(template = "") {
    return template.replace(/\$([\w.]+)/g, (_, path) => {
      return path
        .split('.')
        .reduce((obj, key) => obj?.[key], window) ?? '';
    });
  }
}