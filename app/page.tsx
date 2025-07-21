{photos.map((photo) => (
  <div key={photo.id} className="relative group border rounded-xl overflow-hidden shadow-sm">
    {photo.type === 'video' ? (
      <video
        src={photo.url}
        controls
        className="w-full h-auto bg-black max-h-96"
        preload="metadata"
      />
    ) : (
      <img
        src={photo.url}
        alt="Nahraná fotka"
        className="w-full h-auto object-cover"
      />
    )}
    <button
      onClick={() => handleDelete(photo.public_id)}
      className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-red-500 hover:text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
    >
      Smazat
    </button>
  </div>
))}
