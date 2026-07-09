export interface UpcomingTourNavPackage {
  _id: string;
  title: string;
  place?: string;
  packageType?: string;
}

export const UPCOMING_TOUR_SUB_FILTERS: Record<string, (pkg: UpcomingTourNavPackage) => boolean> = {
  'upcoming-tours': () => true,
  'upcoming-ladakh': (pkg) =>
    pkg.place === 'leh-ladakh' || /umling/i.test(pkg.title),
  'upcoming-cross-country': (pkg) =>
    pkg.place === 'delhi-manali-leh-srinagar' || /manali|leh|srinagar/i.test(pkg.title),
  'upcoming-spiti': (pkg) =>
    pkg.place === 'spiti-valley' || /spiti/i.test(pkg.title),
  'upcoming-international': (pkg) =>
    pkg.packageType === 'international' ||
    ['vietnam', 'bhutan'].includes(pkg.place ?? '') ||
    /vietnam|bhutan/i.test(pkg.title),
  'upcoming-desert': (pkg) =>
    pkg.place === 'rann-of-kutch' || /kutch|rann/i.test(pkg.title),
};

export function filterUpcomingTourPackages(
  packages: UpcomingTourNavPackage[],
  subSlug: string
): UpcomingTourNavPackage[] {
  const matcher = UPCOMING_TOUR_SUB_FILTERS[subSlug] ?? UPCOMING_TOUR_SUB_FILTERS['upcoming-tours'];
  return packages.filter(matcher);
}
