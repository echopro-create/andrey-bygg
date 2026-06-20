'use client';

import { useState, Suspense, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { submitBooking } from '../../actions';

interface ContactsClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

function ContactsForm({ dict }: ContactsClientProps) {
  const searchParams = useSearchParams();
  const csrfTokenRef = useRef<string | null>(null);

  // Build services list and compute default service from URL param (during render, no effect needed)
  const servicesList = [
    { value: 'classic', label: dict.services.items.classic.title },
    { value: 'anti-cellulite', label: dict.services.items['anti-cellulite'].title },
    { value: 'sports', label: dict.services.items.sports.title },
    { value: 'lymphatic-drainage', label: dict.services.items['lymphatic-drainage'].title },
    { value: 'cupping', label: dict.services.items.cupping.title },
    { value: 'hot-stone', label: dict.services.items['hot-stone'].title },
    { value: 'turkish-foam', label: dict.services.items['turkish-foam'].title },
    { value: 'natural-massage', label: dict.services.items['natural-massage'].title },
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
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className={`form-control ${errors.service ? 'input-error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">{dict.contacts.selectPlaceholder}</option>
              {servicesList.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
            {errors.service && <div className="error-message">{errors.service}</div>}
          </div>

          <div className="form-row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="date">
                {dict.contacts.formDate} *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`form-control ${errors.date ? 'input-error' : ''}`}
                disabled={isSubmitting}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && <div className="error-message" style={{ marginTop: '4px' }}>{errors.date}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="time">
                {dict.contacts.formTime} *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`form-control ${errors.time ? 'input-error' : ''}`}
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
          <h3 className="info-box-title">Oleg Massage Stockholm</h3>

          <div className="info-items">
            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.addressLabel || 'Address'}</span>
              <div className="info-item-value-block">
                <span className="info-item-val">{dict.contacts.address}</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="copy-btn"
                  title={dict.contacts.copyAddress || 'Copy address'}
                >
                  {copied ? (dict.contacts.copied || 'Copied!') : (dict.contacts.copy || 'Copy')}
                </button>
              </div>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{dict.contacts.phoneLabel || 'Phone'}</span>
              <a href={`tel:${dict.contacts.phone}`} className="info-item-val link-gold">
                {dict.contacts.phone}
              </a>
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
            <div className="map-grid-pattern">
              <div className="pulse-circle"></div>
              <div className="pulse-glow"></div>
            </div>
            <div className="map-card-footer">
              <div className="map-footer-text">
                <h6>Birger Jarlsgatan 42</h6>
                <p>Östermalm, Stockholm</p>
              </div>
              <a
                href="https://maps.google.com/?q=Birger+Jarlsgatan+42,+Stockholm"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary map-directions-btn"
              >
                {dict.contacts.directions || 'Directions →'}
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
