import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set desired size limit here (e.g., 10mb)
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { image, clothingType } = req.body;

    if (!image || !clothingType) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `${Date.now()}.png`;

      const filePath = path.join(process.cwd(), 'public', clothingType, filename);

      // Ensure the directory exists
      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      // Save the image file to the appropriate directory
      fs.writeFileSync(filePath, buffer);

      // Respond with success
      res.status(200).json({ message: 'Image uploaded successfully', path: `/${clothingType}/${filename}` });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ error: 'Failed to save image' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
