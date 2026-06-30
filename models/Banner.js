import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  public_id: { type: String },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
});

const VideoSchema = new mongoose.Schema({
  public_id: { type: String },
  url: { type: String, required: true },
  alt: { type: String, default: '' },
});

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'youtube'],
    default: 'image',
  },
  image: ImageSchema,
  video: VideoSchema,
  youtubeUrl: { type: String, default: '' },
  link: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BannerSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

if (mongoose.models.Banner) {
  delete mongoose.models.Banner;
}

export default mongoose.model('Banner', BannerSchema);
