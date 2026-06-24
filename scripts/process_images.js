const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const HERO_SRC = '/Users/illia/.gemini/antigravity/brain/08499c6d-9e56-47a0-903c-805612083193/hero_bg_altan_1782334608586.png';
const PORTRAIT_SRC = '/Users/illia/.gemini/antigravity/brain/08499c6d-9e56-47a0-903c-805612083193/builder_portrait_tiler_1782334621381.png';

const HERO_DST = path.join(__dirname, '..', 'public', 'images', 'hero-bg.webp');
const PORTRAIT_DST = path.join(__dirname, '..', 'public', 'images', 'builder-portrait.webp');

async function processHero() {
  console.log('Processing Hero background...');
  // Hero needs to be 2880x1620 (16:9 ratio) and under 450KB
  let quality = 85;
  let size = Infinity;
  let buffer;

  while (size > 440 * 1024 && quality > 50) {
    buffer = await sharp(HERO_SRC)
      .resize(2880, 1620, {
        fit: 'cover',
        position: 'center'
      })
      .sharpen({ sigma: 1.0, flat: 1.0, jagged: 1.0 }) // Enhances sharpness for Retina
      .webp({ quality, effort: 6 })
      .toBuffer();
    
    size = buffer.length;
    console.log(`Hero quality: ${quality}, size: ${(size / 1024).toFixed(1)} KB`);
    quality -= 5;
  }

  fs.writeFileSync(HERO_DST, buffer);
  console.log(`✅ Saved Hero to ${HERO_DST} (${(size / 1024).toFixed(1)} KB)`);
}

async function processPortrait() {
  console.log('Processing Builder portrait...');
  // Portrait needs to be 1024x1365 (approx 3:4 ratio) and under 180KB
  let quality = 85;
  let size = Infinity;
  let buffer;

  while (size > 175 * 1024 && quality > 50) {
    buffer = await sharp(PORTRAIT_SRC)
      .resize(1024, 1365, {
        fit: 'cover',
        position: 'center'
      })
      .sharpen({ sigma: 0.8, flat: 1.0, jagged: 1.0 }) // Enhances sharpness for Retina
      .webp({ quality, effort: 6 })
      .toBuffer();

    size = buffer.length;
    console.log(`Portrait quality: ${quality}, size: ${(size / 1024).toFixed(1)} KB`);
    quality -= 5;
  }

  fs.writeFileSync(PORTRAIT_DST, buffer);
  console.log(`✅ Saved Portrait to ${PORTRAIT_DST} (${(size / 1024).toFixed(1)} KB)`);
}

async function main() {
  try {
    await processHero();
    await processPortrait();
    console.log('All images processed successfully!');
  } catch (err) {
    console.error('Error processing images:', err);
    process.exit(1);
  }
}

main();
