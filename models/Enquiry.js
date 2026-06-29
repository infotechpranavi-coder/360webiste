import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  packageType: { type: String, default: '' },
  packageName: { type: String, default: '' },
  packageDuration: { type: String, default: '' },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, default: '' },
  destination: { type: String, default: '' },
  travelDate: { type: String, default: '' },
  travelers: { type: String, default: '' },
  budget: { type: String, default: '' },
  status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models.Enquiry) {
  delete mongoose.models.Enquiry;
}

export default mongoose.model('Enquiry', EnquirySchema);
