'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

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
  const guarantees = (contacts.guarantees as Record<string, string>) || {};

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
        <div className="section-header text-center" style={{ marginBottom: '32px' }}>
          <h1 className="section-title">
            {title} <span className="gold-accent">{accent}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        <div className="contacts-grid">
          {/* Левая колонка: Блок контактов */}
          <div className="contacts-details-panel">
            <h2 className="contacts-panel-title">{contacts.formTitle as string}</h2>

            <div className="info-items-interactive">
              {/* Email */}
              <div className="info-item-row-interactive">
                <div className="info-item-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="info-item-content">
                  <span className="info-item-label">{(contacts.email_label as string) || 'Email'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
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
              </div>

              {/* Телефон */}
              <div className="info-item-row-interactive">
                <div className="info-item-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="info-item-content">
                  <span className="info-item-label">{(contacts.phone_label as string) || 'Phone'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <a href={`tel:${phone}`} className="info-item-val link-gold" style={{ fontSize: '1.1rem' }}>
                      {phone}
                    </a>
                    {socialPhone && (
                      <div className="contacts-socials-row">
                        <span className="contacts-socials-label">
                          {(contacts.social_phone_label as string) || 'WhatsApp/Telegram:'}
                        </span>
                        <div className="contacts-socials-links">
                          <a
                            href={`https://wa.me/${socialPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contacts-social-link whatsapp"
                            title="WhatsApp"
                            aria-label="WhatsApp"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            </svg>
                          </a>
                          <a
                            href={`https://t.me/+${socialPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contacts-social-link telegram"
                            title="Telegram"
                            aria-label="Telegram"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Часы работы */}
              <div className="info-item-row-interactive">
                <div className="info-item-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="info-item-content">
                  <span className="info-item-label">{l.hoursLabel}</span>
                  <span className="info-item-val" style={{ fontSize: '1.1rem', display: 'block', marginTop: '4px' }}>{hours}</span>
                </div>
              </div>

              {/* Регионы */}
              {regionsDesc && (
                <div className="info-item-row-interactive">
                  <div className="info-item-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="info-item-content">
                    <span className="info-item-label">{(contacts.regions_title as string) || l.regionLabel}</span>
                    <span className="info-item-val" style={{ fontSize: '0.9rem', lineHeight: '1.5', display: 'block', marginTop: '4px' }}>{regionsDesc}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="contacts-actions">
              <a href={`mailto:${email}`} className="btn btn-primary">
                {l.writeUs}
              </a>
              <a href={`tel:${phone}`} className="btn btn-secondary">
                {l.callUs}
              </a>
            </div>
          </div>

          {/* Правая колонка: Bento-сетка гарантий */}
          <div className="contacts-info-column">
            <div className="contacts-guarantees-grid">
              {/* Карточка 1: Без предоплаты */}
              <div className="guarantee-card">
                <div className="guarantee-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <h4 className="guarantee-title">{guarantees.g1_title}</h4>
                <p className="guarantee-desc">{guarantees.g1_desc}</p>
              </div>

              {/* Карточка 2: Фиксированная смета */}
              <div className="guarantee-card">
                <div className="guarantee-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" />
                    <line x1="8" y1="10" x2="16" y2="10" />
                    <line x1="8" y1="14" x2="16" y2="14" />
                    <line x1="8" y1="18" x2="16" y2="18" />
                  </svg>
                </div>
                <h4 className="guarantee-title">{guarantees.g2_title}</h4>
                <p className="guarantee-desc">{guarantees.g2_desc}</p>
              </div>

              {/* Карточка 3: Помощь с материалами */}
              <div className="guarantee-card">
                <div className="guarantee-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <h4 className="guarantee-title">{guarantees.g3_title}</h4>
                <p className="guarantee-desc">{guarantees.g3_desc}</p>
              </div>

              {/* Карточка 4: Договор и гарантия */}
              <div className="guarantee-card">
                <div className="guarantee-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h4 className="guarantee-title">{guarantees.g4_title}</h4>
                <p className="guarantee-desc">{guarantees.g4_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
