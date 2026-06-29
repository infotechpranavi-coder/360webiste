import connectDB from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      let blog = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        blog = await Blog.findById(id);
      }
      if (!blog) {
        blog = await Blog.findOne({ slug: String(id).toLowerCase() });
      }
      if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
      if (blog.status !== 'published') {
        return res.status(404).json({ success: false, error: 'Blog not found' });
      }
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
      res.status(200).json({ success: true, data: blog });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, error: 'Slug must be unique' });
      }
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const blog = await Blog.findByIdAndDelete(id);
      if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
