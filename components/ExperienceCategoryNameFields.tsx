'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { formatCategoryOptionLabel } from '@/lib/resolveCategoryLabels';

interface ExperienceCategoryNameFieldsProps {
  packageGroupSlug: string;
  packageCategory: string;
  packageMiniCategory?: string;
  onGroupChange: (groupSlug: string) => void;
  onCategoryChange: (categoryValue: string) => void;
  onMiniCategoryChange?: (miniValue: string) => void;
  selectContentClassName?: string;
}

export default function ExperienceCategoryNameFields({
  packageGroupSlug,
  packageCategory,
  packageMiniCategory = '',
  onGroupChange,
  onCategoryChange,
  onMiniCategoryChange,
  selectContentClassName,
}: ExperienceCategoryNameFieldsProps) {
  const { navGroups } = useCategoryLabels();

  const selectedPackageGroup =
    navGroups.find((group) => group.slug === packageGroupSlug) ?? navGroups[0];

  const selectedSubcategory =
    selectedPackageGroup?.items.find((item) => item.value === packageCategory) ??
    selectedPackageGroup?.items[0];

  const miniItems = selectedSubcategory?.miniItems ?? [];

  const handlePackageGroupChange = (groupSlug: string) => {
    onGroupChange(groupSlug);
    const group = navGroups.find((item) => item.slug === groupSlug);
    if (group?.items[0]) {
      onCategoryChange(group.items[0].value);
      onMiniCategoryChange?.('');
    }
  };

  const handleSubcategoryChange = (categoryValue: string) => {
    onCategoryChange(categoryValue);
    onMiniCategoryChange?.('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Category *</label>
        <Select value={packageGroupSlug} onValueChange={handlePackageGroupChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            {navGroups.map((group) => (
              <SelectItem key={group.slug} value={group.slug}>
                {group.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subcategory *</label>
        <Select value={packageCategory} onValueChange={handleSubcategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent className={`max-h-72 ${selectContentClassName ?? ''}`}>
            {selectedPackageGroup?.items.map((category) => (
              <SelectItem key={category.slug} value={category.value}>
                {formatCategoryOptionLabel(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mini Category</label>
        <Select
          value={packageMiniCategory || '__none__'}
          onValueChange={(value) => onMiniCategoryChange?.(value === '__none__' ? '' : value)}
          disabled={!miniItems.length}
        >
          <SelectTrigger>
            <SelectValue placeholder={miniItems.length ? 'Select mini category' : 'No mini categories'} />
          </SelectTrigger>
          <SelectContent className={`max-h-72 ${selectContentClassName ?? ''}`}>
            <SelectItem value="__none__">None</SelectItem>
            {miniItems.map((mini) => (
              <SelectItem key={mini.slug} value={mini.value}>
                {mini.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">Optional. Manage in Dashboard → Categories.</p>
      </div>
    </div>
  );
}
