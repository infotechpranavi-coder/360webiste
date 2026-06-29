import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  public_id: { type: String },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
});

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String, default: '' },
  image: { type: ImageSchema, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

GallerySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
