'use client';

import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import { supabase } from '@/lib/supabase';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import 'yet-another-react-lightbox/styles.css';

type Photo = {
  id: number;
  url: string;
  public_id: string;
  type: string;
  created_at: string;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const slides = photos.map((photo) =>
    photo.type === 'video'
      ? {
          type: 'video',
          width: 1280,
          height: 720,
          poster: photo.url + '#t=1',
          sources: [{ src: photo.url, type: 'video/mp4' }],
        }
      : {
          type: 'image',
          src: photo.url,
        }
  );

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center p-4"
      style={{ backgroundImage: 'url("/background.jpg")' }}
    >
      <h1 className="text-white text-3xl font-semibold text-center mb-6">
        Fotky a videa ze svatby
      </h1>

      <UploadForm />

      <div className="flex flex-wrap gap-4 justify-center mt-6">
        {photos.map((photo, idx) => (
          <div key={photo.id} className="w-[150px]">
            {photo.type === 'image' ? (
              <img
                src={photo.url}
                alt=""
                className="w-full rounded cursor-pointer"
                onClick={() => {
                  setLightboxIndex(idx);
                  setOpen(true);
                }}
              />
            ) : (
              <video
                src={photo.url}
                poster={photo.url + '#t=1'}
                className="w-full rounded cursor-pointer"
                onClick={() => {
                  setLightboxIndex(idx);
                  setOpen(true);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={lightboxIndex}
          slides={slides}
          plugins={[Video]}
        />
      )}
    </main>
  );
}