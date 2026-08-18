// Generate simple "ding" chime WAV (dua nada, envelope biar nggak klik)
// tanpa library audio — raw PCM ditulis manual.
const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;

function tone(freq, durationSec, startAmp = 0.5) {
  const n = Math.round(SAMPLE_RATE * durationSec);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    // Decay eksponensial biar kedengeran kayak bel, bukan buzz datar.
    const envelope = Math.exp(-3.5 * t) * startAmp;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * envelope;
  }
  return samples;
}

function concat(...arrays) {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const a of arrays) {
    out.set(a, offset);
    offset += a.length;
  }
  return out;
}

const note1 = tone(880, 0.18); // A5
const gap = new Float32Array(Math.round(SAMPLE_RATE * 0.03));
const note2 = tone(1318.51, 0.32); // E6
const samples = concat(note1, gap, note2);

// Float32 [-1,1] -> Int16 PCM
const pcm = Buffer.alloc(samples.length * 2);
for (let i = 0; i < samples.length; i++) {
  const clamped = Math.max(-1, Math.min(1, samples[i]));
  pcm.writeInt16LE(Math.round(clamped * 32767), i * 2);
}

const byteRate = SAMPLE_RATE * 2;
const blockAlign = 2;
const dataSize = pcm.length;
const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + dataSize, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(byteRate, 28);
header.writeUInt16LE(blockAlign, 32);
header.writeUInt16LE(16, 34); // bits per sample
header.write("data", 36);
header.writeUInt32LE(dataSize, 40);

const outDir = path.join(__dirname, "..", "extension", "sounds");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "ding.wav");
fs.writeFileSync(outPath, Buffer.concat([header, pcm]));
console.log(`wrote ${outPath}`);
