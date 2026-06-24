'use client';

import { useState, Suspense, useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { submitBooking } from '../../actions';
import { CustomSelect, CustomDatePicker } from './CustomFormComponents';

interface ContactsClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

function ContactsForm({ dict }: ContactsClientProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const lng = typeof params?.lng === 'string' ? params.lng : 'sv';
  const csrfTokenRef = useRef<string | null>(null);

  // Generate 30-minute time slots from 09:00 to 21:00
  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
    return { value: timeString, label: timeString };
  });

  // Build services list and compute default service from URL param (during render, no effect needed)
  const servicesList = [
    { value: 'windows-doors', label: dict.services.items['windows-doors']?.title || '' },
    { value: 'kitchen-assembly', label: dict.services.items['kitchen-assembly']?.title || '' },
    { value: 'bathroom-renovation', label: dict.services.items['bathroom-renovation']?.title || '' },
    { value: 'tiling', label: dict.services.items.tiling?.title || '' },
    { value: 'painting', label: dict.services.items.painting?.title || '' },
    { value: 'roofing-woodwork', label: dict.services.items['roofing-woodwork']?.title || '' },
  ];

  const initialService = (() => {
    const param = searchParams.get('service');
    return param && servicesList.some((s) => s.value === param) ? param : '';
  })();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: initialService,
    message: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    service?: string;
    date?: string;
    time?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    error?: string;
    demo?: boolean;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = dict.contacts.validation.nameRequired;
    }
    
    // Улучшенная валидация телефона: очистка от не-цифр, проверка длины и отсеивание одинаковых цифр
    const digits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = dict.contacts.validation.phoneRequired;
    } else if (digits.length < 6 || digits.length > 15 || /^(.)\1+$/.test(digits)) {
      newErrors.phone = dict.contacts.validation.phoneInvalid;
    }

    if (!formData.service) {
      newErrors.service = dict.contacts.validation.serviceRequired;
    }
    if (!formData.date) {
      newErrors.date = dict.contacts.validation.dateRequired;
    }
    if (!formData.time) {
      newErrors.time = dict.contacts.validation.timeRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, dict]);

  const sanitizeInput = (value: string): string => {
    return value.replace(/[<>]/g, '').trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const selectedServiceObj = servicesList.find((s) => s.value === formData.service);
      const serviceName = selectedServiceObj ? selectedServiceObj.label : formData.service;

      if (!csrfTokenRef.current) {
        csrfTokenRef.current = Math.random().toString(36).substring(2) + Date.now().toString(36);
      }

      const result = await submitBooking({
        name: sanitizeInput(formData.name),
        phone: sanitizeInput(formData.phone),
        service: serviceName,
        message: sanitizeInput(formData.message),
        date: sanitizeInput(formData.date),
        time: sanitizeInput(formData.time),
        _csrf: csrfTokenRef.current,
      });

      if (result.success) {
        setSubmitResult({ success: true, demo: result.demo });
        setFormData({
          name: '',
          phone: '',
          service: '',
          message: '',
          date: '',
          time: '',
        });
        csrfTokenRef.current = null;
      } else {
        setSubmitResult({ success: false, error: result.error });
      }
    } catch (err: unknown) {
      setSubmitResult({
        success: false,
        error: err instanceof Error ? err.message : 'Network error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(dict.contacts.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="contacts-grid">
      <div className="contacts-form-wrapper glass-card reveal">
        <h3 className="form-box-title">{dict.contacts.formTitle}</h3>

        {submitResult && submitResult.success && (
          <div className="alert alert-success">
            <div>
              <p>{dict.contacts.formSuccess}</p>
              {submitResult.demo && (
                <span className="demo-badge">Demo Mode Active (Logged to terminal)</span>
              )}
            </div>
          </div>
        )}

        {submitResult && !submitResult.success && (
          <div className="alert alert-error">
            <p>{dict.contacts.formError} ({submitResult.error})</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {dict.contacts.formName} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-control ${errors.name ? 'input-error' : ''}`}
              disabled={isSubmitting}
              placeholder={dict.contacts.namePlaceholder || 'Your name'}
              autoComplete="name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              {dict.contacts.formPhone} *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-control ${errors.phone ? 'input-error' : ''}`}
              disabled={isSubmitting}
              placeholder="+46 70 123 45 67"
              autoComplete="tel"
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="service">
              {dict.contacts.formService} *
            </label>
            <CustomSelect
              id="service"
              value={formData.service}
              onChange={(val) => {
                setFormData((prev) => ({ ...prev, service: val }));
                if (errors.service) {
                  setErrors((prev) => ({ ...prev, service: undefined }));
                }
              }}
              options={servicesList}
              placeholder={dict.contacts.selectPlaceholder}
              error={!!errors.service}
              disabled={isSubmitting}
            />
            {errors.service && <div className="error-message">{errors.service}</div>}
          </div>

          <div className="form-row-2col">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="date">
                {dict.contacts.formDate} *
              </label>
              <CustomDatePicker
                id="date"
                value={formData.date}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, date: val }));
                  if (errors.date) {
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
                minDate={new Date().toISOString().split('T')[0]}
                error={!!errors.date}
                disabled={isSubmitting}
                lng={lng}
                placeholder={dict.contacts.formDate || 'Select date...'}
              />
              {errors.date && <div className="error-message" style={{ marginTop: '4px' }}>{errors.date}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="time">
                {dict.contacts.formTime} *
              </label>
              <CustomSelect
                id="time"
                value={formData.time}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, time: val }));
                  if (errors.time) {
                    setErrors((prev) => ({ ...prev, time: undefined }));
                  }
                }}
                options={timeSlots}
                placeholder={dict.contacts.formTime || 'Select time...'}
                error={!!errors.time}
                disabled={isSubmitting}
              />
              {errors.time && <div className="error-message" style={{ marginTop: '4px' }}>{errors.time}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="message">
              {dict.contacts.formMessage}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="form-control"
              style={{ resize: 'vertical' }}
              disabled={isSubmitting}
              placeholder={dict.contacts.messagePlaceholder || 'Your requests...'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              dict.contacts.formSubmit
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/#services" className="back-link" style={{ marginBottom: 0 }}>
            {dict.allServices || 'All services'} →
          </Link>
        </div>
      </div>

      <div className="contacts-info-column reveal">
        <div className="glass-card contacts-info-card">
          <h3 className="info-box-title">ANDREY BYGG</h3>

          <div className="info-items">
            <div className="info-item-row">
              <div className="info-item-label-row">
                <span className="info-item-label">{dict.contacts.addressLabel || 'Address'}</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="copy-btn"
                  title={dict.contacts.copyAddress || 'Copy address'}
                >
                  {copied ? (dict.contacts.copied || 'Copied!') : (dict.contacts.copy || 'Copy')}
                </button>
              </div>
              <span className="info-item-val">{dict.contacts.address}</span>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.phoneLabel || 'Phone'}</span>
              <a href={`tel:${dict.contacts.phone}`} className="info-item-val link-gold">
                {dict.contacts.phone}
              </a>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.messengersLabel || 'Messengers'}</span>
              <div className="info-item-val messengers-container">
                <a
                  href="https://wa.me/380935758495"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="messenger-link"
                  title="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.8.001-2.618-1.01-5.079-2.846-6.917C16.4 1.849 13.907 1.013 11.99 1.013c-5.41 0-9.813 4.4-9.816 9.804-.001 1.902.504 3.753 1.464 5.36l-.994 3.63 3.722-.975zm13.123-5.267c-.29-.145-1.716-.847-1.98-.943-.264-.096-.456-.145-.648.145-.19.29-.74.943-.907 1.135-.166.19-.333.215-.623.07-1.285-.64-2.13-1.06-2.975-2.51-.23-.396.23-.367.659-1.22.072-.145.036-.271-.018-.38-.054-.109-.456-1.1-.624-1.514-.165-.397-.33-.342-.456-.342-.117-.006-.252-.006-.388-.006-.136 0-.356.05-.542.253-.186.204-.71.693-.71 1.69 0 1.002.722 1.968.822 2.102.1.13 1.42 2.167 3.44 3.04.48.207.857.33 1.15.424.483.153.924.13 1.272.078.388-.058 1.716-.701 1.957-1.378.24-.678.24-1.258.17-1.378-.073-.12-.265-.192-.556-.337z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/+380935758495"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="messenger-link"
                  title="Telegram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0C5.344 0 0 5.344 0 12c0 6.656 5.344 12 11.944 12 6.6 0 12-5.344 12-12 0-6.656-5.4-12-12-12zm5.892 8.136l-1.92 9.072c-.144.648-.528.804-1.068.504l-2.928-2.16-1.416 1.368c-.156.156-.288.288-.6.288l.204-3.036 5.52-4.992c.24-.216-.048-.336-.372-.12l-6.816 4.296-2.94-.924c-.636-.204-.648-.636.132-.936l11.496-4.428c.528-.192.996.12.804.972z" />
                  </svg>
                </a>
                <a
                  href="viber://chat?number=%2B380935758495"
                  className="messenger-link"
                  title="Viber"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.7 17.5c-.7-.4-1.8-1-2.4-.7-.6.3-.9 1.1-1.3 1.4-.3.2-.6.1-.9-.1-1.2-.7-2.2-1.7-2.9-2.9-.2-.3-.3-.6-.1-.9.3-.4 1.1-.7 1.4-1.3.3-.6-.3-1.7-.7-2.4-.4-.7-.8-1.5-1.5-1.5-.6 0-1.2.6-1.5 1.1-.8 1.3-.9 3 .1 4.7 1.5 2.6 3.6 4.7 6.2 6.2 1.7 1 3.4.9 4.7.1.5-.3 1.1-.9 1.1-1.5 0-.7-.8-1.1-1.5-1.5zm-3.5-9.6c2.7.3 4.9 2.5 5.2 5.2.1.4.4.7.8.7s.7-.3.7-.8c-.4-3.4-3.1-6.1-6.5-6.5-.4-.1-.8.2-.8.6.1.4.3.8.6.8zm-1.8 1.8c1.5.3 2.7 1.5 3 3 .1.4.4.6.8.6s.7-.3.7-.8c-.4-2.2-2.1-3.9-4.3-4.3-.4-.1-.8.2-.8.6 0 .5.3.8.6.9zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                  </svg>
                </a>
                <span className="messengers-number">+380 93 575 84 95</span>
              </div>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.socialsLabel || 'Socials'}</span>
              <div className="info-item-val messengers-container">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="messenger-link"
                  title="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.emailLabel || 'Email'}</span>
              <a href={`mailto:${dict.contacts.email}`} className="info-item-val link-gold">
                {dict.contacts.email}
              </a>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.hoursLabel || 'Hours'}</span>
              <span className="info-item-val">{dict.contacts.hours}</span>
            </div>
          </div>

          <div className="minimal-map-card">
            <Image
              src="/images/contacts-bg.webp"
              alt="Andrey Bygg background"
              className="contacts-ambient-img"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              style={{ objectFit: 'cover' }}
            />
            <div className="map-card-footer" style={{ position: 'relative', zIndex: 2 }}>
              <div className="map-footer-text">
                <h6>{dict.contacts.street}</h6>
                <p>{dict.contacts.city}</p>
              </div>
              <a
                href="https://wa.me/380935758495"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary map-directions-btn"
              >
                {dict.contacts.directions || 'WhatsApp →'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactsClient({ dict }: ContactsClientProps) {
  return (
    <Suspense fallback={<div className="container text-center"><span className="spinner"></span></div>}>
      <ContactsForm dict={dict} />
    </Suspense>
  );
}
