// Generate simple placeholder PNG icons for the Chrome extension (purple
// rounded square with the two-bar "binoculars" glyph, matching Logo.tsx)
// without needing an image library — raw PNG bytes via zlib.
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function makePng(size) {
  const bg = [0x3a, 0x31, 0x70]; // #3A3170
  const glyph = [0xef, 0xeb, 0xfb]; // #EFEBFB
  const raw = Buffer.alloc(size * (size * 3 + 1));

  // Glyph geometry (two vertical bars), scaled to icon size — mirrors
  // Logo.tsx's rect x=3.8/14.2 width=6 height=14.8 on a 24x24 viewBox.
  const s = size / 24;
  const barW = 6 * s, barH = 14.8 * s, barY = 4.6 * s;
  const bar1X = 3.8 * s, bar2X = 14.2 * s;

  for (let y = 0; y < size; y++) {
    let offset = y * (size * 3 + 1);
    raw[offset] = 0; // no filter
    offset += 1;
    for (let x = 0; x < size; x++) {
      const inBar1 = x >= bar1X && x < bar1X + barW && y >= barY && y < barY + barH;
      const inBar2 = x >= bar2X && x < bar2X + barW && y >= barY && y < barY + barH;
      const color = inBar1 || inBar2 ? glyph : bg;
      raw[offset++] = color[0];
      raw[offset++] = color[1];
      raw[offset++] = color[2];
    }
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const outDir = path.join(__dirname, "..", "extension", "icons");
for (const size of [16, 48, 128]) {
  fs.writeFileSync(path.join(outDir, `icon${size}.png`), makePng(size));
  console.log(`wrote icon${size}.png`);
}
