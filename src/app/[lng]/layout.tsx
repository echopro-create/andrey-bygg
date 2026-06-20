import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { getDictionary, Locale } from '../i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollRevealInit from '@/components/ScrollRevealInit';
import '../globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-title',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export async function generateStaticParams() {
  return [{ lng: 'sv' }, { lng: 'en' }, { lng: 'no' }, { lng: 'ru' }];
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const resolvedParams = await params;
  const lng = resolvedParams.lng as Locale;
  const dict = await getDictionary(lng);

  return (
    <html lang={lng} className={`${cormorant.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* Ранняя инициализация темы во избежание мерцания панели Safari/Chrome */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('oleg-theme') || 'obsidian';
                document.documentElement.classList.add('theme-' + theme);
                var color = theme === 'obsidian' ? '#080908' : '#060907';
                
                var meta = document.createElement('meta');
                meta.name = 'theme-color';
                meta.content = color;
                document.head.appendChild(meta);
              })();
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="Premium Massage Salon in Stockholm by Oleg. Professional massage therapies: Swedish, sports, hot stone, cupping, lymphatic drainage." />
        <title>Oleg Massage Stockholm | Premium Spa & Massage</title>
      </head>
      <body>
        <Header dict={dict} />
        
        {/* Инициализация скролл-анимаций */}
        <ScrollRevealInit />
        
        <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
          {children}
        </main>
        
        <Footer dict={dict} lng={lng} />
      </body>
    </html>
  );
}
