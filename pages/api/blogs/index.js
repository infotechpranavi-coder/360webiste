import connectDB from '../../../lib/mongodb';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { publishedOnly } = req.query;
      const query = publishedOnly === 'true' ? { status: 'published' } : {};
      const blogs = await Blog.find(query).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: blogs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const blog = await Blog.create(req.body);
      res.status(201).json({ success: true, data: blog });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, error: 'Slug must be unique' });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
