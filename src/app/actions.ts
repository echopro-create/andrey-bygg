'use server';

import { cookies } from 'next/headers';

export interface BookingData {
  name: string;
  phone: string;
  service: string;
  message: string;
  date?: string;
  time?: string;
  _csrf?: string;
}

export async function submitBooking(formData: BookingData) {
  const cookieStore = await cookies();
  const lastSubmit = cookieStore.get('last_submit_time')?.value;
  const now = Date.now();
  const LIMIT_MS = 15_000; // Ограничение: 1 запрос в 15 секунд
  // Server-side validation
  const digits = formData.phone ? formData.phone.replace(/\D/g, '') : '';
  if (!formData.name || !formData.name.trim() || formData.name.length < 2) {
    return {
      success: false,
      error: 'Name must be at least 2 characters.',
    };
  }
  if (!formData.phone || digits.length < 6 || digits.length > 15 || /^(.)\1+$/.test(digits)) {
    return {
      success: false,
      error: 'Please provide a valid phone number.',
    };
  }
  if (!formData.service) {
    return {
      success: false,
      error: 'Please select a service.',
    };
  }

  if (lastSubmit) {
    const lastTime = parseInt(lastSubmit, 10);
    if (now - lastTime < LIMIT_MS) {
      return {
        success: false,
        error: 'Too many requests. Please wait before submitting again.',
      };
    }
  }

  // Устанавливаем куку перед выполнением отправки
  cookieStore.set('last_submit_time', now.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15,
  });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const sanitizedName = formData.name.replace(/[<>]/g, '').trim().slice(0, 100);
  const sanitizedPhone = formData.phone.replace(/[<>]/g, '').trim().slice(0, 30);
  const sanitizedService = formData.service.replace(/[<>]/g, '').trim().slice(0, 100);
  const sanitizedMessage = formData.message.replace(/[<>]/g, '').trim().slice(0, 500);
  const sanitizedDate = formData.date ? formData.date.replace(/[<>]/g, '').trim().slice(0, 30) : '';
  const sanitizedTime = formData.time ? formData.time.replace(/[<>]/g, '').trim().slice(0, 30) : '';

  const text = `
🔔 *New booking at Andrey Bygg!*
👤 *Name:* ${sanitizedName}
📞 *Phone:* ${sanitizedPhone}
🛠️ *Service:* ${sanitizedService}
📅 *Date:* ${sanitizedDate || '—'}
🕒 *Time:* ${sanitizedTime || '—'}
✉️ *Message:* ${sanitizedMessage || '—'}
  `;

  if (!token || !chatId) {
    console.warn(
      '⚠️ [Andrey Bygg Warning] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in .env. ' +
      'Booking processed in demo mode.'
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
      console.error('[Andrey Bygg] Telegram API Error response:', errText);
      return { success: false, error: 'Failed to send notification via Telegram API.' };
    }

    return { success: true, demo: false };
  } catch (error: unknown) {
    console.error('[Andrey Bygg] Exception while sending Telegram notification:', error);
    return {
      success: false,
      error: 'Failed to send notification. Please try again later.',
    };
  }
}
