'use client';

import { useEffect, useRef, useState } from 'react';

export default function UploadForm({ onUpload }: { onUpload: () => void }) {
  const widgetRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const interval = setInterval(() => {
        const cloudinary = (window as any).cloudinary;
        if (cloudinary && !widgetRef.current) {
          widgetRef.current = cloudinary.createUploadWidget(
            {
              cloudName: 'dskwsp31z',
              uploadPreset: 'ml_default',
              multiple: true,
              folder: 'svatba',
              resourceType: 'auto',
            },
            (error: any, result: any) => {
              if (!error && result?.event === 'success') {
                onUpload();
              }
            }
          );
          setReady(true);
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [onUpload]);

  return (
    <div className="text-center my-6">
      {ready ? (
        <button
          onClick={() => widgetRef.current?.open()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📤 Nahrát fotky nebo video
        </button>
      ) : (
        <p className="text-gray-500">Načítám nástroj pro nahrávání…</p>
      )}
    </div>
  );
}

