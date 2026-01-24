export class NeoCore {
  static create(data, ctx) {
    const el = document.createElement(data.tag || 'div');

    if (data.id) el.id = data.id;
    if (data.styles.length > 0) el.className = data.styles.join(" ");

    // ⭐ 여기서 실제 삽입이 일어남
    el.innerHTML = NeoCore.renderTemplate(data.innerHTML, ctx);

    data.events.forEach(evt => {
      el.addEventListener(evt.type, () => {
        try {
          const run = new Function('ctx', `
            with (ctx) {
              ${evt.action}
            }
          `);
          run(ctx);
        } catch (e) {
          console.error("이벤트 실행 에러:", e);
        }
      });
    });

    return el;
  }

  static createScriptContext(scriptCode) {
    const ctx = {};
    try {
      const runner = new Function('ctx', `
        with (ctx) {
          ${scriptCode}
        }
      `);
      runner(ctx);
    } catch (e) {
      console.error("Script 실행 에러:", e);
    }
    return ctx;
  }

  static renderTemplate(template, ctx) {
    if (!template) return "";

    return template.replace(/\$([\w]+)/g, (_, key) =>
      key in ctx ? ctx[key] : ""
    );
  }
}