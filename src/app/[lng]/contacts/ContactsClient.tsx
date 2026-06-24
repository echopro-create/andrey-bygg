'use client';

import { Suspense, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface ContactsInfoProps {
  dict: Record<string, unknown>;
}

function ContactsInfo({ dict }: ContactsInfoProps) {
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

  const copyLabels: Record<string, Record<string, string>> = {
    sv: { copy: 'Kopiera', copied: 'Kopierad!' },
    en: { copy: 'Copy', copied: 'Copied!' },
    ru: { copy: 'Копировать', copied: 'Скопировано!' },
    uk: { copy: 'Копіювати', copied: 'Скопійовано!' },
  };
  const cl = copyLabels[lng] || copyLabels.en;

  const writeLabels: Record<string, string> = {
    sv: 'Skriv till oss',
    en: 'Write to us',
    ru: 'Написать нам',
    uk: 'Написати нам',
  };

  const callLabels: Record<string, string> = {
    sv: 'Ring oss',
    en: 'Call us',
    ru: 'Позвонить',
    uk: 'Зателефонувати',
  };

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
                    title={cl.copy}
                  >
                    {copied === 'email' ? cl.copied : cl.copy}
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
                        className="hover-gold"
                      >
                        {socialPhone}
                      </a>
                    </span>
                  )}
                </div>
              </div>

              <div className="info-item-row">
                <span className="info-item-label">Hours</span>
                <span className="info-item-val">{hours}</span>
              </div>

              {regionsDesc && (
                <div className="info-item-row">
                  <span className="info-item-label">{(contacts.regions_title as string) || 'Region'}</span>
                  <span className="info-item-val" style={{ fontSize: '0.9rem' }}>{regionsDesc}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
              <a href={`mailto:${email}`} className="btn btn-primary">
                {writeLabels[lng] || 'Write to us'}
              </a>
              <a href={`tel:${phone}`} className="btn btn-secondary">
                {callLabels[lng] || 'Call us'}
              </a>
            </div>
          </div>

          <div className="contacts-info-column reveal">
            <div className="minimal-map-card" style={{ height: '100%', minHeight: '300px', position: 'relative' }}>
              <Image
                src="/images/contacts-bg.webp"
                alt="Andrey Bygg"
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

export default function ContactsClient({ dict }: { dict: Record<string, unknown> }) {
  return (
    <Suspense fallback={<div className="container text-center"><span className="spinner"></span></div>}>
      <ContactsInfo dict={dict} />
    </Suspense>
  );
}
