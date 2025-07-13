'use client';

import { useEffect, useState } from 'react';
import UploadForm from '../components/UploadForm';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

type Photo = {
  id: string;
  url: string;
  public_id: string;
};

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const fetchPhotos = async () => {
    const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPhotos(data);
    }
  };

  const deletePhoto = async (public_id: string) => {
    const res = await fetch(`/api/upload?public_id=${public_id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchPhotos();
    } else {
      alert('Mazání selhalo');
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Svatba – galerie</h1>
      <UploadForm onUpload={fetchPhotos} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.url}
              alt="Foto"
              className="object-cover w-full h-40 rounded-lg cursor-pointer"
              onClick={() => setModalIndex(index)}
            />
            <button
              onClick={() => deletePhoto(photo.public_id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Smazat
            </button>
          </div>
        ))}
      </div>

      {modalIndex !== null && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setModalIndex(null)}
        >
          <div className="relative max-w-3xl w-full px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[modalIndex].url}
              alt="Zvětšená fotka"
              className="w-full max-h-[80vh] object-contain rounded shadow"
            />
            <button
              onClick={() => setModalIndex((prev) => (prev! - 1 + photos.length) % photos.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 px-4 text-white text-3xl font-bold"
            >
              ‹
            </button>
            <button
              onClick={() => setModalIndex((prev) => (prev! + 1) % photos.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 px-4 text-white text-3xl font-bold"
            >
              ›
            </button>
            <button
              onClick={() => setModalIndex(null)}
              className="absolute top-2 right-2 text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
