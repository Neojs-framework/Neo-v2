export class NeoCore {
  static create(data) {
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