export interface PackageExperienceCategory {
  value: string;
  label: string;
  slug: string;
  href: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  emptyMessage: string;
  accent: 'amber' | 'orange' | 'blue' | 'green';
  legacyValues?: string[];
}

export const PACKAGE_EXPERIENCE_CATEGORIES: PackageExperienceCategory[] = [
  {
    value: 'Upcoming Rides',
    label: 'Upcoming Rides',
    slug: 'upcoming-rides',
    href: '/packages/upcoming-rides',
    heroTitle: 'Upcoming Rides',
    heroSubtitle: 'Scheduled road trips, scenic drives, and curated ride experiences',
    heroImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    emptyMessage: 'No upcoming rides found',
    accent: 'amber',
  },
  {
    value: 'Bike & SUV 4x4 Expeditions',
    label: 'Bike & SUV 4x4 Expeditions',
    slug: 'bike-suv-expeditions',
    href: '/packages/bike-suv-expeditions',
    heroTitle: 'Bike & SUV 4x4 Expeditions',
    heroSubtitle: 'Off-road adventures, 4x4 trails, and motorcycle expedition tours',
    heroImage:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    emptyMessage: 'No bike or 4x4 expeditions found',
    accent: 'orange',
  },
  {
    value: 'Sailing Experiences',
    label: 'Sailing Experiences',
    slug: 'sailing',
    href: '/packages/sailing',
    heroTitle: 'Sailing Experiences',
    heroSubtitle: 'Yacht charters, coastal cruises, and open-water sailing journeys',
    heroImage:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    emptyMessage: 'No sailing experiences found',
    accent: 'blue',
  },
  {
    value: 'Adventure Activities',
    label: 'Adventure Activities',
    slug: 'adventure',
    href: '/packages/adventure',
    heroTitle: 'Adventure Activities',
    heroSubtitle: 'Thrilling outdoor experiences, extreme sports, and adrenaline activities',
    heroImage:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    emptyMessage: 'No adventure activities found',
    accent: 'green',
    legacyValues: ['Adventure', 'adventure'],
  },
];

export const PACKAGE_EXPERIENCE_CATEGORY_VALUES = PACKAGE_EXPERIENCE_CATEGORIES.map(
  (category) => category.value
);

export function getCategoryBySlug(slug: string) {
  return PACKAGE_EXPERIENCE_CATEGORIES.find((category) => category.slug === slug);
}

export function packageMatchesExperienceCategory(
  packageCategory: string | undefined,
  category: PackageExperienceCategory
) {
  if (!packageCategory) return false;
  const values = [category.value, ...(category.legacyValues || [])];
  return values.some((value) => value.toLowerCase() === packageCategory.toLowerCase());
}

export const accentStyles = {
  amber: {
    gradient: 'from-amber-900/70 via-amber-800/60 to-amber-900/70',
    badge: 'from-amber-500 to-amber-600',
    button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    outline: 'border-amber-500 text-amber-600 hover:bg-amber-50',
    ring: 'hover:border-amber-500/20',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    cta: 'from-amber-600 via-amber-500 to-amber-600',
    ctaHover: 'hover:text-amber-600',
  },
  orange: {
    gradient: 'from-orange-900/70 via-orange-800/60 to-orange-900/70',
    badge: 'from-orange-500 to-orange-600',
    button: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    outline: 'border-orange-500 text-orange-600 hover:bg-orange-50',
    ring: 'hover:border-orange-500/20',
    icon: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
    cta: 'from-orange-600 via-orange-500 to-orange-600',
    ctaHover: 'hover:text-orange-600',
  },
  blue: {
    gradient: 'from-blue-900/70 via-blue-800/60 to-blue-900/70',
    badge: 'from-blue-500 to-blue-600',
    button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    outline: 'border-blue-500 text-blue-600 hover:bg-blue-50',
    ring: 'hover:border-blue-500/20',
    icon: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    cta: 'from-blue-600 via-blue-500 to-blue-600',
    ctaHover: 'hover:text-blue-600',
  },
  green: {
    gradient: 'from-green-900/70 via-green-800/60 to-green-900/70',
    badge: 'from-green-500 to-green-600',
    button: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    outline: 'border-green-500 text-green-600 hover:bg-green-50',
    ring: 'hover:border-green-500/20',
    icon: 'text-green-400',
    iconBg: 'bg-green-500/20',
    cta: 'from-green-600 via-green-500 to-green-600',
    ctaHover: 'hover:text-green-600',
  },
} as const;
