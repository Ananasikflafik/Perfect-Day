
const CUSTOM_TASK_COINS = 5;
 
const MAX_TASKS = 30;

const DEFAULT_TASK_ICON = "⭐";

const DEFAULT_TASKS = [
  { id: "water", icon: "💧", name: "Drink Water", coins: 5 },
  { id: "meditate", icon: "🧘", name: "Meditate", coins: 10 },
  { id: "school", icon: "💻", name: "Go to school", coins: 15 },
  { id: "walk", icon: "🚶", name: "Go for a walk", coins: 10 },
  { id: "read", icon: "📚", name: "Read a book", coins: 5 },
  { id: "sleep", icon: "😴", name: "Go to sleep", coins: 10 },
];


const PET_STAGES = [
  { min: 0,  name: "Monkey", image: "./imgs/Monkey/monkey.svg" },
];

const SHOP_SKINS = [
  { id: "bow", icon: "🎀", name: "Bow", price: 30, top: "0%", left: "72%" },
  { id: "glasses", icon: "🕶️", name: "Glasses", price: 40, top: "26%", left: "50%" },
  { id: "hat", icon: "🎩", name: "Hat", price: 50, top: "-10%", left: "50%" },
  { id: "crown", icon: "👑", name: "Crown", price: 100, top: "-12%", left: "50%" },
];

const MAPS = [
  { id: "bedroom", name: "Room", unlockAt: 0, color: "#2e2b3a", image: "./imgs/Rooms/BedroomBG.svg" },
  { id: "bathroom", name: "Bathroom", unlockAt: 30, color: "#274d2e", image:"./imgs/Rooms/BathroomBG.svg" },
  { id: "kitchen", name: "Kitchen", unlockAt: 60, color: "#0d5b7a", image:"./imgs/Rooms/KitchenBG.svg" },
  { id: "living room", name: "Living Room", unlockAt: 100, color: "#191537", image: "./imgs/Rooms/LivingroomBG.svg" },
  { id: "hackathone", name: "Sunbeam Workplace", unlockAt: 100, color: "#191537", image: "./imgs/Rooms/SunbeamBG.svg" }
];
