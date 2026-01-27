export class NeoParser {
  static parse(rawCode) {
    const result = {
      id: "",
      tag: "",
      styles: [],
      innerHTML: "",
      events: [],
      children: []
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
      let content = contentMatch[1].trim(); // ⭐ 이게 content
      let rest = content;                   // ⭐ 여기서 rest 생성

      while (rest.includes('@')) {
        const start = rest.indexOf('@');
        const { block, nextIndex } = extractTag(rest, start);

        result.children.push(this.parse(block));

        rest = rest.slice(0, start) + rest.slice(nextIndex);
      }

      const lines = rest.split('\n');

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

function extractTag(code, startIndex) {
  let i = startIndex;
  let depth = 0;
  let opened = false;

  while (i < code.length) {
    if (code[i] === '{') {
      depth++;
      opened = true;
    } else if (code[i] === '}') {
      depth--;
      if (opened && depth === 0) {
        i++; // 닫는 } 포함
        break;
      }
    }
    i++;
  }

  return {
    block: code.slice(startIndex, i).trim(),
    nextIndex: i
  };
}