import UploadForm from '@components/upload/UploadForm';
import ImageAdjuster from '@components/upload/ImageAdjuster';

export default function UploadPage() {
  return (
    <div className="upload-page">
      <h1>Upload Clothing Items</h1>
      <UploadForm />
      <ImageAdjuster imageSrc="/path-to-image.jpg" /> {/* Replace with dynamic image source */}
    </div>
  );
}
