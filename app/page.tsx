'use client';
import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import { supabase } from '@/lib/supabase';
import 'yet-another-react-lightbox/styles.css';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';

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
  const [index, setIndex] = useState(0);

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
  photo.type === 'image'
    ? {
        type: 'image' as const,
        src: photo.url,
      }
    : {
        type: 'video' as const,
        poster: `https://res.cloudinary.com/dskwsp31z/video/upload/so_1/${photo.public_id}.jpg`,
        sources: [
          {
            src: photo.url,
            type: 'video/mp4',
          },
        ],
      }
);

  return (
    <main
      className="min-h-screen bg-fixed bg-cover bg-center p-4"
      style={{ backgroundImage: 'url(\"/background.jpg\")' }}
    >
      <h1 className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
        Fotky a videa ze svatby
      </h1>

      <UploadForm />

      <div className="flex flex-wrap gap-4 justify-start mt-6">
        {photos.map((photo, i) => (
          <div key={photo.id} className="w-[150px]">
            {photo.type === 'image' ? (
              <img
                src={photo.url}
                alt=""
                className="w-full h-auto rounded-lg cursor-pointer"
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              />
            ) : (
              <video
                src={photo.url}
                controls
                preload="metadata"
                poster={`https://res.cloudinary.com/dskwsp31z/video/upload/so_1/${photo.public_id}.jpg`}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
        ))}
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={index}
          plugins={[Video]}
        />
      )}
    </main>
  );
}