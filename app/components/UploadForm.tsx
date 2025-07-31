'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const fileInput = (e.currentTarget.elements.namedItem('file') as HTMLInputElement);
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Nevybrán žádný soubor.');
      return;
    }

    if (file.size > 300 * 1024 * 1024) {
      setError('Soubor přesahuje limit 300 MB.');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/dskwsp31z/${file.type.startsWith('video') ? 'video' : 'image'}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error('Chyba při nahrávání na Cloudinary.');
      }

      // Záznam do Supabase
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: data.secure_url,
          public_id: data.public_id,
          type: file.type.startsWith('video') ? 'video' : 'image',
        }),
      });

      if (!response.ok) {
        throw new Error('Chyba při ukládání do databáze.');
      }

      setSuccess(true);
      fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'Nastala chyba.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col items-center gap-4">
      <input
        type="file"
        name="file"
        accept="image/*,video/*"
        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0 file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        type="submit"
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
      >
        {uploading ? 'Nahrávám...' : 'Nahrát'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">✅ Úspěšně nahráno</p>}
    </form>
  );
}