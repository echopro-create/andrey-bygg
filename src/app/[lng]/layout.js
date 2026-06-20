import { getDictionary } from '@/dictionaries';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../globals.css';

export async function generateStaticParams() {
  return [{ lng: 'sv' }, { lng: 'en' }, { lng: 'no' }, { lng: 'ru' }];
}

export default async function RootLayout({ children, params }) {
  const { lng } = await params;
  const dict = await getDictionary(lng);

  return (
    <html lang={lng} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fdfdfc" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#080908" media="(prefers-color-scheme: dark)" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var activeTheme = savedTheme || systemTheme;
                  document.documentElement.setAttribute('data-theme', activeTheme);
                  
                  var meta = document.createElement('meta');
                  meta.name = 'theme-color';
                  meta.content = activeTheme === 'dark' ? '#080908' : '#fdfdfc';
                  document.getElementsByTagName('head')[0].appendChild(meta);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body>
        <Header lng={lng} dict={dict} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer lng={lng} dict={dict} />
      </body>
    </html>
  );
}
