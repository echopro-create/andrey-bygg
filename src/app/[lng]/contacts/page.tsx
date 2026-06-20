import { getDictionary, Locale } from '../../i18n';
import ContactsClient from './ContactsClient';

interface ContactsPageProps {
  params: Promise<{ lng: string }>;
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  return (
    <div className="contacts-page section-spacing">
      <div className="container">
        <div className="section-header text-center reveal" style={{ marginBottom: '60px' }}>
          <h1 className="section-title">
            {dict.contacts.title} <span className="gold-accent">{dict.contacts.accent}</span>
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Book your session online or reach out via phone. Our private studio is located in the heart of Stockholm.
          </p>
        </div>

        <ContactsClient dict={dict} />
      </div>
    </div>
  );
}
