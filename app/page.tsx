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
      const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
      if (!error && data) setPhotos(data);
    };
    fetchPhotos();
  }, []);

  const images = photos.filter(p => p.type === 'image').map(p => p.url);

  return (
    <main>
      <h1>Fotky a videa ze svatby</h1>
      <UploadForm />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        {photos.map((photo, idx) => (
          <div key={photo.id} style={{ width: '150px', cursor: photo.type === 'image' ? 'pointer' : 'default' }}>
            {photo.type === 'image' ? (
              <img
                src={photo.url}
                alt=""
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                onClick={() => setLightboxIndex(images.indexOf(photo.url))}
              />
            ) : (
              <video 
                src={photo.url}
                alt=""
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                onClick={() => setLightboxIndex(images.indexOf(photo.url))}
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
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % images.length)}
        />
      )}
    </main>
  );
}