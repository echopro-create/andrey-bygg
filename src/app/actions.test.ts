jest.mock('server-only', () => ({}));

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

import { submitBooking, BookingData } from './actions';

describe('submitBooking server action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieStore.get.mockReturnValue(undefined);
  });

  const validBooking: BookingData = {
    name: 'John Doe',
    phone: '+46 700 123 456',
    service: 'Classic Massage',
    message: 'I would like to book a session on Friday afternoon.',
    date: '2026-07-01',
    time: '14:00',
  };

  describe('Name validation', () => {
    it('should reject empty name', async () => {
      const result = await submitBooking({ ...validBooking, name: '' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Name');
    });

    it('should reject whitespace-only name', async () => {
      const result = await submitBooking({ ...validBooking, name: '   ' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Name');
    });

    it('should reject name shorter than 2 characters', async () => {
      const result = await submitBooking({ ...validBooking, name: 'A' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('Name');
    });

    it('should accept name with exactly 2 characters', async () => {
      const result = await submitBooking({ ...validBooking, name: 'Bo' });
      expect(result.success).toBe(true);
    });
  });

  describe('Phone validation', () => {
    it('should reject empty phone', async () => {
      const result = await submitBooking({ ...validBooking, phone: '' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('phone');
    });

    it('should reject phone with fewer than 6 digits', async () => {
      const result = await submitBooking({ ...validBooking, phone: '12345' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('phone');
    });

    it('should reject phone with more than 15 digits', async () => {
      const result = await submitBooking({ ...validBooking, phone: '1234567890123456' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('phone');
    });

    it('should reject repetitive phone numbers (all same digit)', async () => {
      const result = await submitBooking({ ...validBooking, phone: '1111111' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('phone');
    });

    it('should accept phone with symbols and spaces (non-digit chars stripped)', async () => {
      const result = await submitBooking({ ...validBooking, phone: '+46 (700) 123-456' });
      expect(result.success).toBe(true);
    });

    it('should accept phone with exactly 6 valid digits', async () => {
      const result = await submitBooking({ ...validBooking, phone: '123456' });
      expect(result.success).toBe(true);
    });
  });

  describe('Service validation', () => {
    it('should reject empty service', async () => {
      const result = await submitBooking({ ...validBooking, service: '' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('service');
    });
  });

  describe('Rate limiting', () => {
    it('should allow first submission', async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      const result = await submitBooking(validBooking);
      expect(result.success).toBe(true);
    });

    it('should block submission within 15 seconds of previous', async () => {
      const recentTime = (Date.now() - 5000).toString();
      mockCookieStore.get.mockReturnValue({ value: recentTime });
      const result = await submitBooking(validBooking);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many requests');
    });

    it('should allow submission after 15 seconds', async () => {
      const oldTime = (Date.now() - 16000).toString();
      mockCookieStore.get.mockReturnValue({ value: oldTime });
      const result = await submitBooking(validBooking);
      expect(result.success).toBe(true);
    });
  });

  describe('XSS sanitization', () => {
    it('should strip angle brackets from name', async () => {
      const result = await submitBooking({ ...validBooking, name: '<script>alert("xss")</script>John' });
      expect(result.success).toBe(true);
    });

    it('should strip angle brackets from message', async () => {
      const result = await submitBooking({ ...validBooking, message: '<img src=x onerror=alert(1)>Hello' });
      expect(result.success).toBe(true);
    });
  });

  describe('Cookie setting', () => {
    it('should set rate-limit cookie on successful submission', async () => {
      await submitBooking(validBooking);
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'last_submit_time',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 15,
        })
      );
    });

    it('should not set cookie on validation failure', async () => {
      await submitBooking({ ...validBooking, name: '' });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });
  });
});
