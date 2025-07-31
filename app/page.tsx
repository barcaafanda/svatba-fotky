'use client';

import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';

type Photo = {
  id: number;
  url: string;
  public_id: string;
  type: 'image' | 'video';
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await fetch('/api/photos');
      const data = await res.json();
      setPhotos(data);
    };

    fetchPhotos();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-6">📸 Naše svatební galerie</h1>
      <UploadForm />
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="w-full">
            {photo.type === 'image' ? (
              <img
                src={photo.url}
                alt="Uploaded"
                className="w-full h-auto object-cover rounded shadow"
              />
            ) : (
              <video
                src={photo.url}
                controls
                className="w-full h-auto object-cover rounded shadow"
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
