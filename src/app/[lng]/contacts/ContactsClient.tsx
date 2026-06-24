'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function ContactsClient({ dict }: { dict: Record<string, unknown> }) {
  const params = useParams();
  const lng = (typeof params?.lng === 'string' ? params.lng : 'sv') as string;
  const contacts = (dict.contacts || {}) as Record<string, unknown>;

  const [copied, setCopied] = useState<'email' | null>(null);

  const email = (contacts.email as string) || '';
  const phone = (contacts.phone as string) || '';
  const socialPhone = (contacts.social_phone as string) || '';
  const hours = (contacts.hours as string) || '';
  const subtitle = (contacts.subtitle as string) || '';
  const accent = (contacts.accent as string) || '';
  const title = (contacts.title as string) || '';
  const regionsDesc = (contacts.regions_desc as string) || '';

  const localized: Record<string, Record<string, string>> = {
    sv: {
      copy: 'Kopiera',
      copied: 'Kopierad!',
      hoursLabel: 'Öppettider',
      regionLabel: 'Region',
      writeUs: 'Skriv till oss',
      callUs: 'Ring oss',
    },
    en: {
      copy: 'Copy',
      copied: 'Copied!',
      hoursLabel: 'Hours',
      regionLabel: 'Region',
      writeUs: 'Write to us',
      callUs: 'Call us',
    },
    ru: {
      copy: 'Копировать',
      copied: 'Скопировано!',
      hoursLabel: 'Часы работы',
      regionLabel: 'Регион',
      writeUs: 'Написать нам',
      callUs: 'Позвонить',
    },
    uk: {
      copy: 'Копіювати',
      copied: 'Скопійовано!',
      hoursLabel: 'Години роботи',
      regionLabel: 'Регіон',
      writeUs: 'Написати нам',
      callUs: 'Зателефонувати',
    },
  };
  const l = localized[lng] || localized.en;

  return (
    <div className="contacts-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {title} <span className="gold-accent">{accent}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        <div className="contacts-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Левая колонка: Блок контактов */}
          <div className="contacts-form-wrapper glass-card reveal">
            <h3 className="form-box-title">{contacts.formTitle as string}</h3>

            <div className="info-items" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="info-item-row">
                <span className="info-item-label">{(contacts.email_label as string) || 'Email'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
                    title={l.copy}
                  >
                    {copied === 'email' ? l.copied : l.copy}
                  </button>
                </div>
              </div>

              <div className="info-item-row">
                <span className="info-item-label">{(contacts.phone_label as string) || 'Phone'}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <a href={`tel:${phone}`} className="info-item-val link-gold" style={{ fontSize: '1.1rem' }}>
                    {phone}
                  </a>
                  {socialPhone && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {(contacts.social_phone_label as string) || 'WhatsApp/Telegram/Viber'}:{' '}
                      <a
                        href={`https://wa.me/${socialPhone.replace(/\D/g, '')}`}
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
                <span className="info-item-label">{l.hoursLabel}</span>
                <span className="info-item-val" style={{ fontSize: '1.1rem' }}>{hours}</span>
              </div>

              {regionsDesc && (
                <div className="info-item-row">
                  <span className="info-item-label">{(contacts.regions_title as string) || l.regionLabel}</span>
                  <span className="info-item-val" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{regionsDesc}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <a href={`mailto:${email}`} className="btn btn-primary">
                {l.writeUs}
              </a>
              <a href={`tel:${phone}`} className="btn btn-secondary">
                {l.callUs}
              </a>
            </div>
          </div>

          {/* Правая колонка: Картинка чертежей на всю высоту */}
          <div className="contacts-info-column reveal">
            <div className="minimal-map-card" style={{ height: '100%', minHeight: '300px', position: 'relative' }}>
              <Image
                src="/images/contacts-bg.webp"
                alt="Andrey Bygg Plan"
                className="contacts-ambient-img"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                loading="lazy"
                style={{ objectFit: 'cover' }}
              />
              <div className="map-card-footer" style={{ position: 'relative', zIndex: 2 }}>
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
  );
}
