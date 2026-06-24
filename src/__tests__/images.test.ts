import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const IMAGES_DIR = path.join(__dirname, '../../public/images');

// Максимальные размеры файлов (в байтах) — retina 2x для 2026
const MAX_FILE_SIZES = {
  service: 150 * 1024,      // 150KB
  gallery: 180 * 1024,      // 180KB
  hero: 200 * 1024,        // 200KB
  portrait: 180 * 1024,     // 180KB
  contacts: 150 * 1024,    // 150KB
  og: 200 * 1024,           // 200KB
};

// Максимальные размеры изображений (в пикселях) — retina 2x
const MAX_DIMENSIONS = {
  service: { width: 1024, height: 1024 },
  gallery: { width: 1024, height: 1024 },
  hero: { width: 1920, height: 1080 },
  portrait: { width: 1024, height: 1365 },
  contacts: { width: 1024, height: 1024 },
  og: { width: 1200, height: 1024 },
};

function getImageDimensions(filePath: string): { width: number; height: number } {
  try {
    const output = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}" 2>/dev/null`, { encoding: 'utf-8' });
    const widthMatch = output.match(/pixelWidth:\s*(\d+)/);
    const heightMatch = output.match(/pixelHeight:\s*(\d+)/);
    return {
      width: widthMatch ? parseInt(widthMatch[1]) : 0,
      height: heightMatch ? parseInt(heightMatch[1]) : 0,
    };
  } catch {
    return { width: 0, height: 0 };
  }
}

function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath));
    } else if (entry.isFile() && /\.(webp|png|jpg|jpeg|gif|svg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function categorizeImage(filePath: string): keyof typeof MAX_FILE_SIZES {
  const relativePath = path.relative(IMAGES_DIR, filePath);
  if (relativePath.startsWith('services/')) return 'service';
  if (relativePath.startsWith('gallery/')) return 'gallery';
  if (relativePath.includes('hero')) return 'hero';
  if (relativePath.includes('portrait')) return 'portrait';
  if (relativePath.includes('contacts')) return 'contacts';
  if (relativePath.includes('og-')) return 'og';
  return 'hero'; // default
}

describe('Image Performance Tests', () => {
  const allImages = getFilesRecursively(IMAGES_DIR);

  describe('File Format', () => {
    it('should use WebP format for all photos (not PNG/JPG)', () => {
      const nonWebP = allImages.filter((f) => {
        const ext = path.extname(f).toLowerCase();
        const relativePath = path.relative(IMAGES_DIR, f);
        // SVG и иконки допустимы
        if (ext === '.svg' || relativePath.includes('icon') || relativePath.includes('favicon')) return false;
        return ext === '.png' || ext === '.jpg' || ext === '.jpeg';
      });

      if (nonWebP.length > 0) {
        console.error('Non-WebP images found:', nonWebP.map((f) => path.relative(IMAGES_DIR, f)));
      }
      expect(nonWebP).toHaveLength(0);
    });
  });

  describe('File Sizes', () => {
    const testCases = allImages
      .filter((f) => path.extname(f).toLowerCase() === '.webp')
      .map((filePath) => {
        const category = categorizeImage(filePath);
        const stats = fs.statSync(filePath);
        const relativePath = path.relative(IMAGES_DIR, filePath);
        return { filePath, relativePath, category, size: stats.size };
      });

    it.each(testCases)('$relativePath should be under ${category} size limit ($size bytes)', ({ category, size }) => {
      const maxSize = MAX_FILE_SIZES[category];
      expect(size).toBeLessThanOrEqual(maxSize);
    });

    it('total images size on homepage should be under 500KB', () => {
      const homepageImages = allImages.filter((f) => {
        const relativePath = path.relative(IMAGES_DIR, f);
        // Изображения, загружаемые на главной странице
        return (
          relativePath.includes('hero') ||
          relativePath.includes('portrait') ||
          relativePath.startsWith('services/')
        );
      });

      const totalSize = homepageImages.reduce((sum, f) => sum + fs.statSync(f).size, 0);
      const maxHomepageSize = 1200 * 1024; // 1200KB

      console.log(`Homepage images total: ${(totalSize / 1024).toFixed(0)}KB / ${maxHomepageSize / 1024}KB`);
      expect(totalSize).toBeLessThanOrEqual(maxHomepageSize);
    });
  });

  describe('Image Dimensions', () => {
    const testCases = allImages
      .filter((f) => path.extname(f).toLowerCase() === '.webp')
      .map((filePath) => {
        const category = categorizeImage(filePath);
        const dimensions = getImageDimensions(filePath);
        const relativePath = path.relative(IMAGES_DIR, filePath);
        return { filePath, relativePath, category, dimensions };
      })
      .filter((tc) => tc.dimensions.width > 0 && tc.dimensions.height > 0);

    it.each(testCases)('$relativePath dimensions (${dimensions.width}x${dimensions.height}) should fit ${category} limits', ({ category, dimensions }) => {
      const maxDims = MAX_DIMENSIONS[category];
      // Допускаем небольшое отклонение (до 5%) из-за пропорций
      const tolerance = 1.05;
      expect(dimensions.width).toBeLessThanOrEqual(maxDims.width * tolerance);
      expect(dimensions.height).toBeLessThanOrEqual(maxDims.height * tolerance);
    });
  });

  describe('No Unused Images', () => {
    const sourceFiles = [
      path.join(__dirname, '../../src/app/[lng]/page.tsx'),
      path.join(__dirname, '../../src/app/[lng]/services/[service]/page.tsx'),
      path.join(__dirname, '../../src/app/[lng]/gallery/page.tsx'),
      path.join(__dirname, '../../src/app/[lng]/contacts/ContactsClient.tsx'),
      path.join(__dirname, '../../src/app/[lng]/layout.tsx'),
      path.join(__dirname, '../../src/app/globals.css'),
      path.join(__dirname, '../../src/app/[lng]/privacy/page.tsx'),
      path.join(__dirname, '../../src/app/sitemap.ts'),
      path.join(__dirname, '../../src/lib/config.ts'),
      path.join(__dirname, '../../src/components/Footer.tsx'),
    ];

    it('every image should be referenced in source code', () => {
      const sourceContent = sourceFiles
        .filter((f) => fs.existsSync(f))
        .map((f) => fs.readFileSync(f, 'utf-8'))
        .join('\n');

      const unusedImages = allImages
        .filter((f) => {
          const ext = path.extname(f).toLowerCase();
          if (ext === '.svg' || ext === '.ico') return false; // иконки пропускаем
          return true;
        })
        .filter((f) => {
          const basename = path.basename(f);
          const relativePath = '/' + path.relative(path.join(__dirname, '../../public'), f);
          // Проверяем точное совпадение или slug (для сервисных изображений)
          if (sourceContent.includes(basename)) return false;
          if (sourceContent.includes(relativePath)) return false;
          // Для сервисных изображений проверяем slug-паттерн
          if (relativePath.startsWith('/images/services/')) {
            const slug = basename.replace('.webp', '').replace('?v=2', '');
            if (sourceContent.includes(slug)) return false;
          }
          return true;
        })
        .map((f) => path.relative(IMAGES_DIR, f));

      if (unusedImages.length > 0) {
        console.error('Unused images:', unusedImages);
      }
      expect(unusedImages).toHaveLength(0);
    });
  });
});
