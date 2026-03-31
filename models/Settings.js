import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  popularSection: { type: Boolean, default: true },
  upcomingSection: { type: Boolean, default: true },
  destinationsSection: { type: Boolean, default: true },
  exploreSection: { type: Boolean, default: true },
  testimonialsSection: { type: Boolean, default: true },
  
  // Social Media Settings
  facebookUrl: { type: String, default: "" },
  facebookEnabled: { type: Boolean, default: true },
  instagramUrl: { type: String, default: "" },
  instagramEnabled: { type: Boolean, default: true },
  twitterUrl: { type: String, default: "" },
  twitterEnabled: { type: Boolean, default: true },
  linkedinUrl: { type: String, default: "" },
  linkedinEnabled: { type: Boolean, default: true },
  youtubeUrl: { type: String, default: "" },
  youtubeEnabled: { type: Boolean, default: true },
  whatsappUrl: { type: String, default: "" },
  whatsappEnabled: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
