// ============================================================
//  ЛОГІКА ЗАСТОСУНКУ
//  Зазвичай цей файл редагувати не треба — контент у data.js
// ============================================================

const STORAGE_KEY = "perfectDayState";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    coins: 0,
    totalCompleted: 0, // за весь час — впливає на стадію пета
    lastActiveDate: todayStr(),
    completedTodayIds: [],
    customTasks: [],
    ownedSkins: [],
    equippedSkin: null,
    ownedBackgrounds: ["room"],
    equippedBackground: "room",
  };
}

function loadState() {
  let state;
  try {
    state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState();
  } catch {
    state = defaultState();
  }
  // якщо новий день — скидаємо тільки чекліст на сьогодні,
  // монети / пет / покупки залишаються назавжди
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

function allTasks() {
  return [...DEFAULT_TASKS, ...state.customTasks];
}

function petStageFor(total) {
  let stage = PET_STAGES[0];
  for (const s of PET_STAGES) {
    if (total >= s.min) stage = s;
  }
  return stage;
}

// ---- дії користувача ----
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

function addCustomTask(icon, name, coins) {
  state.customTasks.push({
    id: "custom_" + Date.now(),
    icon,
    name,
    coins,
  });
  saveState();
  renderAll();
}

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

function buyBackground(item) {
  if (state.ownedBackgrounds.includes(item.id) || state.coins < item.price) return;
  state.coins -= item.price;
  state.ownedBackgrounds.push(item.id);
  state.equippedBackground = item.id;
  saveState();
  renderAll();
}

function equipBackground(item) {
  state.equippedBackground = item.id;
  saveState();
  renderAll();
}

// ---- рендер ----
function renderPet() {
  const stage = petStageFor(state.totalCompleted);
  document.getElementById("pet-emoji").textContent = stage.emoji;
  document.getElementById("pet-name").textContent = stage.name;

  const skin = SHOP_SKINS.find((s) => s.id === state.equippedSkin);
  document.getElementById("pet-skin").textContent = skin ? skin.icon : "";

  const tasks = allTasks();
  const doneCount = state.completedTodayIds.length;
  const ratio = tasks.length ? doneCount / tasks.length : 0;
  const mood = ratio >= 0.8 ? "😄" : ratio > 0 ? "🙂" : "😴";
  document.getElementById("pet-mood").textContent = mood;

  document.getElementById("coin-count").textContent = state.coins;
  document.getElementById("pet-progress").textContent =
    `Виконано сьогодні: ${doneCount}/${tasks.length} · Всього за весь час: ${state.totalCompleted}`;

  const bg = SHOP_BACKGROUNDS.find((b) => b.id === state.equippedBackground);
  document.getElementById("pet-area").style.background = bg ? bg.color : "#2e2b3a";
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  allTasks().forEach((task) => {
    const done = state.completedTodayIds.includes(task.id);
    const row = document.createElement("div");
    row.className = "task-row" + (done ? " done" : "");
    row.innerHTML = `
      <span class="icon">${task.icon}</span>
      <span class="name">${task.name}</span>
      <span class="coins">🪙${task.coins}</span>
    `;
    row.onclick = () => toggleTask(task);
    list.appendChild(row);
  });
}

function renderShopGrid(container, items, owned, equippedId, buyFn, equipFn) {
  container.innerHTML = "";
  items.forEach((item) => {
    const isOwned = owned.includes(item.id);
    const isEquipped = equippedId === item.id;
    const card = document.createElement("div");
    card.className = "shop-item";
    card.innerHTML = `
      <div class="icon">${item.icon || "🖼️"}</div>
      <div class="name">${item.name}</div>
      <div class="price">${item.price === 0 ? "Безкоштовно" : "🪙 " + item.price}</div>
      <button>${isOwned ? (isEquipped ? "Одягнено" : "Обрати") : "Купити"}</button>
    `;
    const btn = card.querySelector("button");
    if (isEquipped) btn.classList.add("equipped");
    if (!isOwned && state.coins < item.price) btn.disabled = true;
    btn.onclick = () => (isOwned ? equipFn(item) : buyFn(item));
    container.appendChild(card);
  });
}

function renderShop() {
  renderShopGrid(
    document.getElementById("shop-skins"),
    SHOP_SKINS,
    state.ownedSkins,
    state.equippedSkin,
    buySkin,
    equipSkin
  );
  renderShopGrid(
    document.getElementById("shop-backgrounds"),
    SHOP_BACKGROUNDS,
    state.ownedBackgrounds,
    state.equippedBackground,
    buyBackground,
    equipBackground
  );
}

function renderAll() {
  renderPet();
  renderTasks();
  renderShop();
}

// ---- вкладки ----
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

// ---- форма додавання завдання ----
document.getElementById("add-task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const icon = document.getElementById("new-task-icon").value.trim() || "🙂";
  const name = document.getElementById("new-task-name").value.trim();
  const coins = Number(document.getElementById("new-task-coins").value) || 10;
  if (!name) return;
  addCustomTask(icon, name, coins);
  e.target.reset();
  document.getElementById("new-task-coins").value = 10;
});

// ---- старт ----
renderAll();
