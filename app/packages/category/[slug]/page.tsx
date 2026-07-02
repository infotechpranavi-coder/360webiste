import PackageExperiencePage from '@/components/PackageExperiencePage';
import { getNavGroupsFromDb } from '@/lib/getCategoryCatalogServer';
import { notFound } from 'next/navigation';

export default async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const navGroups = await getNavGroupsFromDb();
  const category = navGroups.flatMap((group) => group.items).find((item) => item.slug === slug);

  if (!category) notFound();

  return <PackageExperiencePage category={category} />;
}
