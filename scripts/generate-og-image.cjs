const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 630;

async function main() {
  const bg = await sharp({
    create: {
      width: W,
      height: H,
      channels: 3,
      background: { r: 8, g: 9, b: 8 },
    },
  })
    .png()
    .toBuffer();

  const frameSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="${W - 60}" height="${H - 60}"
        fill="none" stroke="#c4a96a" stroke-width="1" opacity="0.3" rx="2"/>
    </svg>`;

  const textSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e2d2b5"/>
          <stop offset="50%" stop-color="#d4be96"/>
          <stop offset="100%" stop-color="#a38a5e"/>
        </linearGradient>
      </defs>

      <g transform="translate(600, 175)" opacity="0.4">
        <circle cx="0" cy="0" r="40" fill="none" stroke="url(#gold)" stroke-width="1"/>
        <text x="0" y="8" text-anchor="middle" fill="url(#gold)"
          font-family="Georgia, serif" font-size="36" font-style="italic">A</text>
      </g>

      <text x="600" y="340" text-anchor="middle"
        fill="#f0ebe0" font-family="Georgia, serif" font-size="56" font-weight="bold"
        letter-spacing="4">
        ANDREY<tspan fill="url(#gold)"> BYGG</tspan>
      </text>

      <text x="600" y="390" text-anchor="middle"
        fill="#a38a5e" font-family="Arial, sans-serif" font-size="18" font-weight="300"
        letter-spacing="6" opacity="0.8">
        PROFESSIONAL BYGG &amp; RENOVERING
      </text>

      <line x1="510" y1="415" x2="690" y2="415" stroke="#c4a96a" stroke-width="0.5" opacity="0.3"/>

      <text x="600" y="460" text-anchor="middle"
        fill="#a8a098" font-family="Arial, sans-serif" font-size="15" font-weight="300"
        letter-spacing="1">
        Högkvalitativ renovering, snickeri och fastighetsskötsel i Sverige
      </text>

      <text x="600" y="510" text-anchor="middle"
        fill="#5a544a" font-family="Arial, sans-serif" font-size="12" font-weight="400"
        letter-spacing="3">
        BYGGISYD.SE
      </text>
    </svg>`;

  await sharp(bg)
    .composite([
      { input: Buffer.from(frameSvg), top: 0, left: 0 },
      { input: Buffer.from(textSvg), top: 0, left: 0 },
    ])
    .webp({ quality: 90 })
    .toFile(path.join(__dirname, '..', 'public', 'images', 'og-image.webp'));

  console.log('✅ OG image generated: public/images/og-image.webp (1200x630)');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
