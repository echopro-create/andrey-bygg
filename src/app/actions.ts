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
🔔 *New booking at Oleg Massage!*
👤 *Name:* ${sanitizedName}
📞 *Phone:* ${sanitizedPhone}
💆‍♂️ *Service:* ${sanitizedService}
📅 *Date:* ${sanitizedDate || '—'}
🕒 *Time:* ${sanitizedTime || '—'}
✉️ *Message:* ${sanitizedMessage || '—'}
  `;

  if (!token || !chatId) {
    console.warn(
      '⚠️ [Oleg Massage Warning] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured in .env.\n' +
      'Booking processed in demo mode.\n' +
      'Submission data:',
      {
        name: sanitizedName,
        phone: sanitizedPhone,
        service: sanitizedService,
        date: sanitizedDate,
        time: sanitizedTime,
        message: sanitizedMessage,
      }
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
  } catch (error: unknown) {
    console.error('[Oleg Massage] Exception while sending Telegram notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown network error.',
    };
  }
}
