let tasks = {};

// Gera um ID único usando a API crypto
const generateUniqueId = () => {
  return crypto.randomUUID();
};

// Salva as tarefas no localStorage
const setLocalStorage = (value) => {
  localStorage.setItem("tasks", JSON.stringify(value));
};

// Alterna o status 'done' de uma tarefa pelo id
const toggleDone = (id) => {
  if (!tasks[id]) return;

  tasks[id].done = !tasks[id].done;

  const taskElement = document.getElementById(id);
  if (tasks[id].done) {
    taskElement.classList.add('done');
  } else {
    taskElement.classList.remove('done');
  }

  setLocalStorage(tasks);
};

// Remove a tarefa do DOM e do objeto tasks
const deleteTask = (id) => {
  const element = document.getElementById(id);
  if (element) element.remove();

  delete tasks[id];
  setLocalStorage(tasks);
};

// Cria o elemento visual da tarefa e adiciona ao objeto tasks
const createTask = (text, id, isDone) => {
  const taskContainer = document.createElement("div");
  taskContainer.id = id;

  if (isDone) {
    taskContainer.classList.add('done');
  }

  taskContainer.addEventListener("click", () => toggleDone(id));

  const taskText = document.createElement("p");
  taskText.textContent = text;

  const deleteBtn = document.createElement("button");
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-solid fa-trash";
  deleteIcon.title = "Deletar tarefa";

  deleteBtn.appendChild(deleteIcon);
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(id);
  });

  taskContainer.appendChild(taskText);
  taskContainer.appendChild(deleteBtn);

  tasks[id] = {
    text: text,
    done: isDone
  };

  setLocalStorage(tasks);
  return taskContainer;
};

// Manipula o evento de adicionar nova tarefa
const handleAddTask = (text, id, done) => {
  const input = document.getElementById("new-item");
  const taskList = document.getElementById("task-list");

  if (text !== undefined && id !== undefined && done !== undefined) {
    const taskFromStorage = createTask(text, id, done);
    taskList.appendChild(taskFromStorage);
    return;
  }

  if (input.value.trim() === "") return;

  const newId = generateUniqueId();
  const newTask = createTask(input.value, newId, false);
  taskList.appendChild(newTask);
  input.value = "";
};

// Tecla Enter para adicionar tarefa
document.getElementById("new-item").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleAddTask();
  }
});

// Lê tarefas salvas no localStorage ao carregar
const readTasks = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};

  for (const id in savedTasks) {
    const { text, done } = savedTasks[id];
    handleAddTask(text, id, done);
  }
};

readTasks();
