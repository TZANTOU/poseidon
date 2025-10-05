const SEASONS = ["25-26","24-25", "23-24", "22-23","21-22","20-21","19-20","18-19","17-18","16-17","15-16","14-15","13-14","12-13"]
const DEFAULT_SEASON = "25-26";


const SEASON_LABELS = {
  "25-26": "Σεζόν 2025-26",
  "24-25": "Σεζόν 2024–25",
  "23-24": "Σεζόν 2023–24",
  "22-23": "Σεζόν 2022–23",
  "21-22": "Σεζόν 2021-22",
  "20-21": "Σεζόν 2020-21",
  "19-20": "Σεζόν 2019-20", 
  "18-19": "Σεζόν 2018-19", 
  "17-18": "Σεζόν 2017-18", 
  "16-17": "Σεζόν 2016-17", 
  "15-16": "Σεζόν 2015-16", 
  "14-15": "Σεζόν 2014-15", 
  "13-14": "Σεζόν 2013-14", 
  "12-13": "Σεζόν 2012-13"
};

function buildSeasonSelect(containerEl, currentSeason) {
  // φτιάχνουμε ένα wrapper πριν από το UL
  const controls = document.createElement("div");
  controls.style.marginBottom = "10px";

  const label = document.createElement("label");
  label.textContent = "Επιλογή σεζόν: ";
  label.style.marginRight = "6px";
  controls.appendChild(label);

  const select = document.createElement("select");
  select.id = "season-select";
  select.style.padding = "6px 8px";
  select.style.border = "1px solid #ddd";
  select.style.borderRadius = "6px";

  SEASONS.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    if (s === currentSeason) opt.selected = true;
    select.appendChild(opt);
  });

  controls.appendChild(select);

  // status κειμενάκι
  const status = document.createElement("span");
  status.id = "ranking-status";
  status.style.marginLeft = "10px";
  status.style.fontSize = "12px";
  status.style.color = "#666";
  controls.appendChild(status);

  // Βάλε τα controls πριν από το UL
  containerEl.parentNode.insertBefore(controls, containerEl);

  select.addEventListener("change", async () => {
    await loadRankingFromJSON(select.value);
  });
}
function renderList(containerEl, ranking) {
  containerEl.innerHTML = ""; // καθάρισμα UL
  // Δημιουργία <li> ανά ομάδα
  ranking.forEach((team) => {
    const li = document.createElement("li");
    li.style.display = "grid";
    li.style.gridTemplateColumns = "60px 1fr 80px";
    li.style.gap = "8px";
    li.style.alignItems = "center";
    li.style.padding = "8px 10px";
    li.style.borderBottom = "1px solid #eee";
    li.innerHTML = `
      <span style="font-weight:600;">${team.position ?? ""}</span>
      <span>${team.name ?? ""}</span>
      <span style="text-align:right;">${team.points ?? ""}</span>
    `;
    containerEl.appendChild(li);
  });
}
async function fetchSeasonData(season) {
  const url = `data/ranking_${encodeURIComponent(season)}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} για ${url}`);
  const data = await res.json();

  // Δέξου είτε { ranking: [...] } είτε απευθείας [...]
  if (Array.isArray(data?.ranking)) return data.ranking;
  if (Array.isArray(data)) return data;

  throw new Error("Μη αναμενόμενη δομή JSON (λείπει 'ranking').");
}
async function loadRankingFromJSON(seasonArg) {
  const season = seasonArg || DEFAULT_SEASON;
  const ul = document.getElementById("ranking-container");
  const status = document.getElementById("ranking-status");
 

  try {
    const ranking = await fetchSeasonData(season);
    renderList(ul, ranking);

    // Mini πίνακας αν υπάρχει
    const mini = document.querySelector("#standings-mini tbody");
    if (mini) {
      mini.innerHTML = ranking.slice(0, 6).map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${r.name ?? r.team ?? ""}</td>
          <td>${r.points ?? ""}</td>
        </tr>
      `).join("");
    }

    
  } catch (err) {
    console.error("Error loading ranking data:", err);
    if (status) status.textContent = `Σφάλμα: ${err?.message || err}`;
    ul.innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const ul = document.getElementById("ranking-container");
  buildSeasonSelect(ul, DEFAULT_SEASON);
  await loadRankingFromJSON(DEFAULT_SEASON);
});