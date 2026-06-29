import PackageExperiencePage from '@/components/PackageExperiencePage';
import { getCategoryBySlug } from '@/lib/packageExperienceCategories';

export default function UpcomingRidesPage() {
  const category = getCategoryBySlug('upcoming-rides');
  if (!category) return null;
  return <PackageExperiencePage category={category} />;
}
