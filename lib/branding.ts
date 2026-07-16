export const SITE_NAME = 'Explore 360';
export const SITE_TAGLINE = 'The Experience Company';
export const LOGO_SRC = '/explore360-logo.png';
export const SITE_DESCRIPTION =
  'Sailing Adventures, Motorcycle Expeditions & Curated Experiences Across India & Beyond.';

export const HERO_SUBHEADING =
  'From sailing adventures and motorcycle expeditions to handpicked outdoor experiences, we curate journeys that create stories, inspire exploration and become memories for a lifetime.';

export const BRAND_POSITIONING =
  'Explore360 is The Experience Company, curating premium adventure expeditions and extraordinary experiences across India and beyond. From sailing adventures and motorcycle expeditions to handpicked outdoor escapes, every journey is thoughtfully crafted to inspire, challenge and create stories that stay with you long after the adventure ends.';

export const DEFAULT_ABOUT_TEXT = BRAND_POSITIONING;

export const DEFAULT_SERVICES_TEXT =
  'Customized travel planning, Guided tours & local experiences, Group & family vacations, Luxury & adventure travel';

export const CONTACT_EMAIL = 'info@explore360.co.in';
export const CONTACT_PHONE = '+91 877919 2482';
export const CONTACT_PHONE_TEL = 'tel:+918779192482';
export const CONTACT_EMAIL_MAILTO = 'mailto:info@explore360.co.in';
export const CONTACT_WHATSAPP = 'https://wa.me/918779192482';
export const CONTACT_ADDRESS = 'Navi Mumbai, Maharashtra 400706';
export const CONTACT_ADDRESS_LINE = 'Head Office — Navi Mumbai, Maharashtra 400706';
export const CONTACT_MAP_SEARCH =
  'https://www.google.com/maps/place/Navi+Mumbai,+Maharashtra+400706/@19.0263615,72.9798539,13z/data=!3m1!4b1!4m6!3m5!1s0x3be7c3c389405e23:0x6b5611d97b65f7c4!8m2!3d19.0344647!4d73.0110096!16s%2Fm%2F0j1x4hm';
export const CONTACT_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48233.8!2d73.0110096!3d19.0344647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3c389405e23%3A0x6b5611d97b65f7c4!2sNavi%20Mumbai%2C%20Maharashtra%20400706!5e0!3m2!1sen!2sin!4v1721123456789!5m2!1sen!2sin';

export const CONTACT_FAQS = [
  {
    question: 'How do I book an experience with Explore360?',
    answer:
      "You can submit an enquiry through our website, WhatsApp or contact our team directly. We'll share the available dates, package details, inclusions and next steps to help you choose the experience that's right for you.",
  },
  {
    question: "What's typically included in an Explore360 experience?",
    answer:
      'Each experience is different. Package inclusions vary depending on the destination and activity and may include accommodation, planned activities, local transfers or other services. The specific inclusions and exclusions are clearly mentioned for every experience before booking.',
  },
  {
    question: "Can I join if I'm travelling solo or with a group?",
    answer:
      'Yes. Many of our experiences are suitable for solo travellers, friends, families or groups. Depending on the experience, you may have the option of joining a shared group or booking a private experience, subject to availability.',
  },
  {
    question: 'How do you select your experience partners?',
    answer:
      'We collaborate with experienced operators and service providers to curate quality adventure and travel experiences. The choice of partners may vary based on the destination, activity, season and availability.',
  },
] as const;

/** Replace legacy SkyGo branding in stored package copy when rendering. */
export function brandedText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/Premium Sky\s*Go Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Premium Skygo Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Sky\s*Go/gi, SITE_NAME)
    .replace(/Skygo/gi, SITE_NAME);
}
