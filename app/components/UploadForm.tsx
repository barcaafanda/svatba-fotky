'use client';

import { useEffect, useRef } from 'react';

export default function UploadForm({ onUpload }: { onUpload: () => void }) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      const cloudinary = (window as any).cloudinary;

      widgetRef.current = cloudinary.createUploadWidget(
        {
          cloudName: 'dskwsp31z', // 🔁 dskwsp31z
          uploadPreset: 'ml_default', // 🔁 ml_default
          folder: 'svatba',
          multiple: true,
          resourceType: 'auto',
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            console.log('Upload success:', result.info);
            onUpload(); // aktualizuje fotky po nahrání
          }
        }
      );
    }
  }, [onUpload]);

  return (
    <div className="text-center mb-6">
      <button
        onClick={() => widgetRef.current?.open()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📤 Nahrát pomocí Cloudinary
      </button>
    </div>
  );
}