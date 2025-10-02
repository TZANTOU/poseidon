const USE_SHEET_FIRST= true;
const SHEET_ID ="1bzU8I1ENHuZMaeL53gngYwH_xDjbwgio7Or8nu0Sfac";
const SHEET_TABS = ["articles", "Form Responses 1", "Sheet1"];
const LOCAL_JSON_URL = "data/latest-news.json"; 

function slugify(s) {
  const map = {'ά':'a','α':'a','β':'v','γ':'g','δ':'d','ε':'e','έ':'e','ζ':'z','η':'i','ή':'i','θ':'th','ι':'i','ί':'i','ϊ':'i','ΐ':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','ό':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','ύ':'y','ϋ':'y','ΰ':'y','φ':'f','χ':'h','ψ':'ps','ω':'o','ώ':'o'};
  return String(s||'')
    .toLowerCase()
    .replace(/[άαβγδεέζηήθιίϊΐκλμνξοόπρσςτυύϋΰφχψωώ]/g, ch => map[ch] || ch)
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'');
}
function gvizUrl(sheetId, sheetName) {
  // cache-buster για να μην κρατάει παλιά αποτελέσματα
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json&t=${Date.now()}`;
}
function parseGviz(text) {
  const prefix = "/*O_o*/\ngoogle.visualization.Query.setResponse(";
  const suffix = ");";
  const trimmed = text.trim();
  if (!trimmed.startsWith(prefix)) throw new Error("Unexpected GViz wrapper.");
  return JSON.parse(trimmed.slice(prefix.length, trimmed.length - suffix.length));
}

function rowsToArticles(gvizObj) {
  const cols = (gvizObj.table.cols || []).map((c) => (c.label || "").trim());
  const idx = {
    title: cols.findIndex((c) => c.toLowerCase() === "title"),
    date: cols.findIndex((c) => c.toLowerCase() === "date"),
    imageUrl: cols.findIndex((c) => c.toLowerCase() === "imageurl"),
    description: cols.findIndex((c) => c.toLowerCase() === "description"),
    content: cols.findIndex((c) => c.toLowerCase() === "content"),
    slug: cols.findIndex((c) => c.toLowerCase() === "slug"),
  };
const cell = (row, i) => i < 0 ? "" : (row.c[i]?.f ?? row.c[i]?.v ?? "");
const rows = gvizObj.table.rows || [];

    const articles = rows.map(r => {
    const title = String(cell(r, idx.title) || "").trim();
    if (!title) return null;
    const date = String(cell(r, idx.date) || "").trim();         // π.χ. 29/09/2025
    const imageUrl = String(cell(r, idx.imageUrl) || "").trim();
    const description = String(cell(r, idx.description) || "").trim();
    const content = String(cell(r, idx.content) || "").trim();
    const manualSlug = String(cell(r, idx.slug) || "").trim();
    const slug = manualSlug || slugify(title);
    return { title, date, imageUrl, description, content, slug };
  }).filter(Boolean);

  // ΣΗΜΑΝΤΙΚΟ: ΔΕΝ κάνω sort εδώ για να παραμείνουν οι index σταθεροί (backward-compat με ?id=0,1,...)
  return articles;
}

async function fetchJsonArticles() {
  const res = await fetch(LOCAL_JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${LOCAL_JSON_URL}`);
  const data = await res.json();
  const arr = Array.isArray(data?.articles) ? data.articles : Array.isArray(data) ? data : [];

  // Βεβαιώσου ότι κάθε JSON-άρθρο έχει σταθερό id (κρατάμε το υπάρχον αν υπάρχει)
  return arr.map((a, i) => {
    const id = typeof a.id === "number" ? a.id : i; // αν στο JSON έχεις ήδη id, το κρατάμε
    return { ...a, id, slug: a.slug || slugify(a.title) };
  });
}

async function fetchSheetArticles() {
  let lastErr;
  for (const tab of SHEET_TABS) {
    try {
      const res = await fetch(gvizUrl(SHEET_ID, tab), { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} (${tab})`);
      const txt = await res.text();
      const gviz = parseGviz(txt);
      const rows = rowsToArticles(gviz);
      if (!rows.length) throw new Error(`No rows in tab "${tab}"`);
      return rows; // χωρίς id ακόμη — θα μπει offset πιο κάτω
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Unable to read from Google Sheet.");
}

function computeBaseOffset(jsonArticles) {
  // Αν το JSON έχει ρητό πεδίο id, χρησιμοποίησε max(id)+1, αλλιώς length
  const ids = jsonArticles.map(a => (typeof a.id === "number" ? a.id : null)).filter(v => v !== null);
  return ids.length ? Math.max(...ids) + 1 : jsonArticles.length;
}

function assignIdsWithOffset(articlesFromSheet, offset) {
  return articlesFromSheet.map((a, i) => ({ ...a, id: offset + i }));
}

function pickArticle(articles, idParam) {
  if (idParam == null) {
    return articles[0]; // default: πρώτο (π.χ. πιο πρόσφατο)
  }
  const isNumber = /^\d+$/.test(idParam);
  if (isNumber) {
    const idx = parseInt(idParam, 10);
    return articles[idx];
  }
  // slug match (case-insensitive)
  const target = idParam.toLowerCase();
  return articles.find((a) => (a.slug || "").toLowerCase() === target);
}

function renderArticle(article) {
  if (!article) {
    document.getElementById("article-content").textContent = "Δεν βρέθηκε Άρθρο.";
    return;
  }
  const titleEl = document.getElementById("article-title");
  const dateEl = document.getElementById("article-date");
  const imgEl = document.getElementById("article-img");
  const contentEl = document.getElementById("article-content");
  const descEl = document.getElementById("article-description");

  if (titleEl) titleEl.textContent = article.title || "";
  if (dateEl) dateEl.textContent = article.date || "";
  if (imgEl && article.imageUrl) imgEl.src = article.imageUrl;

  if (contentEl) contentEl.innerHTML = article.content || "";
  if (descEl) descEl.innerHTML = article.description || "";
}



const loadArticle = async() =>{
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    let jsonArticles = [];
    try {
        jsonArticles = await fetchJsonArticles();
    } catch (e) {
        console.warn("JSON load failed:", e);
    }
    const baseOffset = computeBaseOffset(jsonArticles);
    let sheetArticles = [];
     try {
        const rows = await fetchSheetArticles();
        sheetArticles = assignIdsWithOffset(rows, baseOffset); // Sheet ids: baseOffset, baseOffset+1, ...
    } catch (e) {
        console.warn("Sheet load failed:", e);
    }
    const combined = [...jsonArticles, ...sheetArticles];

    const article = pickArticle(combined, articleId);
    renderArticle(article);
};

document.addEventListener('DOMContentLoaded', loadArticle);