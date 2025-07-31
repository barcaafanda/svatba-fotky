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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Chyba při načítání fotek:', error.message);
      } else {
        setPhotos(data || []);
      }
    };

    fetchPhotos();
  }, []);

  const images = photos.filter((p) => p.type === 'image').map((p) => p.url);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 Svatba Fotky & Videa</h1>

      <UploadForm />

      <div className="flex flex-wrap justify-center mt-8">
        {photos.map((photo, index) => (
          <div key={photo.id} className="m-2">
            {photo.type === 'image' ? (
              <img
                src={photo.url}
                alt=""
                className="w-12 h-12 object-cover rounded shadow cursor-pointer"
                onClick={() => {
                  setLightboxIndex(images.indexOf(photo.url));
                  setLightboxOpen(true);
                }}
              />
            ) : (
              <video
                src={photo.url}
                controls
                className="w-12 h-12 object-cover rounded shadow"
              />
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          mainSrc={images[lightboxIndex]}
          nextSrc={images[(lightboxIndex + 1) % images.length]}
          prevSrc={images[(lightboxIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % images.length)
          }
        />
      )}
    </main>
  );
}
