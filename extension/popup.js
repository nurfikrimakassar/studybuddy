const root = document.getElementById("root");
let tickTimer = null;

const LOGO_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
  <rect x="3.8" y="4.6" width="6" height="14.8" rx="3" fill="#EFEBFB" />
  <rect x="14.2" y="4.6" width="6" height="14.8" rx="3" fill="#EFEBFB" />
  <rect x="8.6" y="7" width="6.8" height="2.8" rx="1.4" fill="#EFEBFB" />
</svg>`;

function sendMessage(type, payload) {
  return chrome.runtime.sendMessage({ type, payload });
}

async function apiFetch(path, options = {}) {
  const { apiToken } = await chrome.storage.local.get("apiToken");
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
      ...(options.headers || {}),
    },
  });
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function modeLabel(mode) {
  if (mode === "focus") return "Fokus";
  if (mode === "short") return "Istirahat";
  return "Istirahat Panjang";
}

function computeSecondsLeft(timer) {
  if (!timer.running || !timer.endAt) return timer.secondsLeft;
  return Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
}

async function init() {
  const { apiToken } = await chrome.storage.local.get("apiToken");
  if (!apiToken) {
    renderConnect();
    return;
  }

  const res = await apiFetch("/api/me").catch(() => null);
  if (!res || !res.ok) {
    renderConnect("Token nggak valid lagi — hubungkan ulang.");
    return;
  }

  const me = await res.json();
  renderMain(me);
}

function renderConnect(errorMessage) {
  if (tickTimer) clearInterval(tickTimer);
  root.innerHTML = `
    <div class="brand">
      <div class="box">${LOGO_SVG}</div>
      <span class="name">StudyBuddy</span>
    </div>
    <div class="card connect">
      <p class="muted" style="margin:0 0 12px; text-align:left;">
        Belum terhubung. Buka StudyBuddy di web, salin token dari halaman "Hubungkan Extension", lalu tempel di sini.
      </p>
      ${errorMessage ? `<p style="color:#9A5347; font-size:0.78rem; font-weight:700; margin:0 0 10px;">${errorMessage}</p>` : ""}
      <input id="token-input" type="text" placeholder="Tempel token di sini" />
      <button class="primary" id="connect-btn">Hubungkan</button>
    </div>
    <div class="links" style="margin-top:14px;">
      <a href="#" id="open-web">Buka halaman token di StudyBuddy →</a>
    </div>
  `;

  document.getElementById("open-web").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${API_BASE}/app/extension` });
  });

  document.getElementById("connect-btn").addEventListener("click", async () => {
    const token = document.getElementById("token-input").value.trim();
    if (!token) return;
    await chrome.storage.local.set({ apiToken: token });
    init();
  });
}

async function renderMain(me) {
  const { timer } = await sendMessage("GET_TIMER");
  const secondsLeft = computeSecondsLeft(timer);
  const total =
    timer.mode === "focus" ? timer.focusMin * 60 : timer.mode === "short" ? timer.shortMin * 60 : timer.longMin * 60;
  const progress = 1 - secondsLeft / total;
  const ringColor = timer.mode === "focus" ? "#4B4090" : "#6F8F6B";
  const presets = [
    { label: "25/5", focus: 25, short: 5, long: 15 },
    { label: "50/10", focus: 50, short: 10, long: 20 },
    { label: "15/3", focus: 15, short: 3, long: 10 },
  ];
  const activePreset = presets.find((p) => p.focus === timer.focusMin && p.short === timer.shortMin && p.long === timer.longMin);

  root.innerHTML = `
    <div class="row" style="margin-bottom:14px;">
      <div class="brand" style="margin:0;">
        <div class="box">${LOGO_SVG}</div>
        <span class="name">StudyBuddy</span>
      </div>
      <span class="status" style="background:${timer.running ? "#F1F6EF" : "#F3F1FA"}; color:${timer.running ? "#4E6B4A" : "#7A7593"};">
        ${timer.running ? "Sedang fokus" : "Dijeda"}
      </span>
    </div>

    <div class="card">
      <div class="ring" style="background: conic-gradient(${ringColor} ${progress}turn, #E4DEF6 ${progress}turn 1turn);">
        <div class="ring-inner">
          <div class="time" id="time-display">${formatTime(secondsLeft)}</div>
          <div class="mode">${modeLabel(timer.mode)} · Ronde ${timer.round}/4</div>
        </div>
      </div>
      <div class="controls">
        <button class="btn-round" id="reset-btn" title="Reset">↺</button>
        <button class="btn-main" id="toggle-btn" title="${timer.running ? "Jeda" : "Mulai"}">
          <span style="color:#fff; font-size:1.1rem;">${timer.running ? "❚❚" : "▶"}</span>
        </button>
        <button class="btn-round" id="skip-btn" title="Lewati">⏭</button>
      </div>
      <div class="presets">
        ${presets
          .map(
            (p) => `<button class="preset-btn${activePreset?.label === p.label ? " active" : ""}" data-preset="${p.label}">${p.label}</button>`
          )
          .join("")}
      </div>
      <button class="debug-btn" id="debug-btn">🐞 Tes: selesai 5 detik</button>
    </div>

    <div class="links">
      <a href="#" id="open-blocker">Kelola Site Blocker →</a>
      <a href="#" id="open-share">Bagikan Progres →</a>
      <a href="#" id="open-app">Buka StudyBuddy penuh →</a>
    </div>
  `;

  document.getElementById("toggle-btn").addEventListener("click", async () => {
    await sendMessage(timer.running ? "PAUSE" : "START");
    renderMain(me);
  });
  document.getElementById("reset-btn").addEventListener("click", async () => {
    await sendMessage("RESET");
    renderMain(me);
  });
  document.getElementById("skip-btn").addEventListener("click", async () => {
    await sendMessage("SKIP");
    renderMain(me);
  });
  document.getElementById("debug-btn").addEventListener("click", async () => {
    await sendMessage("DEBUG_FAST");
    renderMain(me);
  });
  root.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const p = presets.find((pr) => pr.label === btn.dataset.preset);
      await sendMessage("APPLY_PRESET", { focusMin: p.focus, shortMin: p.short, longMin: p.long, totalSessions: timer.totalSessions });
      renderMain(me);
    });
  });
  document.getElementById("open-blocker").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${API_BASE}/app/blocker` });
  });
  document.getElementById("open-share").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${API_BASE}/app/share` });
  });
  document.getElementById("open-app").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${API_BASE}/app` });
  });

  if (tickTimer) clearInterval(tickTimer);
  if (timer.running) {
    tickTimer = setInterval(() => {
      const s = computeSecondsLeft(timer);
      const el = document.getElementById("time-display");
      if (el) el.textContent = formatTime(s);
      // Sesi kelar sementara popup lagi kebuka — background.js yang beneran
      // proses transisinya (lewat alarm), di sini cuma re-render abis kasih
      // sedikit jeda biar background udah sempet update storage-nya dulu.
      if (s <= 0) {
        clearInterval(tickTimer);
        setTimeout(() => renderMain(me), 400);
      }
    }, 1000);
  }
}

init();
