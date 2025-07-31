"use client";
import { useState } from "react";

export default function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxSize = 100 * 1024 * 1024; // 100 MB
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        alert(`Soubor ${file.name} je příliš velký (limit je 100 MB).`);
      } else {
        validFiles.push(file);
      }
    }

    setSelectedFiles(validFiles);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Vyber fotky nebo videa:
      </label>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
}
