const params = new URLSearchParams(location.search);
document.getElementById("emoji").textContent = params.get("emoji") || "🎉";
document.getElementById("title").textContent = params.get("title") || "Sesi selesai!";
document.getElementById("message").textContent = params.get("message") || "Kerja bagus.";

document.getElementById("close-btn").addEventListener("click", () => window.close());

// Confetti ringan — kotak-kotak kecil jatuh dari atas, tanpa library.
const COLORS = ["#4B4090", "#3A3170", "#6F8F6B", "#B8AEDF"];
const confettiEl = document.getElementById("confetti");

for (let i = 0; i < 60; i++) {
  const piece = document.createElement("div");
  piece.className = "confetti-piece";
  const size = 6 + Math.random() * 6;
  piece.style.width = `${size}px`;
  piece.style.height = `${size * 0.4}px`;
  piece.style.left = `${Math.random() * 100}%`;
  piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
  piece.style.transform = `rotate(${Math.random() * 360}deg)`;
  confettiEl.appendChild(piece);

  const duration = 1400 + Math.random() * 1000;
  const delay = Math.random() * 300;
  const drift = (Math.random() - 0.5) * 160;

  piece.animate(
    [
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${drift}px, 100vh) rotate(${360 + Math.random() * 360}deg)`, opacity: 0.9 },
    ],
    { duration, delay, easing: "cubic-bezier(0.4, 0, 0.6, 1)", fill: "forwards" }
  );
}

// Jendela ini otomatis nutup sendiri kalau nggak disentuh, biar nggak numpuk.
setTimeout(() => window.close(), 8000);
