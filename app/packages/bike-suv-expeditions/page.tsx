import PackageExperiencePage from '@/components/PackageExperiencePage';
import { getCategoryBySlug } from '@/lib/packageExperienceCategories';

export default function BikeSuvExpeditionsPage() {
  const category = getCategoryBySlug('bike-suv-expeditions');
  if (!category) return null;
  return <PackageExperiencePage category={category} />;
}
