import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { filename, customizations } = req.body;

    const filePath = path.join(process.cwd(), 'public', filename);

    // Ensure the directory exists
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Save the customizations as a JSON file in the appropriate directory
    fs.writeFile(filePath, JSON.stringify(customizations, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save customizations' });
      } else {
        res.status(200).json({ message: 'Customizations saved successfully' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
