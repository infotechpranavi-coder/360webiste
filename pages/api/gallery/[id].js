import connectDB from '../../../lib/mongodb';
import Gallery from '../../../models/Gallery';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const item = await Gallery.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ success: false, error: 'Gallery item not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const item = await Gallery.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!item) return res.status(404).json({ success: false, error: 'Gallery item not found' });
      res.status(200).json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
