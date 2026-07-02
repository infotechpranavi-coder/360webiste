import {
  CategoryCatalogSettings,
  buildNavGroupsFromCatalog,
  getResolvedCategoryBySlugFromCatalog,
  getResolvedCategoryByValueFromCatalog,
  getResolvedNavGroupLabelFromCatalog,
  formatCategoryOptionLabel,
} from './categoryCatalog';

export type CategoryLabelOverrides = Pick<
  CategoryCatalogSettings,
  'groupLabels' | 'categoryLabels'
>;

export function getCategoryLabelOverridesFromSettings(
  settings?: {
    groupLabelOverrides?: Record<string, string>;
    categoryLabelOverrides?: Record<string, string>;
    customGroups?: CategoryCatalogSettings['customGroups'];
    customSubcategories?: CategoryCatalogSettings['customSubcategories'];
  } | null
): CategoryCatalogSettings {
  return {
    groupLabels: settings?.groupLabelOverrides ?? {},
    categoryLabels: settings?.categoryLabelOverrides ?? {},
    customGroups: settings?.customGroups ?? [],
    customSubcategories: settings?.customSubcategories ?? [],
    customMiniCategories: settings?.customMiniCategories ?? [],
  };
}

export function applyCategoryLabelOverrides(
  overrides?: CategoryLabelOverrides | null
) {
  return buildNavGroupsFromCatalog({
    groupLabels: overrides?.groupLabels ?? {},
    categoryLabels: overrides?.categoryLabels ?? {},
    customGroups: [],
    customSubcategories: [],
  });
}

export const getResolvedCategoryBySlug = getResolvedCategoryBySlugFromCatalog;
export const getResolvedCategoryByValue = getResolvedCategoryByValueFromCatalog;
export const getResolvedNavGroupLabel = getResolvedNavGroupLabelFromCatalog;
export { formatCategoryOptionLabel, buildNavGroupsFromCatalog, type CategoryCatalogSettings };
