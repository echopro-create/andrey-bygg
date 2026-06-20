'use server';

export interface BookingData {
  name: string;
  phone: string;
  service: string;
  message: string;
  _csrf?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

const RATE_LIMIT_CLEANUP_INTERVAL = 300_000;
let lastCleanup = Date.now();

function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export async function submitBooking(formData: BookingData) {
  cleanupRateLimitMap();

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const rateLimitKey = formData.phone.replace(/[^0-9]/g, '') || 'anonymous';
  if (!checkRateLimit(rateLimitKey)) {
    return {
      success: false,
      error: 'Too many requests. Please wait before submitting again.',
    };
  }

  const sanitizedName = formData.name.replace(/[<>]/g, '').trim().slice(0, 100);
  const sanitizedPhone = formData.phone.replace(/[<>]/g, '').trim().slice(0, 30);
  const sanitizedService = formData.service.replace(/[<>]/g, '').trim().slice(0, 100);
  const sanitizedMessage = formData.message.replace(/[<>]/g, '').trim().slice(0, 500);

  const text = `
🔔 *New booking at Oleg Massage!*
👤 *Name:* ${sanitizedName}
📞 *Phone:* ${sanitizedPhone}
💆‍♂️ *Service:* ${sanitizedService}
✉️ *Message:* ${sanitizedMessage || '—'}
  `;

  if (!token || !chatId) {
    console.warn(
      '⚠️ [Oleg Massage Warning] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in .env.\n' +
      'Booking processed in demo mode.\n' +
      'Submission data:',
      { name: sanitizedName, phone: sanitizedPhone, service: sanitizedService, message: sanitizedMessage }
    );
    return {
      success: true,
      demo: true,
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Oleg Massage] Telegram API Error response:', errText);
      return { success: false, error: 'Failed to send notification via Telegram API.' };
    }

    return { success: true, demo: false };
  } catch (error: any) {
    console.error('[Oleg Massage] Exception while sending Telegram notification:', error);
    return { success: false, error: error.message || 'Unknown network error.' };
  }
}
