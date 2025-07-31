'use client';

import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import { supabase } from '@/lib/supabase';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

type Photo = {
  id: number;
  url: string;
  public_id: string;
  type: string;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setPhotos(data);
      }
    };

    fetchPhotos();
  }, []);

  const imageUrls = photos.filter(p => p.type.startsWith('image')).map(p => p.url);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📸 Svatba - Galerie</h1>

      <UploadForm />

     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
  {photos.map((photo, index) => (
    <div key={photo.id} className="w-full max-w-[300px] mx-auto">
      {photo.type.startsWith('image') ? (
        <img
          src={photo.url}
          alt="uploaded"
          className="cursor-pointer w-full h-auto rounded hover:opacity-80"
          onClick={() => setLightboxIndex(index)}
        />
      ) : (
        <video
          controls
          className="w-full h-auto rounded"
          style={{ maxWidth: '100%', display: 'block' }}
        >
          <source src={photo.url} type={photo.type || 'video/mp4'} />
          Váš prohlížeč nepodporuje video tag.
        </video>
      )}
    </div>
  ))}
</div>

      {lightboxIndex !== null && (
        <Lightbox
          mainSrc={imageUrls[lightboxIndex]}
          nextSrc={imageUrls[(lightboxIndex + 1) % imageUrls.length]}
          prevSrc={imageUrls[(lightboxIndex + imageUrls.length - 1) % imageUrls.length]}
          onCloseRequest={() => setLightboxIndex(null)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + imageUrls.length - 1) % imageUrls.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % imageUrls.length)
          }
        />
      )}
    </main>
  );
}