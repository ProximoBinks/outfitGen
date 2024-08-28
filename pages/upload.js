import React, { useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [clothingType, setClothingType] = useState('tops');
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const cropperRef = React.useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      setCroppedImage(croppedCanvas.toDataURL());
    }
  };

  const handleUpload = async () => {
    if (!croppedImage) {
      alert('Please crop the image before uploading.');
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: croppedImage,
          clothingType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedImageUrl(data.url);
        alert('Image uploaded successfully!');
      } else {
        console.error('Upload failed:', data.error);
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      alert('Error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Upload and Crop Clothing Image</h1>

      <select
        className="mb-4 p-2 border border-gray-300 rounded"
        value={clothingType}
        onChange={(e) => setClothingType(e.target.value)}
      >
        <option value="tops">Tops</option>
        <option value="bottoms">Bottoms</option>
        <option value="socks">Socks</option>
        <option value="shoes">Shoes</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />

      {image && (
        <div className="mb-4 w-full max-w-md">
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={NaN} // Free-form cropping (no aspect ratio)
            guides={false}
            ref={cropperRef}
          />
          <button
            onClick={cropImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Crop Image
          </button>
        </div>
      )}

      {croppedImage && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Cropped Image Preview</h2>
          <img
            src={croppedImage}
            alt="Cropped Preview"
            className="max-w-xs rounded shadow-lg"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        className={`bg-green-500 text-white px-4 py-2 rounded-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {uploadedImageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Uploaded Image:</h2>
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="max-w-xs rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
