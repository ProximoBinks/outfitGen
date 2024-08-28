import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image, clothingType } = req.body;

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: clothingType,
      });

      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
