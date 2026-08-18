// Halaman offscreen — satu-satunya tempat di extension MV3 yang punya
// akses DOM buat mainin <audio>. background.js (service worker) nggak
// bisa mainin suara langsung, jadi dia kirim pesan ke sini.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type !== "PLAY_SOUND") return;
  const player = document.getElementById("player");
  player.currentTime = 0;
  player.play().catch(() => {});
  sendResponse({ ok: true });
});
