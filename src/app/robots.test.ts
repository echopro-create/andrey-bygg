import robots from './robots';

describe('robots.txt generation', () => {
  let result: ReturnType<typeof robots>;

  beforeAll(() => {
    result = robots();
  });

  it('should define a single rules object', () => {
    expect(result.rules).toBeDefined();
  });

  it('should allow all user agents', () => {
    expect(result.rules).toHaveProperty('userAgent', '*');
  });

  it('should allow the root path', () => {
    expect(result.rules).toHaveProperty('allow', '/');
  });

  it('should disallow /api/ and /_next/ paths', () => {
    const rules = result.rules as { disallow?: string[] };
    expect(rules.disallow).toContain('/api/');
    expect(rules.disallow).toContain('/_next/');
  });

  it('should include a sitemap URL', () => {
    expect(result.sitemap).toBeDefined();
    expect(typeof result.sitemap).toBe('string');
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it('should not disallow important public pages', () => {
    const rules = result.rules as { disallow?: string[] };
    const disallow = rules.disallow as string[];
    const importantPaths = ['/', '/sv', '/en', '/no', '/ru', '/uk'];
    for (const path of importantPaths) {
      const blocked = disallow.some((d) => path.startsWith(d.replace(/\/$/, '')));
      expect(blocked).toBe(false);
    }
  });
});
