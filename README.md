# 🚀 Neo Framework v2 (@junnyontop-pixel/neo-app)

**Neo Framework v2**는 "더 간결하게, 더 직관적으로"라는 철학 아래 설계된 초경량 상태 기반 UI 프레임워크입니다. 
유지보수가 불가능했던 v1을 과감히 버리고, 처음부터 다시 설계하여 더욱 강력한 성능과 단순한 문법을 제공합니다.

---

> ⚠️ 현재 개발 중인 실험용 버전입니다. 실무 사용에는 주의가 필요합니다.

## 🛠 Installation (설치 방법)

```bash
npm install @junnyontop-pixel/neo-app@2.0.0
```

> 아직 v2는 출시 되지 않았습니다

---

## ⚡️ Quick Start with Vite (Vite 사용 권장)

**Neo Framework는 실시간 컴파일과 빠른 피드백(HMR)을 위해 Vite 환경에서의 사용을 강력히 권장합니다.**

1. `vite.config.js` 설정

파일 저장 시 자동으로 `.neo` 파일을 `.js`로 컴파일하도록 아래 플러그인 설정을 추가하세요.

``` js
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

export default defineConfig({
  plugins: [
    {
      name: 'neo-compiler',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.neo')) {
          try {
            // 파일 저장 시 자동으로 컴파일러 실행
            execSync(`node node_modules/@junnyontop-pixel/neo-app/compiler/main.js ${file}`, { stdio: 'inherit' });
            // 브라우저 새로고침 신호 전송
            server.ws.send({ type: 'full-reload' });
          } catch (e) {
            console.error('⚠️ Neo 컴파일 에러:', e.message);
          }
        }
      }
    }
  ]
});
```

2. 추가 설정

```bash
npx neoc-init
```
명령어를 사용하여 프로젝트를 초기화하세요.

프로젝트 루트에 생긴 src폴더 안의 App.neo파일을 수정하고

```bash
npx neoc src/App.neo
```
명령어를 사용해 컴파일하세요.

---

## 📝 Syntax & Usage (v2 신규 문법)

v2에서는 이벤트 선언 시 `@` 대신 `on:` 키워드를 사용하여 태그 선언과 이벤트를 명확히 구분합니다.

### 1. 로직 정의 (@Script)
데이터 상태와 함수를 정의합니다.

```neo
@Script {
    let count = 0;
    const add = () => count++;
}
```

### 2. UI 구조 정의 (@ID:Tag [Style] {Content})
`@ID:Tag [Style] { Content & Event }` 구조로 작성합니다.

```neo
@Main:div [flex, flex-col, items-center, p-10, bg-white] {
    
    @Title:h1 [text-3xl, font-bold] { 
        innerHTML: "Neo v2 New Syntax" 
    }

    @Counter:p [my-4, text-blue-500] { 
        innerHTML: "현재 숫자: $count" 
    }

    @UpBtn:button [px-4, py-2, bg-black, text-white, rounded] { 
        innerHTML: "증가"
        on:click: add()
        on:mouseover: console.log('hovered!')
    }
}
```

### 3. 주요 예약어 가이드

| 문법 | 설명 | 예시 |
| :--- | :--- | :--- |
| **`@ID:Tag`** | 요소의 고유 ID와 HTML 태그 정의 | `@App:div` |
| **`[...]`** | Tailwind 방식의 스타일 키워드 나열 | `[bg-red-500, p-4]` |
| **`innerHTML`** | 요소 내부의 텍스트나 HTML 정의 | `innerHTML: "Hello"` |
| **`on:이벤트`** | 이벤트 리스너를 정의 (v2 핵심 변경점) | `on:click: action()` |

---

## 🏗 Directory Structure (권장 구조)

```text
project-root/
├── node_modules/
├── src/
│   ├── App.neo      <-- Neo 소스 코드 작성
│   ├── NeoParser.js <-- 문자열 분석 로직
│   ├── NeoCore.js   <-- 생성 및 리턴 로직
│   └── main.js      <-- 모든 데이터를 연결하는 중계자
├── index.html       <-- <div id="app"></div> 포함
└── vite.config.js
```

---

## 📄 License
MIT License