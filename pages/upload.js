import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [clothingType, setClothingType] = useState('tops');
  const cropperRef = useRef(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedImage = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
      return croppedImage;
    }
  };

  const onSave = async () => {
    const croppedImage = onCrop();
    if (croppedImage) {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ image: croppedImage, clothingType }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert('Image uploaded successfully');
      } else {
        alert('Failed to upload image');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Upload and Crop Image</h1>
      <input type="file" accept="image/*" onChange={onFileChange} />
      <div>
        <select value={clothingType} onChange={(e) => setClothingType(e.target.value)}>
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="socks">Socks</option>
          <option value="shoes">Shoes</option>
        </select>
      </div>
      {image && (
        <div style={{ width: '500px', height: '500px', margin: '20px auto' }}>
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            // Cropper.js options
            initialAspectRatio={1}
            guides={false}
            ref={cropperRef}
            viewMode={1}
          />
        </div>
      )}
      <button onClick={onSave}>Save Cropped Image</button>
    </div>
  );
}
