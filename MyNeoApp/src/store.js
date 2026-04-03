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
    // 여기서 리렌더링 트리거를 해주면 최고!
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