export class NeoParser {
  static parse(rawCode) {
    const result = { id: "", tag: "", script: "",  styles: [], innerHTML: "", events: [] };

    // 0. #Script {....}
    const scriptmatch = rawCode.match(/^\s*#Script\s*\{([\s\S]*?)\}\s*/m)
    if (scriptmatch) {
      result.script = scriptmatch[1].trim(); // ⭐ 내용만
      rawCode = rawCode.replace(scriptmatch[0], "").trim(); // ⭐ Script 제거
    }

    // 1. ID/Tag (@ID:Tag)
    const match = rawCode.match(/@([\w-]+):([\w-]+)/);
    if (match) {
      result.id = match[1];
      result.tag = match[2];
    }

    // 2. [Style]
    const styleMatch = rawCode.match(/\[(.*?)\]/);
    if (styleMatch) {
      result.styles = styleMatch[1].split(',').map(s => s.trim());
    }

    // 3. { Content/Event }
    const contentMatch = rawCode.match(/\{(.*)\}/s);
    if (contentMatch) {
      const lines = contentMatch[1].trim().split('\n');
      lines.forEach(line => {
        const text = line.trim();
        if (text.startsWith('innerHTML:')) {
          result.innerHTML = text.split(':')[1].replace(/['"]/g, '').trim();
        } else if (text.startsWith('on:')) {
          const parts = text.split(':');
          result.events.push({ type: parts[1].trim(), action: parts[2].trim() });
        }
      });
    }
    return result; 
  }
}