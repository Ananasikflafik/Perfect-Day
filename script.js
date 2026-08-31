// ---- Journal toggle button ----

document.getElementById("journalBtn").addEventListener("click", () => {

  const section = document.getElementById("journalSection");
    
    if (section.style.display === "none") {
        section.style.display = "block";
    }
    else { section.style.display = "none"}

});


// ---- Journal logic ----

let selectedMood = "🐵";

let entries = [];


const moodButtons = document.querySelectorAll(".mood");

moodButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    moodButtons.forEach(b => b.classList.remove("selected"));

    btn.classList.add("selected");

    selectedMood = btn.dataset.mood;

  });

});

moodButtons[0].classList.add("selected");


function loadEntries() {

  const saved = localStorage.getItem("journal-entries");

  entries = saved ? JSON.parse(saved) : [];

  renderEntries();

}


function saveEntries() {

  localStorage.setItem("journal-entries", JSON.stringify(entries));

}


function renderEntries() {

  const list = document.getElementById("entriesList");

  if (entries.length === 0) {

    list.innerHTML = `<div class="empty">No entries yet — swing in and write your first one! 🐒🍃</div>`;

    return;

  }

  list.innerHTML = entries

    .slice()

    .reverse()

    .map((entry, i) => {

      const realIndex = entries.length - 1 - i;

      return `

        <div class="entry">

          <button class="delete-btn" onclick="deleteEntry(${realIndex})">🗑️</button>

          <div class="entry-header">

            <span><span class="entry-mood">${entry.mood}</span> <strong>${escapeHtml(entry.title || "Untitled")}</strong></span>

            <span class="entry-date">${entry.date}</span>

          </div>

          <div class="entry-text">${escapeHtml(entry.text)}</div>

        </div>

      `;

    })

    .join("");

}


function escapeHtml(str) {

  const div = document.createElement("div");

  div.textContent = str;

  return div.innerHTML;

}


document.getElementById("saveBtn").addEventListener("click", () => {

  const title = document.getElementById("entryTitle").value.trim();

  const text = document.getElementById("entryText").value.trim();

  if (!text) return;


  const entry = {

    title,

    text,

    mood: selectedMood,

    date: new Date().toLocaleDateString(undefined, {

      weekday: "short", year: "numeric", month: "short", day: "numeric"

    })

  };

  entries.push(entry);

  saveEntries();

  renderEntries();


  document.getElementById("entryTitle").value = "";

  document.getElementById("entryText").value = "";

});


window.deleteEntry = (index) => {

  entries.splice(index, 1);

  saveEntries();

  renderEntries();

};


loadEntries();