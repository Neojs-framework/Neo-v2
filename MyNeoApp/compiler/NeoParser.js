export class NeoParser {
  static parse(rawCode) {
    const result = {
      id: "",
      tag: "",
      styles: [],
      innerHTML: "",
      events: []
    };

    // @ID:Tag
    const tagMatch = rawCode.match(/@([\w-]+):([\w-]+)/);
    if (tagMatch) {
      result.id = tagMatch[1];
      result.tag = tagMatch[2];
    }

    // [styles]
    const styleMatch = rawCode.match(/\[(.*?)\]/);
    if (styleMatch) {
      result.styles = styleMatch[1]
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }

    // { content }
    const contentMatch = rawCode.match(/\{([\s\S]*?)\}$/);
    if (contentMatch) {
      const lines = contentMatch[1].trim().split('\n');

      lines.forEach(line => {
        const text = line.trim();

        if (text.startsWith('innerHTML:')) {
          let value = text.slice('innerHTML:'.length).trim();
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }
          result.innerHTML = value;
        }

        if (text.startsWith('on:')) {
          const [, type, ...rest] = text.split(':');
          result.events.push({
            type: type.trim(),
            action: rest.join(':').trim()
          });
        }
      });
    }

    return result;
  }
}