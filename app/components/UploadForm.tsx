'use client';

import { useEffect, useRef } from 'react';

export default function UploadForm({ onUpload }: { onUpload: () => void }) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).cloudinary) {
      widgetRef.current = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: 'dskwsp31z',
          uploadPreset: 'ml_default',
          folder: 'svatba',
          multiple: true,
          resourceType: 'auto',
          sources: ['local', 'camera'],
          maxFileSize: 150000000, // 150 MB
        },
        (error: any, result: any) => {
          if (!error && result.event === 'success') {
            console.log('Upload success:', result.info);
            onUpload(); // Refresh gallery
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
        📤 Nahrát fotku/video z mobilu
      </button>
    </div>
  );
}
