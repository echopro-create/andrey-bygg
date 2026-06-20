'use server';

export interface BookingData {
  name: string;
  phone: string;
  service: string;
  message: string;
}

export async function submitBooking(formData: BookingData) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = `
🔔 *Новая запись в Oleg Massage!*
👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
💆‍♂️ *Услуга:* ${formData.service}
✉️ *Сообщение:* ${formData.message || '—'}
  `;

  if (!token || !chatId) {
    console.warn(
      '⚠️ [Oleg Massage Warning] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены в .env.\n' +
      'Запись обработана в демонстрационном режиме.\n' +
      'Содержимое заявки:',
      formData
    );
    // Для демонстрации возвращаем успех
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
