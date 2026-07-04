import PackageGroupPage from '@/components/PackageGroupPage';
import { getNavGroupsFromDb } from '@/lib/getCategoryCatalogServer';
import { notFound } from 'next/navigation';

export default async function DynamicGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const navGroups = await getNavGroupsFromDb();
  const group = navGroups.find((item) => item.slug === slug);

  if (!group) notFound();

  return <PackageGroupPage group={group} />;
}
