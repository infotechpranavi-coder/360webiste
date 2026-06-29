import PackageExperiencePage from '@/components/PackageExperiencePage';
import { getCategoryBySlug } from '@/lib/packageExperienceCategories';
import { notFound } from 'next/navigation';

export function createCategoryPage(slug: string) {
  return function CategoryPage() {
    const category = getCategoryBySlug(slug);
    if (!category) notFound();
    return <PackageExperiencePage category={category} />;
  };
}
