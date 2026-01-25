export class NeoCore {
  static create(data) {
    const el = document.createElement(data.tag || 'div');

    if (data.id) el.id = data.id;
    if (Array.isArray(data.styles)) {
      el.className = data.styles.join(' ');
    }

    el.innerHTML = NeoCore.renderTemplate(data.innerHTML);

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