// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Svatební Galerie',
  description: 'Nahrávej a prohlížej fotky a videa ze svatby',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        {/* Cloudinary Upload Widget */}
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
          async
        ></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
