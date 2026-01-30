export class NeoParser {
  static parse(rawCode) {
    const result = {
      id: "",
      tag: "",
      styles: [],
      innerHTML: "",
      events: [],
      children: [],
      attrs: {}
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
      let rest = contentMatch[1].trim();

      // // ✅ 0) ::attrs 먼저 처리 (메타 블록은 먼저 제거해야 함)
      // while (rest.includes("::attrs")) {
      //   const start = rest.indexOf("::attrs");
      //   const { block, nextIndex } = extractBlock(rest, start);

      //   // attrs 누적 (여러 ::attrs 지원 가능)
      //   const parsed = parseAttrs(block);
      //   result.attrs = { ...result.attrs, ...parsed };

      //   // ::attrs 블록 제거
      //   rest = rest.slice(0, start) + rest.slice(nextIndex);
      // }

      // ✅ 1) children 태그들 파싱
      while (rest.includes('@')) {
        const start = rest.indexOf('@');
        const { block, nextIndex } = extractTag(rest, start);

        result.children.push(this.parse(block));

        rest = rest.slice(0, start) + rest.slice(nextIndex);
      }

      // ✅ 2) ::attrs 메타 블록 파싱
      if (rest.includes('::attrs')) {
        const start = rest.indexOf('::attrs');
        const { block, nextIndex } = extractBlock(rest, start);

        result.attrs = parseAttrs(block);

        rest = rest.slice(0, start) + rest.slice(nextIndex);
      }

      // ✅ 2) 남은 것에서 innerHTML / on: 만 파싱
      const lines = rest.split('\n');

      lines.forEach(line => {
        const text = line.trim();
        if (!text) return;

        if (text.startsWith('innerHTML:')) {
          let value = text.slice('innerHTML:'.length).trim();

          // 문자열 리터럴이면 바깥 따옴표만 제거
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          result.innerHTML = value;
        }

        if (text.startsWith('on:')) {
          const [, type, ...restParts] = text.split(':');
          result.events.push({
            type: type.trim(),
            action: restParts.join(':').trim()
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

function extractBlock(code, startIndex) {
  const open = code.indexOf('{', startIndex);
  if (open === -1) {
    return { block: "", nextIndex: startIndex };
  }

  let depth = 1;
  let i = open + 1;

  while (i < code.length && depth > 0) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') depth--;
    i++;
  }

  return {
    block: code.slice(open + 1, i - 1),
    nextIndex: i
  };
}

function parseAttrs(block) {
  const attrs = {};

  block.split('\n').forEach(line => {
    const text = line.trim();
    if (!text) return;

    // "type: "text"," 같은 마지막 콤마 제거
    const cleaned = text.replace(/,\s*$/, '');
    if (!cleaned.includes(':')) return;

    const [key, ...rest] = cleaned.split(':');
    let value = rest.join(':').trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    attrs[key.trim()] = value;
  });

  return attrs;
}