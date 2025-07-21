'use client';

import { useEffect } from 'react';

export default function UploadForm({ onUpload }: { onUpload: () => void }) {
  // Funkce pro zobrazení Cloudinary widgetu
  const showWidget = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: 'dskwsp31z', // ← dskwsp31z
        uploadPreset: 'svatba-preset', // ← ml_default
        sources: ['local', 'camera'],
        multiple: true,
        maxFiles: 20,
        resourceType: 'auto',
        folder: 'svatba',
        clientAllowedFormats: ['jpg', png', 'jpeg', 'mp4', 'mov', 'webm'],
        maxFileSize: 300000000, // 300 MB
        showCompletedButton: true,
        styles: {
          palette: {
            window: '#ffffff',
            sourceBg: '#f4f4f4',
            windowBorder: '#90a0b3',
            tabIcon: '#0078ff',
            inactiveTabIcon: '#69778a',
            menuIcons: '#555a5f',
            link: '#0078ff',
            action: '#339933',
            inProgress: '#0078ff',
            complete: '#339933',
            error: '#cc0000',
            textDark: '#000000',
            textLight: '#ffffff'
          },
        },
      },
      async (error: any, result: any) => {
        if (!error && result.event === 'success') {
          console.log('✅ Nahráno:', result.info);
          onUpload(); // obnovit seznam po úspěšném nahrání
        }
      }
    );

    widget.open();
  };

  return (
    <div className="text-center mb-6">
      <button
        onClick={showWidget}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        📤 Nahrát fotky nebo video
      </button>
    </div>
  );
}
