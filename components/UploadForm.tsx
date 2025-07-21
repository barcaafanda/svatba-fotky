'use client';
import { useState, useRef } from 'react';

export default function UploadForm({ onUpload }: { onUpload: () => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('file', file);
    });

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        onUpload();
      } else {
        alert('Nahrávání selhalo.');
      }
    } catch (e) {
      console.error(e);
      alert('Chyba při nahrávání.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={handleClick}
      className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition mb-6"
    >
      <p className="text-gray-600 mb-2">📷 Přetáhni sem fotky nebo klepni pro výběr</p>

      {/* 📥 Důležitý vstup pro výběr souborů */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {uploading && <p className="text-sm text-blue-600 mt-2">Nahrávání...</p>}
    </div>
  );
}
