'use client';

import { Suspense, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import type { Dict } from '@/lib/config';
import { serviceSlugs } from '@/lib/config';
import { submitBooking } from '@/app/actions';

function ContactsInfo({ dict }: { dict: Dict }) {
  const params = useParams();
  const lng = (typeof params?.lng === 'string' ? params.lng : 'sv') as string;
  const contacts = (dict.contacts || {}) as Record<string, unknown>;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState<'email' | null>(null);

  const email = (contacts.email as string) || '';
  const phoneVal = (contacts.phone as string) || '';
  const socialPhone = (contacts.social_phone as string) || '';
  const hours = (contacts.hours as string) || '';
  const subtitle = (contacts.subtitle as string) || '';
  const accent = (contacts.accent as string) || '';
  const title = (contacts.title as string) || '';
  const regionsDesc = (contacts.regions_desc as string) || '';
  const messengerDigits = socialPhone.replace(/\D/g, '');

  const cl = {
    sv: { copy: 'Kopiera', copied: 'Kopierad!' },
    en: { copy: 'Copy', copied: 'Copied!' },
    ru: { copy: 'Копировать', copied: 'Скопировано!' },
    uk: { copy: 'Копіювати', copied: 'Скопійовано!' },
  }[lng] || { copy: 'Copy', copied: 'Copied!' };

  const formLabels: Record<string, Record<string, string>> = {
    sv: {
      name: 'Ditt namn',
      phone: 'Telefonnummer',
      service: 'Välj tjänst',
      message: 'Beskriv ditt projekt (valfritt)',
      submit: 'Skicka förfrågan',
      sending: 'Skickar...',
      success: 'Tack! Din förfrågan har skickats. Vi kontaktar dig inom kort.',
      error: 'Ett fel inträffade. Vänligen försök igen.',
      selectDefault: '-- Välj en tjänst --',
      otherQuestion: 'Övriga frågor',
      contactInfo: 'Kontaktinformation',
      regions: 'Verksamhetsområde',
    },
    en: {
      name: 'Your Name',
      phone: 'Phone Number',
      service: 'Select Service',
      message: 'Describe your project (optional)',
      submit: 'Submit Request',
      sending: 'Sending...',
      success: 'Thank you! Your request has been sent. We will get back to you shortly.',
      error: 'An error occurred. Please try again.',
      selectDefault: '-- Select a Service --',
      otherQuestion: 'Other questions',
      contactInfo: 'Contact Information',
      regions: 'Service Area',
    },
    ru: {
      name: 'Ваше имя',
      phone: 'Номер телефона',
      service: 'Выберите услугу',
      message: 'Описание проекта / Сообщение (необязательно)',
      submit: 'Отправить запрос',
      sending: 'Отправка...',
      success: 'Спасибо! Ваш запрос успешно отправлен. Мы свяжемся с вами в ближайшее время.',
      error: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
      selectDefault: '-- Выберите услугу --',
      otherQuestion: 'Другие вопросы',
      contactInfo: 'Контактная информация',
      regions: 'Регион работы',
    },
    uk: {
      name: 'Ваше ім\'я',
      phone: 'Номер телефону',
      service: 'Оберіть послугу',
      message: 'Опис проекту / Повідомлення (необов\'язково)',
      submit: 'Надіслати запит',
      sending: 'Надсилання...',
      success: 'Дякуємо! Ваш запит успішно надіслано. Ми зв\'яжемося з вами найближчим часом.',
      error: 'Сталася помилка. Будь ласка, спробуйте ще раз.',
      selectDefault: '-- Оберіть послугу --',
      otherQuestion: 'Інші питання',
      contactInfo: 'Контактна інформація',
      regions: 'Регіон роботи',
    },
  };
  const fl = formLabels[lng] || formLabels.en;

  const servicesList = serviceSlugs.map((slug) => ({
    value: slug,
    label: (dict.services?.items as Record<string, { title: string }>)?.[slug]?.title || slug,
  }));
  const servicesOptions = [
    ...servicesList,
    { value: 'other', label: fl.otherQuestion }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lng === 'ru' ? 'Пожалуйста, введите ваше имя' : 'Vänligen ange ditt namn');
      return;
    }
    if (!phone.trim()) {
      setError(lng === 'ru' ? 'Пожалуйста, введите ваш телефон' : 'Vänligen ange ditt telefonnummer');
      return;
    }
    if (!service) {
      setError(lng === 'ru' ? 'Пожалуйста, выберите услугу' : 'Vänligen välj en tjänst');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await submitBooking({
        name,
        phone,
        service: servicesOptions.find(opt => opt.value === service)?.label || service,
        message,
      });

      if (res.success) {
        setSuccess(true);
        setName('');
        setPhone('');
        setService('');
        setMessage('');
      } else {
        setError(res.error || fl.error);
      }
    } catch {
      setError(fl.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contacts-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '50px' }}>
          <h1 className="section-title">
            {title} <span className="gold-accent">{accent}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        <div className="contacts-grid">
          {/* Левая колонка: Форма отправки сметы/запроса */}
          <div className="contacts-form-wrapper glass-card reveal">
            <h3 className="form-box-title">{(contacts.formTitle as string) || fl.submit}</h3>

            {success ? (
              <div className="alert alert-success" style={{ margin: '20px 0', padding: '24px', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '12px' }}>✓</span>
                <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.5' }}>{fl.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contacts-form-element">
                {error && (
                  <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name" className="form-label">{fl.name} <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    placeholder={fl.name}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">{fl.phone} <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="+46 70 000 00 00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service" className="form-label">{fl.service} <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <div className="select-wrapper">
                    <select
                      id="service"
                      className="form-input custom-select"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      required
                      disabled={loading}
                    >
                      <option value="" disabled>{fl.selectDefault}</option>
                      {servicesOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">{fl.message}</label>
                  <textarea
                    id="message"
                    className="form-input form-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    placeholder="..."
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={loading}
                  style={{ width: '100%', height: '50px', marginTop: '16px' }}
                >
                  {loading ? fl.sending : fl.submit}
                </button>
              </form>
            )}
          </div>

          {/* Правая колонка: Контакты + Изображение */}
          <div className="contacts-info-column reveal">
            <div className="contacts-info-card glass-card">
              <h3 className="info-box-title">{fl.contactInfo}</h3>

              <div className="info-items">
                <div className="info-item-row">
                  <span className="info-item-label">{(contacts.email_label as string) || 'Email'}</span>
                  <div className="info-item-value-block">
                    <a href={`mailto:${email}`} className="info-item-val link-gold" style={{ fontSize: '1.1rem' }}>
                      {email}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(email);
                        setCopied('email');
                        setTimeout(() => setCopied(null), 2000);
                      }}
                      className="copy-btn"
                      title={cl.copy}
                    >
                      {copied === 'email' ? cl.copied : cl.copy}
                    </button>
                  </div>
                </div>

                <div className="info-item-row">
                  <span className="info-item-label">{(contacts.phone_label as string) || 'Phone'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <a href={`tel:${phoneVal}`} className="info-item-val link-gold" style={{ fontSize: '1.1rem' }}>
                      {phoneVal}
                    </a>
                    {socialPhone && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        WA / TG / Viber:{' '}
                        <a
                          href={`https://wa.me/${messengerDigits}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-gold link-gold"
                        >
                          {socialPhone}
                        </a>
                      </span>
                    )}
                  </div>
                </div>

                <div className="info-item-row">
                  <span className="info-item-label">{lng === 'ru' ? 'Часы работы' : lng === 'uk' ? 'Робочі години' : 'Arbetstider'}</span>
                  <span className="info-item-val" style={{ fontSize: '1.1rem' }}>{hours}</span>
                </div>

                {regionsDesc && (
                  <div className="info-item-row">
                    <span className="info-item-label">{fl.regions}</span>
                    <span className="info-item-val" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{regionsDesc}</span>
                  </div>
                )}
              </div>

              {/* Красивое изображение-подложка чертежей */}
              <div className="minimal-map-card" style={{ marginTop: 'auto' }}>
                <Image
                  src="/images/contacts-bg.webp"
                  alt="Andrey Bygg Plan"
                  className="contacts-ambient-img"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  loading="lazy"
                  style={{ objectFit: 'cover' }}
                />
                <div className="map-card-footer">
                  <div className="map-footer-text">
                    <h6>Halland & Skåne</h6>
                    <p>Sweden</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactsClient({ dict }: { dict: Dict }) {
  return (
    <Suspense fallback={<div className="container text-center"><span className="spinner"></span></div>}>
      <ContactsInfo dict={dict} />
    </Suspense>
  );
}
