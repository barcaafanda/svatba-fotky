"use client";
import { useEffect, useState } from "react";
import UploadForm from "./components/UploadForm";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { supabase } from "@/lib/supabase";

type Photo = {
  id: number;
  url: string;
  type: string;
};

export default function Page() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase.from("photos").select("*");
      if (!error && data) {
        setPhotos(data);
      }
    };
    fetchPhotos();
  }, []);

  const handleImageClick = (url: string) => {
    setCurrentImage(url);
    setLightboxOpen(true);
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">📸 Galerie</h1>
      <UploadForm />
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt="Nahraná fotka"
            className="w-32 h-32 object-cover rounded cursor-pointer shadow"
            onClick={() => handleImageClick(photo.url)}
          />
        ))}
      </div>
      {lightboxOpen && (
        <Lightbox
          mainSrc={currentImage}
          onCloseRequest={() => setLightboxOpen(false)}
        />
      )}
    </main>
  );
}
