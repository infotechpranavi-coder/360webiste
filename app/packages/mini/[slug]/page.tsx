import PackageExperiencePage from '@/components/PackageExperiencePage';
import { getCategoryCatalogFromDb } from '@/lib/getCategoryCatalogServer';
import { getMiniCategoryBySlugFromCatalog, getResolvedCategoryBySlugFromCatalog } from '@/lib/categoryCatalog';
import { notFound } from 'next/navigation';

export default async function MiniCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await getCategoryCatalogFromDb();
  const mini = getMiniCategoryBySlugFromCatalog(slug, catalog);

  if (!mini) notFound();

  const parentCategory = getResolvedCategoryBySlugFromCatalog(mini.subcategorySlug, catalog);
  if (!parentCategory) notFound();

  const category = {
    ...parentCategory,
    label: mini.label,
    value: mini.value,
    heroTitle: mini.label,
    heroSubtitle: `Packages in ${mini.label} under ${parentCategory.label}`,
    href: mini.href,
  };

  return <PackageExperiencePage category={category} miniCategorySlug={slug} />;
}
