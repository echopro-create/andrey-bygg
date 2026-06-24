'use client';

import { useState, Suspense, useCallback, useRef } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { submitBooking } from '../../actions';
import { CustomSelect, CustomDatePicker } from './CustomFormComponents';
import { serviceSlugs } from '@/lib/config';

interface ContactsFormProps {
  dict: Record<string, unknown>;
}

function ContactsForm({ dict }: ContactsFormProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const lng = typeof params?.lng === 'string' ? params.lng : 'sv';
  const csrfTokenRef = useRef<string | null>(null);

  const validationMessages: Record<string, Record<string, string>> = {
    sv: {
      nameRequired: 'Namn måste anges.',
      phoneRequired: 'Telefonnummer måste anges.',
      phoneInvalid: 'Ange ett giltigt telefonnummer.',
      serviceRequired: 'Välj en tjänst.',
      dateRequired: 'Välj ett datum.',
      timeRequired: 'Välj en tid.',
    },
    en: {
      nameRequired: 'Name is required.',
      phoneRequired: 'Phone number is required.',
      phoneInvalid: 'Please enter a valid phone number.',
      serviceRequired: 'Please select a service.',
      dateRequired: 'Please select a date.',
      timeRequired: 'Please select a time.',
    },
    ru: {
      nameRequired: 'Имя обязательно.',
      phoneRequired: 'Телефон обязателен.',
      phoneInvalid: 'Введите корректный номер телефона.',
      serviceRequired: 'Выберите услугу.',
      dateRequired: 'Выберите дату.',
      timeRequired: 'Выберите время.',
    },
    uk: {
      nameRequired: "Ім'я обов'язкове.",
      phoneRequired: "Телефон обов'язковий.",
      phoneInvalid: 'Введіть коректний номер телефону.',
      serviceRequired: 'Виберіть послугу.',
      dateRequired: 'Виберіть дату.',
      timeRequired: 'Виберіть час.',
    },
  };

  const formLabels: Record<string, Record<string, string>> = {
    sv: {
      formName: 'Namn',
      formPhone: 'Telefon',
      formService: 'Tjänst',
      formDate: 'Datum',
      formTime: 'Tid',
      formMessage: 'Meddelande',
      servicePlaceholder: 'Välj tjänst...',
      datePlaceholder: 'Välj datum...',
      timePlaceholder: 'Välj tid...',
      otherQuestions: 'Övriga frågor',
    },
    en: {
      formName: 'Name',
      formPhone: 'Phone',
      formService: 'Service',
      formDate: 'Date',
      formTime: 'Time',
      formMessage: 'Message',
      servicePlaceholder: 'Select service...',
      datePlaceholder: 'Select date...',
      timePlaceholder: 'Select time...',
      otherQuestions: 'Other questions',
    },
    ru: {
      formName: 'Имя',
      formPhone: 'Телефон',
      formService: 'Услуга',
      formDate: 'Дата',
      formTime: 'Время',
      formMessage: 'Сообщение',
      servicePlaceholder: 'Выберите услугу...',
      datePlaceholder: 'Выберите дату...',
      timePlaceholder: 'Выберите время...',
      otherQuestions: 'Другие вопросы',
    },
    uk: {
      formName: "Ім'я",
      formPhone: 'Телефон',
      formService: 'Послуга',
      formDate: 'Дата',
      formTime: 'Час',
      formMessage: 'Повідомлення',
      servicePlaceholder: 'Виберіть послугу...',
      datePlaceholder: 'Виберіть дату...',
      timePlaceholder: 'Виберіть час...',
      otherQuestions: 'Інші питання',
    },
  };

  const t = validationMessages[lng] || validationMessages.en;
  const labels = formLabels[lng] || formLabels.en;
  const contacts = (dict.contacts || {}) as Record<string, unknown>;
  const servicesDict = (dict.services as Record<string, unknown>) || {};
  const servicesItems = (servicesDict.items as Record<string, Record<string, unknown>>) || {};

  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
    return { value: timeString, label: timeString };
  });

  const servicesList = serviceSlugs.map((slug) => ({
    value: slug,
    label: (servicesItems[slug]?.title as string) || '',
  }));

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
      newErrors.name = t.nameRequired;
    }

    const digits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = t.phoneRequired;
    } else if (digits.length < 6 || digits.length > 15 || /^(.)\1+$/.test(digits)) {
      newErrors.phone = t.phoneInvalid;
    }

    if (!formData.service) {
      newErrors.service = t.serviceRequired;
    }
    if (!formData.date) {
      newErrors.date = t.dateRequired;
    }
    if (!formData.time) {
      newErrors.time = t.timeRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

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

  const addressText = 'Halland & Skåne, Sweden';
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialPhone = (contacts.social_phone as string) || '';
  const phone = (contacts.phone as string) || '';

  return (
    <div className="contacts-grid">
      <div className="contacts-form-wrapper glass-card reveal">
        <h3 className="form-box-title">{contacts.formTitle as string}</h3>

        {submitResult && submitResult.success && (
          <div className="alert alert-success">
            <div>
              <p>{contacts.successMsg as string}</p>
              {submitResult.demo && (
                <span className="demo-badge">Demo Mode Active (Logged to terminal)</span>
              )}
            </div>
          </div>
        )}

        {submitResult && !submitResult.success && (
          <div className="alert alert-error">
            <p>{(contacts.errorMsg as string) || 'Submission failed.'} ({submitResult.error})</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              {labels.formName} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-control ${errors.name ? 'input-error' : ''}`}
              disabled={isSubmitting}
              placeholder={(contacts.namePlaceholder as string) || 'Your name'}
              autoComplete="name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              {labels.formPhone} *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`form-control ${errors.phone ? 'input-error' : ''}`}
              disabled={isSubmitting}
              placeholder={(contacts.phonePlaceholder as string) || '+46 70 123 45 67'}
              autoComplete="tel"
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="service">
              {labels.formService} *
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
              placeholder={labels.servicePlaceholder}
              error={!!errors.service}
              disabled={isSubmitting}
            />
            {errors.service && <div className="error-message">{errors.service}</div>}
          </div>

          <div className="form-row-2col">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="date">
                {labels.formDate} *
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
                placeholder={labels.datePlaceholder}
              />
              {errors.date && <div className="error-message" style={{ marginTop: '4px' }}>{errors.date}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="time">
                {labels.formTime} *
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
                placeholder={labels.timePlaceholder}
                error={!!errors.time}
                disabled={isSubmitting}
              />
              {errors.time && <div className="error-message" style={{ marginTop: '4px' }}>{errors.time}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="message">
              {labels.formMessage}
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
              placeholder={(contacts.messagePlaceholder as string) || 'Your requests...'}
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
              (contacts.submitBtn as string) || 'Submit'
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/#services" className="back-link" style={{ marginBottom: 0 }}>
            All services →
          </Link>
        </div>
      </div>

      <div className="contacts-info-column reveal">
        <div className="glass-card contacts-info-card">
          <h3 className="info-box-title">ANDREY BYGG</h3>

          <div className="info-items">
            <div className="info-item-row">
              <div className="info-item-label-row">
                <span className="info-item-label">Address</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="copy-btn"
                  title="Copy address"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <span className="info-item-val">{addressText}</span>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">{(contacts.phone_label as string) || 'Phone'}</span>
              <a href={`tel:${phone}`} className="info-item-val link-gold">
                {phone}
              </a>
            </div>

            {socialPhone && (
              <div className="info-item-row">
                <span className="info-item-label">{(contacts.social_phone_label as string) || 'Messengers'}</span>
                <div className="info-item-val messengers-container">
                  <a
                    href={`https://wa.me/${socialPhone.replace(/\D/g, '')}`}
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
                    href={`https://t.me/+${socialPhone.replace(/\D/g, '')}`}
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
                    href={`viber://chat?number=%2B${socialPhone.replace(/\D/g, '')}`}
                    className="messenger-link"
                    title="Viber"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.7 17.5c-.7-.4-1.8-1-2.4-.7-.6.3-.9 1.1-1.3 1.4-.3.2-.6.1-.9-.1-1.2-.7-2.2-1.7-2.9-2.9-.2-.3-.3-.6-.1-.9.3-.4 1.1-.7 1.4-1.3.3-.6-.3-1.7-.7-2.4-.4-.7-.8-1.5-1.5-1.5-.6 0-1.2.6-1.5 1.1-.8 1.3-.9 3 .1 4.7 1.5 2.6 3.6 4.7 6.2 6.2 1.7 1 3.4.9 4.7.1.5-.3 1.1-.9 1.1-1.5 0-.7-.8-1.1-1.5-1.5zm-3.5-9.6c2.7.3 4.9 2.5 5.2 5.2.1.4.4.7.8.7s.7-.3.7-.8c-.4-3.4-3.1-6.1-6.5-6.5-.4-.1-.8.2-.8.6.1.4.3.8.6.8zm-1.8 1.8c1.5.3 2.7 1.5 3 3 .1.4.4.6.8.6s.7-.3.7-.8c-.4-2.2-2.1-3.9-4.3-4.3-.4-.1-.8.2-.8.6 0 .5.3.8.6.9zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
                    </svg>
                  </a>
                  <span className="messengers-number">{socialPhone}</span>
                </div>
              </div>
            )}

            <div className="info-item-row">
              <span className="info-item-label">{(contacts.email_label as string) || 'Email'}</span>
              <a href={`mailto:${contacts.email}`} className="info-item-val link-gold">
                {contacts.email as string}
              </a>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">Hours</span>
              <span className="info-item-val">{contacts.hours as string}</span>
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
                <h6>Halland & Skåne</h6>
                <p>Sweden</p>
              </div>
              {socialPhone && (
                <a
                  href={`https://wa.me/${socialPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary map-directions-btn"
                >
                  WhatsApp →
                </a>
              )}
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
      <ContactsForm dict={dict} />
    </Suspense>
  );
}
