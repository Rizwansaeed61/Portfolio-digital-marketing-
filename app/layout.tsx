import type {Metadata} from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Rizwan Saeed — Premium Portfolio & Marketing Dashboard',
  description: 'Digital Marketing Manager & Shopify Developer. Certified Google Ads & Meta Business Partner, managing over AED 350K+ ad spend and generating AED 1.2M+ revenue.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  try {
                    var originalFetch = window.fetch;
                    var currentFetch = originalFetch;
                    Object.defineProperty(window, 'fetch', {
                      get: function() { return currentFetch; },
                      set: function(newFetch) { currentFetch = newFetch; },
                      configurable: true,
                      enumerable: true
                    });
                  } catch (e) {
                    // Suppress if already defined or restricted
                  }
                }
              })();
            `
          }}
        />
      </head>
      <body className="bg-[#070a13] text-gray-100 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
