# 🚀 Neo Framework v2 (@junnyontop-pixel/neo-app)

**Neo Framework v2**는  
“더 간결하게, 더 직관적으로”,  
**“최소한의 노력으로 최대의 결과를”** 라는 철학 아래 설계된 **초경량 런타임 UI DSL 프레임워크**입니다.

유지보수가 어려웠던 v1을 과감히 폐기하고,  
UI 선언과 JavaScript 로직을 명확히 분리하는 구조로  
처음부터 다시 설계되었습니다.

---

> ⚠️ **Note:** Neo v2는 현재 **실험적(Runtime-first) 버전**입니다.  
> 실무 사용 시 구조와 전역 상태 관리에 대한 이해가 필요합니다.

---

## 🛠 Installation (설치)

```bash
npm install @junnyontop-pixel/neo-app@2.5.1
```

---

## ⚡️ Quick Start (Runtime 방식)

Neo v2는 **컴파일을 강제하지 않습니다.** `.neo` 파일은 런타임에서 직접 로드·파싱·렌더링됩니다.

### 1️⃣ index.html

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>Neo App</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import './src/state.js';
    import './src/actions.js';
  </script>

  <script type="module" src="./compiler/main.js"></script>
</body>
</html>
```

---

### 2️⃣ 상태와 로직 (JavaScript)

Neo는 JavaScript 로직을 해석하거나 제한하지 않습니다.  
**상태와 함수는 순수 JavaScript로 작성합니다.**

#### `src/state.js`
```javascript
export const Store = {
  count: 0,
  
  add() {
    count++
  }
};
```

#### `src/actions.js`
```javascript
import { Store } from './state.js';

// Neo 런타임이 접근할 수 있도록 전역 바인딩
window.Store = Store;
```

---

### 3️⃣ UI 선언 (.neo)

Neo는 UI 선언만 담당합니다.

#### `src/App.neo`
```neo
@Btn:button [px-4, py-2, bg-black, text-white, rounded] {
  innerHTML: "현재 숫자: $Store.count"
  on:click: Store.add()
}
```

---

## 📝 Syntax & Usage (Neo v2)

### UI 구조 정의
```neo
@ID:Tag [Style] {
  innerHTML: "text"
  on:event: action()
}
```

### 주요 문법

| 문법 | 설명 | 예시 |
| :--- | :--- | :--- |
| **`@ID:Tag`** | 요소 ID와 HTML 태그 정의 | `@App:div` |
| **`[...]`** | Tailwind 스타일 리스트 | `[p-4, bg-white]` |
| **`innerHTML`** | 텍스트/HTML 내용 및 상태 바인딩 | `"Hello $Store.user"` |
| **`on:event`** | 이벤트 핸들러 바인딩 | `on:click: Store.add()` |
| **`::attrs {...}`** | HTML 표준 속성 추가 | `::attrs { type: "text" }` |

---

## 🔁 Render Model

Neo v2는 **의도적인 전체 재렌더 방식**을 사용합니다.

- **자동 반응형 ❌**: 복잡한 감시 로직을 제거하여 가볍습니다.
- **명시적 렌더 ⭕**: 상태 변화 후 필요한 시점에 렌더링을 트리거합니다.
- **예측 가능성**: 데이터 흐름이 명확하여 디버깅이 쉽습니다.

---

## 🏗 Recommended Structure

```text
project-root/
├── node_modules/
├── src/
│   ├── App.neo      # UI 선언 레이어
│   ├── state.js     # 데이터 레이어
│   └── actions.js   # 로직 레이어
├── index.html       # 엔트리 포인트
└── vite.config.js   # (선택 사항)
```

---

## 🧠 Design Philosophy

- **JavaScript를 대체하지 않습니다.** 로직은 JS 본연의 힘을 활용하세요.
- **상태를 직접 관리하지 않습니다.** 상태 관리는 유연하게 선택하세요.
- **UI 선언만 책임집니다.** 가장 간결한 방법으로 구조를 정의하세요.

> **"JavaScript는 JavaScript답게, UI는 Neo로 선언하세요."**

---

## 📄 License

MIT License
