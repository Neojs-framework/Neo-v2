# 🚀 Neo Framework v3 (Major)

**Neo Framework v3**는  
“더 간결하게, 더 직관적으로”,  
**“최소한의 노력으로 최대의 결과를”** 라는 철학 아래 설계된 **초경량 런타임 UI DSL 프레임워크**입니다.

v3에서는 `state`와 `actions`를 하나로 통합한 **Unified Store** 구조를 도입하여, 복잡한 데이터 흐름을 제거하고 개발 효율을 극대화했습니다.

---

> 💡 **v3 주요 변경 사항:**
> - **Unified Store**: `state.js`와 `actions.js`를 하나의 `Store` 객체로 통합.
> - **Native JS Power**: 함수 내부에서 `this`를 통해 데이터에 직접 접근 가능.
> - **Simplified Main**: 단 한 번의 `import`로 모든 런타임 준비 완료.

---

## 🛠 Installation (설치)

```bash
npm install @junnyontop-pixel/neo-app@3.0.0
```

---

## ⚡️ Quick Start (Runtime 방식)

Neo v3는 **컴파일을 강제하지 않습니다.** `.neo` 파일은 런타임에서 직접 로드·파싱·렌더링됩니다.

### 1️⃣ 통합 저장소 (Store)

로직과 데이터를 분리하지 마세요. **하나의 객체에 담으세요.**

#### `src/store.js`
```javascript
export const Store = {
  // 1. 유저 정보 ($Store.user.name)
  user: {
    name: "Neo"
  },

  // 2. 할 일 목록 (::for(todo in Store.todoList) 에서 쓰임)
  todoList: [
    { text: "Neo 프레임워크 v2.6.0 파서 완성", completed: true },
    { text: "::for 루프 데이터 바인딩 로직 구현", completed: false },
    { text: "할 일 추가 기능 구현", completed: false }
  ],

  // 3. 할 일을 추가하는 기능 (나중에 버튼 만들면 쓸 수 있게!)
  addTodo(text) {
    this.todoList.push({ text, completed: false });
  },

  get remainingCount() {
    return this.todoList.filter(todo => !todo.completed).length;
  },

  update() {
    if (window.__neoRender) {
      window.__neoRender();
    }
  }
};

window.Store = Store; // 전역에서 Store 접근 가능하도록
```

---

### 2️⃣ UI 선언 (.neo)

#### `src/App.neo`
```neo
@TodoApp:div [p-6, bg-gray-50] {
  @Header:h1 [text-2xl, font-bold, mb-4] {
    innerHTML: "$Store.user.name 님의 오늘 할 일"
  }
  @ListContainer:div [bg-white, shadow, rounded-lg] {
    ::attrs {
      "data-version": "2.6.0"
    }
    ::for(todo in Store.todoList) {
      @Task:div [flex, items-center, p-4, border-b] {
        @Checkbox:input {
          ::attrs { 
            type: "checkbox",
            checked: "$todo.completed"
          }

          on:change: todo.completed = this.checked
        }
        @Title:span [ml-3, text-gray-700] {
          innerHTML: "$todo.text"
        }
      }
    }
  }
  @Footer:p [mt-4, text-sm, text-gray-400] {
    ::if($Store.remainingCount > 0) {
      @Status:span {
        innerHTML: "아직 $Store.remainingCount개의 할 일이 남았습니다."
      }
    }
    ::if($Store.remainingCount === 0) {
      @Status:span [text-green-500, font-bold] {
        innerHTML: "🎉 모든 할 일을 끝냈습니다!"
      }
    }
  }
}
```

---

## 🔁 Render Model

Neo v3는 **의도적인 전체 재렌더 방식**을 고수합니다.

- **자동 반응형 ❌**: 복잡한 Proxy/Observable 로직을 제거하여 극한의 가벼움을 유지합니다.
- **명시적 렌더 ⭕**: `window.__neoRender()`를 호출하여 필요한 시점에 UI를 정확히 갱신합니다.
- **예측 가능성**: 데이터 흐름이 단방향으로 명확하여 디버깅이 압도적으로 쉽습니다.

---

## 🧠 Design Philosophy

- **JavaScript는 JavaScript답게**: 복잡한 프레임워크 전용 문법 대신 순수 JS 객체와 함수를 활용하세요.
- **단일 소스 원칙 (Single Source of Truth)**: `Store` 하나만 보면 앱의 모든 상태와 로직을 파악할 수 있습니다.
- **UI는 선언적으로**: 가장 간결한 `.neo` 문법으로 구조만 정의하세요.

> **"로직은 JavaScript 본연의 힘으로, UI는 Neo의 간결함으로."**

---

## 📄 License

MIT License
