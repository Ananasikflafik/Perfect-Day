// ============================================================
//  КОНФІГ ГРИ — редагуйте цей файл, щоб змінювати контент.
//  Логіку (app.js) чіпати для цього не потрібно.
// ============================================================

// ---- Базові завдання на день (id має бути унікальним) ----
const DEFAULT_TASKS = [
  { id: "water", icon: "💧", name: "Drink Water", coins:5 },
  { id: "meditate", icon: "🧘", name: "Meditate",coins:10 },
  { id: "school", icon: "💻", name: "Go to school",coins:15 },
  { id: "walk", icon: "🚶", name: "Go for a walk",coins:10},
  { id: "read", icon: "📚", name: "Read a book",coins:5},
  { id: "sleep", icon: "😴", name: "Go to sleep",coins:10},
];

// ---- Стадії росту пета (за загальною кількістю виконаних завдань за весь час) ----
// "min" — мінімум totalCompleted, з якого діє ця стадія (масив має йти за зростанням)
const PET_STAGES = [
  { min: 0, emoji: "🥚", name: "Яйце" },
  { min: 10, emoji: "🐣", name: "Пташеня" },
  { min: 30, emoji: "🐥", name: "Курча" },
  { min: 60, emoji: "🐤", name: "Молодий птах" },
  { min: 100, emoji: "🦉", name: "Мудра сова" },
];

// ---- Скіни (аксесуари), які можна купити й одягнути на пета ----
const SHOP_SKINS = [
  { id: "bow", icon: "🎀", name: "Bow", price: 30 },
  { id: "glasses", icon: "🕶️", name: "Glasses", price: 40 },
  { id: "hat", icon: "🎩", name: "Hat", price: 50 },
  { id: "crown", icon: "👑", name: "Crown", price: 100 },
];

// ---- Фони, які можна купити й обрати для зони пета ----
// "room" вважається базовим і виданий одразу безкоштовно
const SHOP_BACKGROUNDS = [
  { id: "bedroom", name: "Bedroom", price: 0, color: "#2e2b3a", image:"./imgs/Rooms/Bedroom test.png"},
  { id: "washroom", name: "Washroom", price: 0, color: "#274d2e", image:"./imgs/Rooms/Kitchen.svg"},
  { id: "kitchen", name: "Kitchen", price: 0, color: "#0d5b7a" },
  { id: "school", name: "School", price: 0, color: "#191537" },

  { id: "hackathone", name: "Sunbeam Workplace", price: 200, color: "#191537" },
];
