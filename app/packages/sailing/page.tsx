import PackageExperiencePage from '@/components/PackageExperiencePage';
import { getCategoryBySlug } from '@/lib/packageExperienceCategories';

export default function SailingExperiencesPage() {
  const category = getCategoryBySlug('sailing');
  if (!category) return null;
  return <PackageExperiencePage category={category} />;
}
