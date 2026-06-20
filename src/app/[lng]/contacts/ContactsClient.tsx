'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitBooking } from '../../actions';

interface ContactsClientProps {
  dict: any;
}

function ContactsForm({ dict }: ContactsClientProps) {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    service?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    error?: string;
    demo?: boolean;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Список услуг для выпадающего списка
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

  // Предзаполнение услуги из URL
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && servicesList.some(s => s.value === serviceParam)) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку поля при вводе
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) {
      newErrors.name = dict.contacts.validation.nameRequired;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = dict.contacts.validation.phoneRequired;
    } else {
      // Простая проверка телефонного номера (минимум 6 цифр)
      const phoneRegex = /^[+]?[0-9\s\-()]{6,20}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = dict.contacts.validation.phoneInvalid;
      }
    }
    if (!formData.service) {
      newErrors.service = dict.contacts.validation.serviceRequired;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitResult(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Ищем русское или локальное название услуги для отправки в Telegram
      const selectedServiceObj = servicesList.find(s => s.value === formData.service);
      const serviceName = selectedServiceObj ? selectedServiceObj.label : formData.service;

      const result = await submitBooking({
        ...formData,
        service: serviceName,
      });

      if (result.success) {
        setSubmitResult({ success: true, demo: result.demo });
        // Очищаем форму при успехе
        setFormData({
          name: '',
          phone: '',
          service: '',
          message: '',
        });
      } else {
        setSubmitResult({ success: false, error: result.error });
      }
    } catch (err: any) {
      setSubmitResult({ success: false, error: err.message || 'Network error' });
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
      {/* Левая колонка: Форма записи */}
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
      </div>

      {/* Правая колонка: Контакты и интерактивный блок */}
      <div className="contacts-info-column reveal">
        <div className="glass-card contacts-info-card">
          <h3 className="info-box-title">Oleg Massage Stockholm</h3>
          
          <div className="info-items">
            <div className="info-item-row">
              <span className="info-item-label">Address</span>
              <div className="info-item-value-block">
                <span className="info-item-val">{dict.contacts.address}</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="copy-btn"
                  title="Copy address to clipboard"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">Phone</span>
              <a href={`tel:${dict.contacts.phone}`} className="info-item-val link-gold">
                {dict.contacts.phone}
              </a>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">Email</span>
              <a href={`mailto:${dict.contacts.email}`} className="info-item-val link-gold">
                {dict.contacts.email}
              </a>
            </div>

            <div className="info-item-row">
              <span className="info-item-label">Hours</span>
              <span className="info-item-val">{dict.contacts.hours}</span>
            </div>
          </div>

          {/* Премиальная интерактивная геолокационная плашка без тяжелого iframe */}
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
                Directions →
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
