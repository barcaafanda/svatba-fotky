import './globals.css';

export const metadata = {
  title: 'Svatba',
  description: 'Galerie svatebních fotek',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head />
      <body className="bg-white text-gray-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
