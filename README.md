# 🚀 Neo Framework v2

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
npm install @junnyontop-pixel/neo-app@2.6.0
```

---

## ⚡️ Quick Start (Runtime 방식)

Neo v2는 **컴파일을 강제하지 않습니다.** `.neo` 파일은 런타임에서 직접 로드·파싱·렌더링됩니다.

### 1️⃣ 상태와 로직 (JavaScript)

Neo는 JavaScript 로직을 해석하거나 제한하지 않습니다.  
**상태와 함수는 순수 JavaScript로 작성합니다.**

#### `src/state.js`
```javascript
export const Store = {
  user: { name: "junnyontop-pixel" },
  todoList: [
    { text: "Neo v2.6.0 릴리즈", completed: true },
    { text: "update!", completed: false }
  ],
  
  get remainingCount() {
    return this.todoList.filter(t => !t.completed).length;
  }
};

window.Store = Store; // Neo 런타임 바인딩
```

---

### 2️⃣ UI 선언 (.neo)

#### `src/App.neo`
```neo
@App:div [p-6, bg-gray-50] {
  @Header:h1 [text-2xl, font-bold, mb-4] {
    innerHTML: "$Store.user.name 님의 오늘 할 일"
  }

  @List:div [bg-white, shadow, rounded-lg] {
    // 🆕 v2.6.0: 리스트 반복 렌더링
    ::for(todo in Store.todoList) {
      @Task:div [flex, items-center, p-4, border-b] {
        @Checkbox:input {
          ::attrs { type: "checkbox", checked: "$todo.completed" }
          // 실시간 데이터 바인딩 (this.checked 활용)
          on:change: todo.completed = this.checked
        }
        @Title:span [ml-3] { innerHTML: "$todo.text" }
      }
    }
  }

  @Footer:p [mt-4, text-sm, text-gray-400] {
    ::if($Store.remainingCount > 0) {
      innerHTML: "남은 할 일: $Store.remainingCount개"
    }
    ::if($Store.remainingCount === 0) {
      innerHTML: "🎉 모든 할 일을 완료했습니다!"
    }
  }
}
```

---

## 📝 Syntax & Usage (Neo v2)

### 주요 문법

| 문법 | 설명 | 예시 |
| :--- | :--- | :--- |
| **`@ID:Tag`** | 요소 ID와 HTML 태그 정의 | `@App:div` |
| **`[...]`** | Tailwind 스타일 리스트 | `[p-4, bg-white]` |
| **`innerHTML`** | 텍스트/HTML 내용 및 상태 바인딩 | `"Hello $Store.user"` |
| **`on:event`** | 이벤트 핸들러 바인딩 (`this` 지원) | `on:change: todo.completed = this.checked` |
| **`::attrs {...}`** | HTML 표준 속성 및 Boolean 속성 지원 | `::attrs { checked: "$todo.completed" }` |
| **`::if(cond) {...}`** | 조건부 렌더링 (v2.5.1+) | `::if($Store.state) { ... }` |
| **`::for(item in list)`** | **(v2.6.0)** 리스트 반복 렌더링 | `::for(todo in Store.todoList) { ... }` |

### 🆕 v2.6.0 신규 기능: 반복 렌더링 (`::for`)
- **지능형 스코프**: 루프 내부에서 `$item` 명칭으로 데이터에 직접 접근합니다.
- **Context Injection**: 이벤트 발생 시 현재 아이템의 참조를 유지하여 실시간 데이터 수정을 보장합니다.
- **순서 보장**: 선언된 위치 그대로 다른 요소들과 조화롭게 렌더링됩니다.

---

## 🔁 Render Model

Neo v2는 **의도적인 전체 재렌더 방식**을 사용합니다.

- **자동 반응형 ❌**: 복잡한 감시 로직(Proxy 등)을 제거하여 극한의 가벼움을 유지합니다.
- **명시적 렌더 ⭕**: `window.__neoRender()`를 호출하여 필요한 시점에 UI를 갱신합니다.
- **예측 가능성**: 데이터 흐름이 단방향으로 명확하여 디버깅이 쉽습니다.

---

## 🧠 Design Philosophy

- **JavaScript를 대체하지 않습니다.** 로직은 JS 본연의 힘을 활용하세요.
- **상태를 직접 관리하지 않습니다.** 상태 관리는 유연하게 선택하세요.
- **UI 선언만 책임집니다.** 가장 간결한 방법으로 구조를 정의하세요.

> **"JavaScript는 JavaScript답게, UI는 Neo로 선언하세요."**

## 📄 License

MIT License
