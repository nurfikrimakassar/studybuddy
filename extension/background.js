importScripts("config.js");

const ALARM_NAME = "studybuddy-session-end";
const RULE_ID_BASE = 1000;

const DEFAULT_TIMER = {
  running: false,
  mode: "focus", // "focus" | "short" | "long"
  round: 1,
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  totalSessions: 0, // 0 = nggak dibatasi, muter terus
  completedSessions: 0,
  endAt: null, // timestamp ms — sisa waktu dihitung dari ini, bukan decrement
  secondsLeft: 25 * 60,
};

async function getToken() {
  const { apiToken } = await chrome.storage.local.get("apiToken");
  return apiToken || null;
}

async function apiFetch(path, options = {}) {
  const token = await getToken();
  if (!token) throw new Error("belum terhubung ke akun StudyBuddy");
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

async function getTimer() {
  const { timer } = await chrome.storage.local.get("timer");
  return { ...DEFAULT_TIMER, ...(timer || {}) };
}

async function setTimer(patch) {
  const timer = { ...(await getTimer()), ...patch };
  await chrome.storage.local.set({ timer });
  return timer;
}

function durationFor(mode, timer) {
  if (mode === "focus") return timer.focusMin * 60;
  if (mode === "short") return timer.shortMin * 60;
  return timer.longMin * 60;
}

async function scheduleEndAlarm(endAt) {
  await chrome.alarms.clear(ALARM_NAME);
  chrome.alarms.create(ALARM_NAME, { when: endAt });
}

function notify(message) {
  if (!chrome.notifications) return;
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "StudyBuddy",
    message,
  });
}

async function updateBadge() {
  const timer = await getTimer();
  if (!timer.running) {
    chrome.action.setBadgeText({ text: "" });
    return;
  }
  const remaining = timer.endAt ? Math.max(0, Math.round((timer.endAt - Date.now()) / 1000)) : timer.secondsLeft;
  const mins = Math.ceil(remaining / 60);
  chrome.action.setBadgeText({ text: String(mins) });
  chrome.action.setBadgeBackgroundColor({ color: timer.mode === "focus" ? "#3A3170" : "#6F8F6B" });
}

// --- Site blocking (declarativeNetRequest dynamic rules) ---

async function enableBlocking() {
  try {
    const res = await apiFetch("/api/blocked-sites");
    if (!res.ok) return;
    const { domains } = await res.json();
    const rules = domains.slice(0, 500).map((domain, i) => ({
      id: RULE_ID_BASE + i,
      priority: 1,
      action: { type: "redirect", redirect: { extensionPath: "/blocked.html" } },
      condition: { urlFilter: `||${domain}^`, resourceTypes: ["main_frame"] },
    }));
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existing.map((r) => r.id),
      addRules: rules,
    });
  } catch {
    // gagal ambil daftar situs (mis. belum terhubung) — nggak fatal, timer tetap jalan
  }
}

async function disableBlocking() {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  if (existing.length === 0) return;
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: existing.map((r) => r.id) });
}

// --- Timer control ---

async function startTimer() {
  const timer = await getTimer();
  const endAt = Date.now() + timer.secondsLeft * 1000;
  await setTimer({ running: true, endAt });
  await scheduleEndAlarm(endAt);
  await updateBadge();
  if (timer.mode === "focus") await enableBlocking();
}

async function pauseTimer() {
  const timer = await getTimer();
  if (!timer.running) return;
  const remaining = timer.endAt ? Math.max(0, Math.round((timer.endAt - Date.now()) / 1000)) : timer.secondsLeft;
  await setTimer({ running: false, endAt: null, secondsLeft: remaining });
  await chrome.alarms.clear(ALARM_NAME);
  await updateBadge();
  await disableBlocking();
}

async function resetTimer() {
  const timer = await getTimer();
  await chrome.alarms.clear(ALARM_NAME);
  await setTimer({
    running: false,
    mode: "focus",
    round: 1,
    completedSessions: 0,
    endAt: null,
    secondsLeft: timer.focusMin * 60,
  });
  await updateBadge();
  await disableBlocking();
}

async function logSession(durationMinutes) {
  try {
    await apiFetch("/api/pomodoro/session", {
      method: "POST",
      body: JSON.stringify({ durationMinutes, completed: true }),
    });
  } catch {
    // gagal simpen — nggak fatal buat jalannya timer
  }
}

async function advance({ debugPause = false } = {}) {
  const timer = await getTimer();

  if (timer.mode === "focus") {
    logSession(timer.focusMin);

    const newCompleted = timer.completedSessions + 1;
    const targetReached = !debugPause && timer.totalSessions > 0 && newCompleted >= timer.totalSessions;
    const nextMode = timer.round % 4 === 0 ? "long" : "short";
    const nextSeconds = durationFor(nextMode, timer);

    if (debugPause || targetReached) {
      await chrome.alarms.clear(ALARM_NAME);
      await setTimer({ running: false, mode: nextMode, secondsLeft: nextSeconds, endAt: null, completedSessions: newCompleted });
      await disableBlocking();
      notify(debugPause ? "🐞 Sesi tes selesai & tersimpan." : "🎉 Semua sesi selesai, kerja bagus!");
    } else {
      const endAt = Date.now() + nextSeconds * 1000;
      await setTimer({ mode: nextMode, secondsLeft: nextSeconds, endAt, completedSessions: newCompleted });
      await scheduleEndAlarm(endAt);
      await disableBlocking();
      notify("Waktunya istirahat sebentar.");
    }
  } else {
    const nextRound = timer.mode === "long" ? 1 : timer.round + 1;
    const nextSeconds = durationFor("focus", timer);
    const endAt = Date.now() + nextSeconds * 1000;
    await setTimer({ mode: "focus", round: nextRound, secondsLeft: nextSeconds, endAt });
    await scheduleEndAlarm(endAt);
    await enableBlocking();
    notify("Istirahat kelar — fokus lagi!");
  }
  await updateBadge();
}

async function applyDurations({ focusMin, shortMin, longMin, totalSessions }) {
  await chrome.alarms.clear(ALARM_NAME);
  await setTimer({
    running: false,
    mode: "focus",
    round: 1,
    completedSessions: 0,
    endAt: null,
    focusMin,
    shortMin,
    longMin,
    totalSessions: totalSessions ?? 0,
    secondsLeft: focusMin * 60,
  });
  await updateBadge();
  await disableBlocking();
}

async function debugFastForward() {
  const timer = await getTimer();
  const endAt = Date.now() + 5000;
  await setTimer({ secondsLeft: 5, endAt, running: true });
  await scheduleEndAlarm(endAt);
  if (timer.mode === "focus") await enableBlocking();
  await updateBadge();
}

// --- Wiring ---

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) advance({ debugPause: false });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.type) {
        case "GET_TIMER":
          sendResponse({ timer: await getTimer() });
          break;
        case "START":
          await startTimer();
          sendResponse({ timer: await getTimer() });
          break;
        case "PAUSE":
          await pauseTimer();
          sendResponse({ timer: await getTimer() });
          break;
        case "RESET":
          await resetTimer();
          sendResponse({ timer: await getTimer() });
          break;
        case "SKIP":
          await advance({ debugPause: false });
          sendResponse({ timer: await getTimer() });
          break;
        case "DEBUG_FAST":
          await debugFastForward();
          sendResponse({ timer: await getTimer() });
          break;
        case "APPLY_PRESET":
          await applyDurations(msg.payload);
          sendResponse({ timer: await getTimer() });
          break;
        case "CONNECT":
          await chrome.storage.local.set({ apiToken: msg.token });
          sendResponse({ ok: true });
          break;
        case "DISCONNECT":
          await chrome.storage.local.remove("apiToken");
          await resetTimer();
          sendResponse({ ok: true });
          break;
        default:
          sendResponse({ error: "pesan nggak dikenal" });
      }
    } catch (err) {
      sendResponse({ error: String(err && err.message ? err.message : err) });
    }
  })();
  return true; // channel tetap kebuka buat sendResponse async
});

chrome.runtime.onStartup.addListener(updateBadge);
chrome.runtime.onInstalled.addListener(updateBadge);
