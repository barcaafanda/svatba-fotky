import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Svatba',
  description: 'Galerie svatebních fotek',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          defer
        ></script>
      </head>
      <body className="bg-white text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
