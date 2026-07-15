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

/** Replace legacy SkyGo branding in stored package copy when rendering. */
export function brandedText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/Premium Sky\s*Go Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Premium Skygo Tours/gi, `Premium ${SITE_NAME}`)
    .replace(/Sky\s*Go/gi, SITE_NAME)
    .replace(/Skygo/gi, SITE_NAME);
}
