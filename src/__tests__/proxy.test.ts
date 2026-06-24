import { proxy } from '../proxy';
import { NextRequest } from 'next/server';

function createMockRequest(pathname: string, acceptLanguage?: string): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers();
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage);
  }

  return {
    nextUrl: new URL(url),
    url,
    headers,
  } as unknown as NextRequest;
}

describe('proxy middleware (locale auto-detection)', () => {
  describe('paths that already contain locale', () => {
    it('should pass through /sv path', () => {
      const req = createMockRequest('/sv');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });

    it('should pass through /en/gallery path', () => {
      const req = createMockRequest('/en/gallery');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });

    it('should pass through /ru/services/windows-doors path', () => {
      const req = createMockRequest('/ru/services/windows-doors');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });
  });

  describe('static/internal paths are skipped', () => {
    it('should skip /images path', () => {
      const req = createMockRequest('/images/hero-bg.webp');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });

    it('should skip /api path', () => {
      const req = createMockRequest('/api/some-endpoint');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });

    it('should skip /_next path', () => {
      const req = createMockRequest('/_next/static/chunks/main.js');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });

    it('should skip favicon.ico', () => {
      const req = createMockRequest('/favicon.ico');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });

    it('should skip paths containing a dot (file extension)', () => {
      const req = createMockRequest('/robots.txt');
      const res = proxy(req);
      expect(res.headers.get('x-middleware-next')).toBeDefined();
    });
  });

  describe('redirect to auto-detected locale', () => {
    it('should redirect / to Swedish when Accept-Language is sv', () => {
      const req = createMockRequest('/', 'sv-SE,sv;q=0.9');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/sv/');
    });

    it('should redirect / to Ukrainian when Accept-Language is uk', () => {
      const req = createMockRequest('/', 'uk-UA,uk;q=0.9');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/uk/');
    });

    it('should redirect /gallery to Russian when Accept-Language is ru', () => {
      const req = createMockRequest('/gallery', 'ru-RU,ru;q=0.9');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/ru/gallery');
    });

    it('should respect quality (q) parameter in Accept-Language', () => {
      const req = createMockRequest('/', 'en;q=0.5,sv;q=0.8,ru;q=0.3');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/sv');
    });

    it('should redirect to English when Accept-Language is en', () => {
      const req = createMockRequest('/contacts', 'en-US,en;q=0.9');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/en/contacts');
    });
  });

  describe('fallback to default locale (sv)', () => {
    it('should redirect to Swedish when no Accept-Language header', () => {
      const req = createMockRequest('/');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/sv/');
    });

    it('should redirect to Swedish for unsupported locale', () => {
      const req = createMockRequest('/', 'fr-FR,fr;q=0.9');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/sv/');
    });

    it('should redirect to Swedish when Accept-Language is malformed', () => {
      const req = createMockRequest('/', 'invalid-header-format');
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toBe('http://localhost:3000/sv/');
    });
  });

  describe('preserves query parameters', () => {
    it('should preserve query string when redirecting', () => {
      const url = 'http://localhost:3000/contacts?book=true&service=windows-doors';
      const req = {
        nextUrl: new URL(url),
        url,
        headers: new Headers({ 'accept-language': 'sv-SE' }),
      } as unknown as NextRequest;

      const res = proxy(req);
      expect(res.headers.get('location')).toContain('?book=true&service=windows-doors');
    });
  });
});
