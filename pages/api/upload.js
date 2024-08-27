import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { image, metadata, type } = req.body;

      // Define paths
      const imagePath = path.join(process.cwd(), 'public', type, image.name);
      const metadataPath = path.join(process.cwd(), 'public', type, `${image.name}.json`);

      // Save the image
      fs.writeFileSync(imagePath, Buffer.from(image.data, 'base64'));

      // Save the metadata
      fs.writeFileSync(metadataPath, JSON.stringify(metadata));

      res.status(200).json({ message: 'Upload successful' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload image and metadata' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
