const STORAGE_KEY = "vinh-todos-v1";

const DEFAULT_TODOS = [
  {
    id: "seed-nyc-hotel",
    text: "Book hotel for NYC next week",
    done: false,
    createdAt: Date.now(),
  },
];

const listEl = document.getElementById("todo-list");
const formEl = document.getElementById("add-form");
const inputEl = document.getElementById("new-todo");
const metaEl = document.getElementById("list-meta");
const emptyEl = document.getElementById("empty-state");

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_TODOS);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return structuredClone(DEFAULT_TODOS);
    return parsed;
  } catch {
    return structuredClone(DEFAULT_TODOS);
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();

function uid() {
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function updateMeta() {
  const open = todos.filter((t) => !t.done).length;
  const total = todos.length;
  if (total === 0) {
    metaEl.textContent = "";
    emptyEl.hidden = false;
    return;
  }
  emptyEl.hidden = true;
  metaEl.textContent = open === 0 ? "All done" : `${open} open · ${total} total`;
}

function render() {
  listEl.replaceChildren();

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = `todo-item${todo.done ? " done" : ""}`;
    li.dataset.id = todo.id;

    const check = document.createElement("button");
    check.type = "button";
    check.className = "check";
    check.setAttribute("aria-label", todo.done ? "Mark as not done" : "Mark as done");
    check.innerHTML =
      '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.2 6.4 11l6.1-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    check.addEventListener("click", () => toggleTodo(todo.id));

    const text = document.createElement("p");
    text.className = "todo-text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.setAttribute("aria-label", `Delete ${todo.text}`);
    del.textContent = "Remove";
    del.addEventListener("click", () => removeTodo(todo.id, li));

    li.append(check, text, del);
    listEl.append(li);
  }

  updateMeta();
}

function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos(todos);
  render();
}

function removeTodo(id, li) {
  li.classList.add("leaving");
  window.setTimeout(() => {
    todos = todos.filter((t) => t.id !== id);
    saveTodos(todos);
    render();
  }, 180);
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  todos = [
    {
      id: uid(),
      text,
      done: false,
      createdAt: Date.now(),
    },
    ...todos,
  ];
  saveTodos(todos);
  inputEl.value = "";
  render();
  inputEl.focus();
});

render();
