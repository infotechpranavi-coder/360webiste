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

  // Custom display names for experience types and pages (keyed by slug)
  groupLabelOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },
  categoryLabelOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },

  // User-added experience types and pages
  customGroups: { type: mongoose.Schema.Types.Mixed, default: [] },
  customSubcategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  customMiniCategories: { type: mongoose.Schema.Types.Mixed, default: [] },
  miniCategoryLabelOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },
  hiddenBuiltinMiniCategories: { type: [String], default: [] },
  hiddenBuiltinSubcategories: { type: [String], default: [] },

  // Offer popup (site-wide)
  offerPopupEnabled: { type: Boolean, default: false },
  offerPopupTitle: { type: String, default: '' },
  offerPopupSubtitle: { type: String, default: '' },
  offerPopupImageUrl: { type: String, default: '' },
  offerPopupImagePublicId: { type: String, default: '' },
  offerPopupInitialDelaySeconds: { type: Number, default: 3, min: 0 },
  offerPopupRepeatIntervalSeconds: { type: Number, default: 320, min: 10 },

  // Explore With Us homepage section content
  exploreEyebrow: { type: String, default: 'TIME TO TRAVEL' },
  exploreHeadingLine1: { type: String, default: 'EXPLORE' },
  exploreHeadingLine2: { type: String, default: 'WITH US' },
  exploreSubtitle: { type: String, default: 'Everything Handled. You Just Show Up.' },
  exploreInclusions: {
    type: [String],
    default: [
      '24x7 Concierge Support',
      'Visa Assistance',
      'Packing & Equipment Rental',
      'Comprehensive Travel Insurance Assistance',
      'Airport Pick Up',
      'Centralized Hotel Locations',
      'Vetted Local Partners',
    ],
  },
  exploreCtaLabel: { type: String, default: 'Book Now' },
  explorePhone: { type: String, default: '+237 6 83 57 76 76' },
  explorePhoneLabel: { type: String, default: 'CALL NOW' },
}, { timestamps: true });

if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model('Settings', SettingsSchema);
