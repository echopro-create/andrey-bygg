import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.join(__dirname, '../../public');

describe('SEO static files', () => {
  describe('PWA manifest (site.webmanifest)', () => {
    let manifest: Record<string, unknown>;

    beforeAll(() => {
      const content = fs.readFileSync(path.join(PUBLIC_DIR, 'site.webmanifest'), 'utf-8');
      manifest = JSON.parse(content);
    });

    it('should have a name', () => {
      expect(manifest.name).toBeDefined();
      expect(typeof manifest.name).toBe('string');
      expect((manifest.name as string).length).toBeGreaterThan(0);
    });

    it('should have a short_name', () => {
      expect(manifest.short_name).toBeDefined();
      expect(typeof manifest.short_name).toBe('string');
      expect((manifest.short_name as string).length).toBeGreaterThan(0);
    });

    it('should have icons array with at least one icon', () => {
      expect(Array.isArray(manifest.icons)).toBe(true);
      expect((manifest.icons as Array<unknown>).length).toBeGreaterThanOrEqual(1);
    });

    it('each icon should have src, sizes, and type', () => {
      for (const icon of manifest.icons as Array<Record<string, unknown>>) {
        expect(icon.src).toBeDefined();
        expect(icon.sizes).toBeDefined();
        expect(icon.type).toBe('image/png');
      }
    });

    it('should have 192x192 and 512x512 icons', () => {
      const icons = manifest.icons as Array<Record<string, string>>;
      const sizes = icons.map((i) => i.sizes);
      expect(sizes).toContain('192x192');
      expect(sizes).toContain('512x512');
    });

    it('should have theme_color and background_color', () => {
      expect(manifest.theme_color).toBeDefined();
      expect(manifest.background_color).toBeDefined();
    });

    it('should have display set to standalone', () => {
      expect(manifest.display).toBe('standalone');
    });

    it('should have a start_url', () => {
      expect(manifest.start_url).toBe('/');
    });
  });

  describe('Google Search Console verification', () => {
    it('should have google verification file', () => {
      const exists = fs.existsSync(path.join(PUBLIC_DIR, 'google13719b92e35599e0.html'));
      expect(exists).toBe(true);
    });
  });

  describe('Yandex Webmaster verification', () => {
    it('should have yandex verification file', () => {
      const exists = fs.existsSync(path.join(PUBLIC_DIR, 'yandex_857b19f9c8090403.html'));
      expect(exists).toBe(true);
    });
  });

  describe('Favicon assets', () => {
    it('should have favicon.ico', () => {
      expect(fs.existsSync(path.join(PUBLIC_DIR, 'favicon.ico'))).toBe(true);
    });

    it('should have favicon.svg', () => {
      expect(fs.existsSync(path.join(PUBLIC_DIR, 'favicon.svg'))).toBe(true);
    });

    it('should have apple-touch-icon.png', () => {
      expect(fs.existsSync(path.join(PUBLIC_DIR, 'apple-touch-icon.png'))).toBe(true);
    });
  });

  describe('OG image', () => {
    it('should have og-image.webp', () => {
      expect(fs.existsSync(path.join(PUBLIC_DIR, 'images/og-image.webp'))).toBe(true);
    });
  });

  describe('llms.txt', () => {
    it('should have llms.txt for AI crawlers', () => {
      const exists = fs.existsSync(path.join(PUBLIC_DIR, 'llms.txt'));
      expect(exists).toBe(true);
    });
  });
});
