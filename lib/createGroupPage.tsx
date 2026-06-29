import PackageGroupPage from '@/components/PackageGroupPage';
import { PACKAGE_NAV_GROUPS } from '@/lib/packageExperienceCategories';
import { notFound } from 'next/navigation';

export function createGroupPage(groupSlug: string) {
  return function GroupPage() {
    const group = PACKAGE_NAV_GROUPS.find((g) => g.slug === groupSlug);
    if (!group) notFound();
    return <PackageGroupPage group={group} />;
  };
}
