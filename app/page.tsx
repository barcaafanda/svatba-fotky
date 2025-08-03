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
  created_at: string;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setPhotos(data);
    };
    fetchPhotos();
  }, []);

  const images = photos.filter((p) => p.type === 'image').map((p) => p.url);

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center p-4"
      style={{ backgroundImage: 'url("/background.jpg")' }}
    >
      <h1 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">Fotky a videa ze svatby</h1>
      <UploadForm />
      <div className="flex flex-wrap gap-4 justify-start mt-6">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="w-[150px]">
            {photo.type === 'image' ? (
              <img
                src={photo.url}
                alt=""
                className="w-full h-auto rounded-lg cursor-pointer"
                onClick={() => setLightboxIndex(images.indexOf(photo.url))}
              />
            ) : (
              <video
                src={photo.url}
                controls
                preload="metadata"
                poster={`https://res.cloudinary.com/dskwsp31z/video/upload/so_1/${photo.public_id}.jpg`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          mainSrc={images[lightboxIndex]}
          nextSrc={images[(lightboxIndex + 1) % images.length]}
          prevSrc={images[(lightboxIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setLightboxIndex(null)}
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