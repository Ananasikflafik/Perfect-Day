

const STORAGE_KEY = "perfectDayState";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    coins: 0,
    totalCompleted: 0,
    lastActiveDate: todayStr(),
    completedTodayIds: [],
    tasks: DEFAULT_TASKS.map((t) => ({ ...t })), 
    ownedSkins: [],
    equippedSkin: null,
    equippedMap: "room",
    petName: "",
  };
}

function loadState() {
  let state;
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState();
  } catch {
    state = defaultState();
  }
  // м'яка міграція зі старих форматів збереження
  if (!state.tasks) {
    state.tasks = [...DEFAULT_TASKS.map((t) => ({ ...t })), ...(state.customTasks || [])];
  }
  if (!state.equippedMap) {
    state.equippedMap = state.equippedBackground || "room";
  }
  if (state.petName === undefined) state.petName = "";
  // якщо новий день — скидаємо тільки чекліст на сьогодні,
  // монети / пет / мапи / список завдань залишаються назавжди
  if (state.lastActiveDate !== todayStr()) {
    state.completedTodayIds = [];
    state.lastActiveDate = todayStr();
  }
  return state;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();
let currentMapCardEl = null; 
let editingTaskId = null;
let tasksExpanded = false; 

function allTasks() {
  return state.tasks;
}

function petStageFor(total) {
  let stage = PET_STAGES[0];
  for (const s of PET_STAGES) {
    if (total >= s.min) stage = s;
  }
  return stage;
}

function currentMap() {
  return MAPS.find((m) => m.id === state.equippedMap) || MAPS[0];
}

// ---- дії користувача: завдання ----
function toggleTask(task) {
  const idx = state.completedTodayIds.indexOf(task.id);
  if (idx === -1) {
    state.completedTodayIds.push(task.id);
    state.coins += task.coins;
    state.totalCompleted += 1;
  } else {
    state.completedTodayIds.splice(idx, 1);
    state.coins = Math.max(0, state.coins - task.coins);
    state.totalCompleted = Math.max(0, state.totalCompleted - 1);
  }
  saveState();
  renderAll();
}

function showLimitMessage(text) {
  const el = document.getElementById("task-limit-msg");
  el.textContent = text;
  el.classList.remove("hidden");
}
function hideLimitMessage() {
  document.getElementById("task-limit-msg").classList.add("hidden");
}

function addCustomTask(name) {
  if (state.tasks.length >= MAX_TASKS) {
    showLimitMessage("Too much tasks. You should consider taking a rest.");
    return;
  }
  hideLimitMessage();
  state.tasks.push({
    id: "custom_" + Date.now(),
    icon: DEFAULT_TASK_ICON, // іконка фіксована, вибору більше немає
    name,
    coins: CUSTOM_TASK_COINS, // фіксована ціна, без редагування
  });
  saveState();
  renderAll();
}

function deleteTask(taskId) {
  const task = state.tasks.find((t) => t.id === taskId);
  if (!task) return;
  if (!confirm(`Delete "${task.name}"?`)) return;
  state.tasks = state.tasks.filter((t) => t.id !== taskId);
  state.completedTodayIds = state.completedTodayIds.filter((id) => id !== taskId);
  if (editingTaskId === taskId) editingTaskId = null;
  hideLimitMessage();
  saveState();
  renderAll();
}

function startEditTask(taskId) {
  editingTaskId = taskId;
  renderTasks();
}
function cancelEditTask() {
  editingTaskId = null;
  renderTasks();
}
function saveEditTask(taskId) {
  const row = document.querySelector(`.task-row[data-id="${taskId}"]`);
  if (!row) return;
  const name = row.querySelector(".edit-name-input").value.trim();
  if (!name) return;
  const task = state.tasks.find((t) => t.id === taskId);
  task.name = name;
  editingTaskId = null;
  saveState();
  renderTasks();
}

// ---- дії користувача: магазин ----
function buySkin(item) {
  if (state.ownedSkins.includes(item.id) || state.coins < item.price) return;
  state.coins -= item.price;
  state.ownedSkins.push(item.id);
  state.equippedSkin = item.id; // одразу одягаємо
  saveState();
  renderAll();
}

function equipSkin(item) {
  state.equippedSkin = state.equippedSkin === item.id ? null : item.id;
  saveState();
  renderAll();
}

// ---- рендер: головний екран ----
function renderPet() {
  const stage = petStageFor(state.totalCompleted);
  const petEmojiEl = document.getElementById("pet-emoji");
  petEmojiEl.innerHTML = stage.image
    ? `<img src="${stage.image}" alt="${stage.name}" title="${stage.name}">`
    : `<span class="pet-emoji-fallback" title="${stage.name}">${stage.emoji}</span>`;

  const skin = SHOP_SKINS.find((s) => s.id === state.equippedSkin);
  const skinEl = document.getElementById("pet-skin");
  if (skin) {
    skinEl.textContent = skin.icon;
    skinEl.style.top = skin.top || "0%";
    skinEl.style.left = skin.left || "50%";
    skinEl.style.fontSize = skin.size || "32px";
  } else {
    skinEl.textContent = "";
  }

  document.getElementById("coin-count").textContent = state.coins;

  const nameEl = document.getElementById("pet-name");
  nameEl.innerHTML = state.petName
    ? `${state.petName} <span class="edit-icon">✏️</span>`
    : `Name <span class="edit-icon">✏️</span>`;
  nameEl.onclick = () => {
    const name = prompt("Name?", state.petName || "");
    if (name !== null) {
      state.petName = name.trim().slice(0, 24);
      saveState();
      renderPet();
    }
  };

  const map = currentMap();
  document.getElementById("pet-area").style.background = map.image
    ? `url('${map.image}') center/cover no-repeat`
    : map.color;
}

function buildTaskRow(task) {
  const done = state.completedTodayIds.includes(task.id);

  if (editingTaskId === task.id) {
    const row = document.createElement("div");
    row.className = "task-row editing";
    row.dataset.id = task.id;
    row.innerHTML = `
      <span class="icon">${task.icon}</span>
      <input type="text" class="edit-name-input" value="${task.name.replace(/"/g, "&quot;")}" />
      <button class="save-edit-btn">✔️</button>
      <button class="cancel-edit-btn">✖️</button>
    `;
    row.querySelector(".save-edit-btn").onclick = (e) => {
      e.stopPropagation();
      saveEditTask(task.id);
    };
    row.querySelector(".cancel-edit-btn").onclick = (e) => {
      e.stopPropagation();
      cancelEditTask();
    };
    return row;
  }

  const row = document.createElement("div");
  row.className = "task-row" + (done ? " done" : "");
  row.dataset.id = task.id;
  row.innerHTML = `
    <span class="icon">${task.icon}</span>
    <span class="name">${task.name}</span>
    <span class="coins">🍌${task.coins}</span>
    <span class="task-actions">
      <button class="edit-btn" title="Edit">✏️</button>
      <button class="delete-btn" title="Delete">🗑️</button>
    </span>
  `;
  row.onclick = () => toggleTask(task);
  row.querySelector(".edit-btn").onclick = (e) => {
    e.stopPropagation();
    startEditTask(task.id);
  };
  row.querySelector(".delete-btn").onclick = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  return row;
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  const tasks = allTasks();

  const showCollapsed = tasks.length > 4 && !tasksExpanded;
  const visibleTasks = showCollapsed ? tasks.slice(0, 4) : tasks;
  visibleTasks.forEach((task) => list.appendChild(buildTaskRow(task)));

  const toggleBtn = document.getElementById("toggle-tasks-btn");
  if (tasks.length > 4) {
    toggleBtn.classList.remove("hidden");
    toggleBtn.textContent = tasksExpanded
      ? " ▲"
      : `More ${tasks.length - 4} ▼`;
    toggleBtn.onclick = () => {
      tasksExpanded = !tasksExpanded;
      renderTasks();
    };
  } else {
    toggleBtn.classList.add("hidden");
  }

  document.getElementById("task-count").textContent = `Tasks: ${tasks.length}`;
}

function renderShop() {
  const container = document.getElementById("shop-skins");
  container.innerHTML = "";
  SHOP_SKINS.forEach((item) => {
    const isOwned = state.ownedSkins.includes(item.id);
    const isEquipped = state.equippedSkin === item.id;
    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
      <div class="icon">${item.icon}</div>
      <div class="name">${item.name}</div>
      <div class="price">🍌 ${item.price}</div>
      <button>${isOwned ? (isEquipped ? "Dressed" : "Pick") : "Buy"}</button>
    `;
    const btn = card.querySelector("button");
    if (isEquipped) btn.classList.add("equipped");
    if (!isOwned && state.coins < item.price) btn.disabled = true;
    btn.onclick = () => (isOwned ? equipSkin(item) : buySkin(item));
    container.appendChild(card);
  });
}

function renderAll() {
  renderPet();
  renderTasks();
  renderShop();
}

// ---- рендер: екран мап ----
function positionMarker(cardEl, animate) {
  const marker = document.getElementById("map-pet-marker");
  if (!marker || !cardEl) return;
  marker.style.transition = animate ? "transform 0.5s ease" : "none";
  const x = cardEl.offsetLeft + cardEl.offsetWidth / 2 - marker.offsetWidth / 2;
  const y = cardEl.offsetTop + cardEl.offsetHeight / 2 - marker.offsetHeight / 2;
  marker.style.transform = `translate(${x}px, ${y}px)`;
}

function renderMapsScreen() {
  const grid = document.getElementById("maps-grid");
  grid.innerHTML = '<div id="map-pet-marker">🐒</div>';
  currentMapCardEl = null;

  MAPS.forEach((map) => {
    const unlocked = state.totalCompleted >= map.unlockAt;
    const isCurrent = state.equippedMap === map.id;

    const card = document.createElement("div");
    card.className = "map-card" + (unlocked ? "" : " locked") + (isCurrent ? " current" : "");
    card.style.background = map.image
      ? `url('${map.image}') center/cover no-repeat`
      : map.color;
    card.innerHTML = unlocked
      ? `<div class="map-name">${map.name}</div>`
      : `<div class="map-name">${map.name}</div><div class="map-lock">🔒 ${map.unlockAt} завдань</div>`;

    if (unlocked && !isCurrent) {
      card.onclick = () => {
        const prevCardEl = currentMapCardEl;
        state.equippedMap = map.id;
        saveState();
        prevCardEl && prevCardEl.classList.remove("current");
        card.classList.add("current");
        currentMapCardEl = card;
        positionMarker(card, true);
      };
    }

    grid.appendChild(card);
    if (isCurrent) currentMapCardEl = card;
  });

  requestAnimationFrame(() => positionMarker(currentMapCardEl, false));
}

// ---- перемикання екранів (Main <-> Maps) ----
document.getElementById("open-maps-btn").addEventListener("click", () => {
  document.getElementById("screen-main").classList.add("hidden");
  document.getElementById("screen-maps").classList.remove("hidden");
  renderMapsScreen();
});

document.getElementById("home-btn").addEventListener("click", () => {
  document.getElementById("screen-maps").classList.add("hidden");
  document.getElementById("screen-main").classList.remove("hidden");
  renderAll(); // тут "проявляється" нова мапа на головному екрані
});

// ---- вкладки Today / Shop ----
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---- форма додавання завдання (ціна й іконка фіксовані, вводиться лише назва) ----
document.getElementById("add-task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("new-task-name").value.trim();
  if (!name) return;
  addCustomTask(name);
  document.getElementById("new-task-name").value = "";
});

// ---- старт ----
renderAll();

window.debugCompleteTasks = function (n = 10) {
  state.totalCompleted += n;
  state.coins += n * 5;
  saveState();
  renderAll();
  console.log(`totalCompleted тепер = ${state.totalCompleted}`);
};