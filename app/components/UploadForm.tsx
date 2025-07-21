'use client';

import { useEffect, useRef } from 'react';

export default function UploadForm({ onUpload }: { onUpload: () => void }) {
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const cloudinary = (window as any).cloudinary;

    if (cloudinary && !widgetRef.current) {
      widgetRef.current = cloudinary.createUploadWidget(
        {
          cloudName: 'dskwsp31z', // Nahraď tvým cloud name
          uploadPreset: 'ml_default', // Pokud máš jiný preset, uprav
          multiple: true,
          folder: 'svatba',
          resourceType: 'auto',
        },
        (error: any, result: any) => {
          if (!error && result?.event === 'success') {
            console.log('Upload success:', result.info);
            onUpload(); // Aktualizuj seznam fotek
          }
        }
      );
    }
  }, [onUpload]);

  return (
    <div className="text-center my-6">
      <button
        onClick={() => widgetRef.current?.open()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📤 Nahrát fotky / video
      </button>
    </div>
  );
}
