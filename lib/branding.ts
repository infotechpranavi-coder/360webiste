export const SITE_NAME = 'Explore 360';
export const SITE_TAGLINE = 'The Experience Company';
export const LOGO_SRC = '/explore360-logo.png';
export const SITE_DESCRIPTION =
  'Explore 360 specializes in comprehensive tours, travel, and ticketing services. We provide well-curated travel experiences and seamless flight bookings with professional, personalized solutions for journeys within the region and beyond.';

export const DEFAULT_ABOUT_TEXT = `${SITE_NAME} is a specialized travel management company dedicated to crafting exceptional journeys across dynamic destinations.`;

export const DEFAULT_SERVICES_TEXT =
  'Customized travel planning, Guided tours & local experiences, Group & family vacations, Luxury & adventure travel';

/** Replace legacy SkyGo branding in stored package copy when rendering. */
export function brandedText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/Premium Sky\s*Go Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Premium Skygo Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Sky\s*Go/gi, SITE_NAME)
    .replace(/Skygo/gi, SITE_NAME);
}
