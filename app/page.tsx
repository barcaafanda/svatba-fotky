'use client';
import { useEffect, useState } from 'react';
import UploadForm from '../components/UploadForm';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

interface Photo {
  id: number;
  url: string;
  public_id: string;
  type: string;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('photos').select('*').order('id', { ascending: false });
    if (error) console.error('Fetch error:', error.message);
    else setPhotos(data || []);
    setLoading(false);
  };

  const handleDelete = async (public_id: string) => {
    const confirmed = confirm('Opravdu chceš smazat tento soubor?');
    if (!confirmed) return;

    const res = await fetch(`/api/upload?public_id=${public_id}`, { method: 'DELETE' });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.public_id !== public_id));
    } else {
      alert('Smazání selhalo.');
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📸 Naše svatební galerie</h1>
      <UploadForm onUpload={fetchPhotos} />
      {loading ? (
        <p className="text-center text-gray-500">Načítám fotky a videa...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo) => (
            photo.url && (
              <div key={photo.id} className="relative group border rounded-xl overflow-hidden shadow-sm">
                {photo.type === 'video' ? (
                  <video
                    src={photo.url}
                    controls
                    className="w-full h-auto max-h-96 object-cover bg-black rounded"
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={photo.url}
                    alt="Nahraná fotka"
                    width={500}
                    height={500}
                    className="w-full h-auto object-cover rounded"
                  />
                )}

                <button
                  onClick={() => handleDelete(photo.public_id)}
                  className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-red-500 hover:text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Smazat
                </button>
              </div>
            )
          ))}
        </div>
      )}
    </main>
  );
}
