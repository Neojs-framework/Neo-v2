export class NeoParser {
  static parse(rawCode) {
    const result = {
      type: "element",
      id: "",
      tag: "",
      styles: [],
      innerHTML: "",
      events: [],
      children: [],
      attrs: {},
      condition: null
    };

    // @ID:Tag
    const tagMatch = rawCode.match(/@([\w-]+):([\w-]+)/);
    if (tagMatch) {
      result.id = tagMatch[1];
      result.tag = tagMatch[2];
      // result.type = 'element'; 위에서 고정값으로 넣어줌
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

      while (rest.includes('::if')) {
        const start = rest.indexOf('::if');
        
        const conditionMatch = rest.slice(start).match(/::if\s*\((.*?)\)/);
        const condition = conditionMatch ? conditionMatch[1].trim() : "true";

        const { block, nextIndex } = extractBlock(rest, start);
        const dummyParsed = this.parse(`@if-container:div { ${block} }`);

        result.children.push({
          type: "ifBlock",
          condition: condition,
          children: dummyParsed.children
        });

        rest = rest.slice(0, start) + rest.slice(nextIndex);
      }

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

      // // ✅ 3) ::if 조건 렌더링 파싱        // 순서 옮기기
      // while (rest.includes('::if')) {
      //   const start = rest.indexOf('::if');
        
      //   // 1. 조건식 파싱
      //   const conditionMatch = rest.slice(start).match(/::if\s*\((.*?)\)/);
      //   const condition = conditionMatch ? conditionMatch[1].trim() : "true";

      //   // 2. 블록 파싱
      //   // startIndex를 주면 알아서 가장 가까운 { } 블록을 찾아줌
      //   const { block, nextIndex } = extractBlock(rest, start);

      //   // 3. 재귀 파싱
      //   const dummyParsed = this.parse(`@if-container:div { ${block} }`);

      //   // 4. 결과 저장
      //   result.children.push({
      //     type: "ifBlock",
      //     condition: condition,
      //     children: dummyParsed.children
      //   });

      //   // 5. 처리한 문자열 잘라내기 (무한 루프 방지)
      //   rest = rest.slice(0, start) + rest.slice(nextIndex);
      // }

      // ✅ 4) 남은 것에서 innerHTML / on: 만 파싱
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