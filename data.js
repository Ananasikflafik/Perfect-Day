// ============================================================
//  КОНФІГ ГРИ — редагуйте цей файл, щоб змінювати контент.
//  Логіку (app.js) чіпати для цього не потрібно.
// ============================================================

// Скільки бананів дає БУДЬ-ЯКЕ власне (кастомне) завдання — фіксовано,
// користувач не може вказати свою ціну.
const CUSTOM_TASK_COINS = 5;

// ---- Базові завдання на день (id має бути унікальним) ----
const DEFAULT_TASKS = [
  { id: "water", icon: "💧", name: "Drink Water", coins: 5 },
  { id: "meditate", icon: "🧘", name: "Meditate", coins: 10 },
  { id: "school", icon: "💻", name: "Go to school", coins: 15 },
  { id: "walk", icon: "🚶", name: "Go for a walk", coins: 10 },
  { id: "read", icon: "📚", name: "Read a book", coins: 5 },
  { id: "sleep", icon: "😴", name: "Go to sleep", coins: 10 },
];

// ---- Стадії росту пета (за загальною кількістю виконаних завдань за весь час) ----
// "min" — мінімум totalCompleted, з якого діє ця стадія (масив має йти за зростанням)
// "image" — якщо задано, малюється картинка; якщо ні — використовується "emoji" (запасний варіант)
const PET_STAGES = [
  { min: 0, name: "Monkey", image: "./monkey.svg" }
];

// ---- Скіни (аксесуари), які можна купити й одягнути на пета ----
// "top" / "left" — позиція аксесуара у відсотках від зони пета.
// Якщо аксесуар сидить не на голові — просто підправте ці два числа,
// нічого іншого міняти не треба.
const SHOP_SKINS = [
  { id: "bow", icon: "🎀", name: "Bow", price: 30, top: "0%", left: "72%" },
  { id: "glasses", icon: "🕶️", name: "Glasses", price: 40, top: "26%", left: "50%" },
  { id: "hat", icon: "🎩", name: "Hat", price: 50, top: "-10%", left: "50%" },
  { id: "crown", icon: "👑", name: "Crown", price: 100, top: "-12%", left: "50%" },
];

// ---- Мапи. Розблоковуються автоматично, коли totalCompleted (завдань
// виконано за весь час) досягає "unlockAt". Купувати нічого не треба. ----
const MAPS = [
  { id: "room", name: "Room", unlockAt: 0, color: "#2e2b3a", image: "./BedroomTest.png" },
  { id: "park", name: "Парк", unlockAt: 30, color: "#274d2e" },
  { id: "beach", name: "Пляж", unlockAt: 60, color: "#0d5b7a" },
  { id: "space", name: "Космос", unlockAt: 100, color: "#191537" },
];