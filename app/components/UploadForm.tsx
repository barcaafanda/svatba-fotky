'use client';
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    const resourceType = type === 'video' ? 'video' : 'image';
    const cloudName = 'dskwsp31z';

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.secure_url, public_id: data.public_id, type }),
      });
      window.location.reload();
    }

    setUploading(false);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <input type="file" accept={type === 'image' ? 'image/*' : 'video/*'} onChange={e => setFile(e.target.files?.[0] || null)} />
      <select onChange={e => setType(e.target.value as 'image' | 'video')} value={type}>
        <option value="image">Obrázek</option>
        <option value="video">Video</option>
      </select>
      <button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Nahrávám...' : 'Nahrát'}
      </button>
    </div>
  );
}