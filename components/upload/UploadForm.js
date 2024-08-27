import { useState } from 'react';

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [clothingType, setClothingType] = useState('tops');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const imageData = reader.result.split(',')[1];

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: {
            name: selectedFile.name,
            data: imageData,
          },
          metadata: {
            scale: 1, // default scale
            x: 0,     // default position x
            y: 0,     // default position y
          },
          type: clothingType,
        }),
      });

      if (response.ok) {
        alert('Upload successful');
      } else {
        alert('Upload failed');
      }
    };
  };

  return (
    <div className="upload-form">
      <select value={clothingType} onChange={(e) => setClothingType(e.target.value)}>
        <option value="tops">Tops</option>
        <option value="bottoms">Bottoms</option>
        <option value="socks">Socks</option>
        <option value="shoes">Shoes</option>
      </select>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload
      </button>
    </div>
  );
}
