'use client';

import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';

type Photo = {
  id: number;
  url: string;
  public_id: string;
  type: string;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch('/api/photos', { cache: 'no-store' });
      const data = await res.json();
      setPhotos(data);
    };

    fetchPhotos();
  }, []);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📸 Svatba – Nahrávání fotek a videí</h1>
      <UploadForm />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {photos.map((photo) => (
          <div key={photo.id} className="w-full aspect-square overflow-hidden rounded shadow">
            {photo.type.startsWith('video') ? (
              <video
                src={photo.url}
                controls
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={photo.url}
                alt=""
                className="object-cover w-full h-full"
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
