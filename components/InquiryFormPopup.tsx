'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Phone, Mail, MapPin, Plane, Send } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import FormFeedbackModal from '@/components/FormFeedbackModal';
import FormTermsConsent from '@/components/FormTermsConsent';
import { ProductInfo } from '../contexts/InquiryFormContext';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  CONTACT_EMAIL_MAILTO,
  CONTACT_ADDRESS_LINE,
} from '@/lib/branding';

interface InquiryFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productInfo?: ProductInfo;
}

const fieldClass =
  'w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border border-gray-200 bg-[#faf8f3] text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#bd9245] focus:ring-2 focus:ring-[#bd9245]/20 focus:bg-white';

const labelClass =
  'mb-1.5 block text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-gray-500';

const InquiryFormPopup = ({ isOpen, onClose, productInfo }: InquiryFormPopupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelDate: '',
    travelers: '',
    budget: '',
    message: '',
  });

  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        if (data.success) {
          setAvailablePackages(data.data);
        }
      } catch (error) {
        console.error('Error fetching packages for inquiry form:', error);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (productInfo && productInfo.type !== 'General') {
      setFormData((prev) => ({
        ...prev,
        destination: 'other',
        message: `I am interested in the ${productInfo.type}: ${productInfo.title}. Please provide me with more details.`,
      }));
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        travelers: '',
        budget: '',
        message: '',
      });
    }
    setAcceptedTerms(false);
  }, [isOpen, productInfo]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;

    setIsSubmitting(true);

    try {
      const message =
        formData.message.trim() ||
        (productInfo && productInfo.type !== 'General'
          ? `I am interested in the ${productInfo.type}: ${productInfo.title}. Please provide me with more details.`
          : '') ||
        [
          formData.destination && `Destination: ${formData.destination}`,
          formData.travelDate && `Travel date: ${formData.travelDate}`,
          formData.travelers && `Travelers: ${formData.travelers}`,
          formData.budget && `Budget: ${formData.budget}`,
        ]
          .filter(Boolean)
          .join('\n') ||
        'General inquiry';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        packageType:
          productInfo?.category ||
          (productInfo && productInfo.type !== 'General' ? productInfo.type : ''),
        packageName: productInfo?.title || '',
        packageDuration: productInfo?.duration || '',
        subject:
          productInfo && productInfo.type !== 'General'
            ? `Inquiry for ${productInfo.type}: ${productInfo.title}`
            : 'General Inquiry',
        destination: formData.destination,
        travelDate: formData.travelDate,
        travelers: formData.travelers,
        budget: formData.budget,
        message,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setFeedback({
        type: 'success',
        title: 'Thank You!',
        message: 'Thank you for your inquiry! Our experts will get in touch with you shortly.',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        travelers: '',
        budget: '',
        message: '',
      });
      setAcceptedTerms(false);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      setFeedback({
        type: 'error',
        title: 'Submission Failed',
        message: 'There was an error sending your inquiry. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackClose = () => {
    const wasSuccess = feedback?.type === 'success';
    setFeedback(null);
    if (wasSuccess) onClose();
  };

  if (!isOpen && !feedback) return null;

  const isProductInquiry = Boolean(productInfo && productInfo.type !== 'General');
  const headerTitle = isProductInquiry ? `Book ${productInfo!.title}` : 'Plan Your Dream Trip';
  const headerSubtitle = isProductInquiry
    ? `Send an inquiry for this ${productInfo!.type.toLowerCase()}`
    : 'Get personalized travel recommendations from our experts';

  return (
    <>
      <FormFeedbackModal
        open={Boolean(feedback)}
        type={feedback?.type || 'success'}
        title={feedback?.title || ''}
        message={feedback?.message || ''}
        onClose={handleFeedbackClose}
      />

      {isOpen && !feedback ? (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-[2px] p-0 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="bg-white w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
            {/* Header */}
            <div className="relative shrink-0 bg-[#111827] px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#bd9245] via-[#d4b06a] to-[#bd9245]" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close form"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#bd9245]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#bd9245]">
                  <Plane className="h-3 w-3" />
                  Travel Inquiry
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight tracking-tight line-clamp-2">
                  {headerTitle}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-white/65 font-medium">
                  {headerSubtitle}
                </p>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6 bg-[#fafafa]">
              <form id="inquiry-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Full Name <span className="text-[#bd9245]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={fieldClass}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Email <span className="text-[#bd9245]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={fieldClass}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Phone Number <span className="text-[#bd9245]">*</span>
                    </label>
                    <div className="inquiry-phone-input">
                      <PhoneInput
                        country={'in'}
                        value={formData.phone}
                        onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                        inputProps={{
                          name: 'phone',
                          required: true,
                        }}
                        containerClass="!w-full"
                        inputClass="!w-full !h-11 sm:!h-12 !px-4 !pl-[52px] !border !border-gray-200 !rounded-xl !bg-[#faf8f3] !text-sm !text-gray-900 focus:!border-[#bd9245] focus:!ring-2 focus:!ring-[#bd9245]/20 focus:!bg-white"
                        buttonClass="!bg-[#faf8f3] !border !border-gray-200 !border-r-0 !rounded-l-xl hover:!bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Destination <span className="text-[#bd9245]">*</span>
                    </label>
                    <input
                      list="package-destinations"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      className={fieldClass}
                      placeholder="Enter or select destination"
                    />
                    <datalist id="package-destinations">
                      {availablePackages.map((pkg) => (
                        <option key={pkg._id} value={pkg.title}>
                          {pkg.location}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Travel Date <span className="text-[#bd9245]">*</span>
                    </label>
                    <input
                      type="date"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleInputChange}
                      required
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Travelers <span className="text-[#bd9245]">*</span>
                    </label>
                    <select
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      required
                      className={`${fieldClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%236b7280%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M19 9l-7 7-7-7%27/%3E%3C/svg%3E')] bg-[length:1.1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                    >
                      <option value="">Select travelers</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5+">5+ People</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Budget Range (INR)</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={fieldClass}
                    placeholder="e.g. ₹25,000 - ₹50,000"
                  />
                </div>

                <div>
                  <label className={labelClass}>Additional Requirements</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full min-h-[88px] px-3.5 sm:px-4 py-3 rounded-xl border border-gray-200 bg-[#faf8f3] text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all resize-y focus:border-[#bd9245] focus:ring-2 focus:ring-[#bd9245]/20 focus:bg-white"
                    placeholder="Tell us about preferences, special requirements, or questions..."
                  />
                </div>

                <FormTermsConsent
                  id="inquiry-terms-consent"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                />
              </form>

              {/* Compact contact strip */}
              <div className="mt-5 sm:mt-6 rounded-2xl border border-gray-100 bg-white p-3.5 sm:p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 mb-3 text-center sm:text-left">
                  Need immediate assistance?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <a
                    href={CONTACT_PHONE_TEL}
                    className="flex items-center gap-2.5 rounded-xl bg-[#faf8f3] px-3 py-2.5 hover:bg-[#bd9245]/10 transition-colors"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#bd9245]/15 text-[#bd9245]">
                      <Phone className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Call
                      </span>
                      <span className="block text-xs font-semibold text-gray-800 truncate">
                        {CONTACT_PHONE}
                      </span>
                    </span>
                  </a>
                  <a
                    href={CONTACT_EMAIL_MAILTO}
                    className="flex items-center gap-2.5 rounded-xl bg-[#faf8f3] px-3 py-2.5 hover:bg-[#bd9245]/10 transition-colors"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#bd9245]/15 text-[#bd9245]">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Email
                      </span>
                      <span className="block text-xs font-semibold text-gray-800 truncate">
                        {CONTACT_EMAIL}
                      </span>
                    </span>
                  </a>
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#faf8f3] px-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#bd9245]/15 text-[#bd9245]">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Visit
                      </span>
                      <span className="block text-xs font-semibold text-gray-800 truncate">
                        {CONTACT_ADDRESS_LINE}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer actions */}
            <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-3.5 sm:px-7 sm:py-4 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
              <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="sm:flex-1 h-11 sm:h-12 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="inquiry-form"
                  disabled={isSubmitting || !acceptedTerms}
                  className="sm:flex-[1.4] h-11 sm:h-12 rounded-xl bg-[#bd9245] hover:bg-[#a07835] text-gray-900 font-black text-sm uppercase tracking-wider disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900/30 border-t-gray-900" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Inquiry
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <style jsx global>{`
            .inquiry-phone-input .react-tel-input .selected-flag {
              background: transparent !important;
              padding-left: 12px !important;
              width: 46px !important;
              border-radius: 0.75rem 0 0 0.75rem !important;
            }
            .inquiry-phone-input .react-tel-input .flag-dropdown {
              background: transparent !important;
              border: none !important;
            }
            .inquiry-phone-input .react-tel-input .flag-dropdown.open,
            .inquiry-phone-input .react-tel-input .flag-dropdown:hover {
              background: transparent !important;
            }
            .inquiry-phone-input .react-tel-input .country-list {
              border-radius: 12px !important;
              box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
              border: 1px solid #f3f4f6 !important;
              margin-top: 4px !important;
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
};

export default InquiryFormPopup;
