import {
  CategoryCatalogSettings,
  CategoryLabelOverrides,
  buildNavGroupsFromCatalog,
  getResolvedCategoryBySlugFromCatalog,
  getResolvedCategoryByValueFromCatalog,
  getResolvedNavGroupLabelFromCatalog,
  formatCategoryOptionLabel,
} from './categoryCatalog';

export function getCategoryLabelOverridesFromSettings(
  settings?: {
    groupLabelOverrides?: Record<string, string>;
    categoryLabelOverrides?: Record<string, string>;
    customGroups?: CategoryCatalogSettings['customGroups'];
    customSubcategories?: CategoryCatalogSettings['customSubcategories'];
    customMiniCategories?: CategoryCatalogSettings['customMiniCategories'];
    miniCategoryLabelOverrides?: Record<string, string>;
    hiddenBuiltinMiniCategories?: string[];
    hiddenBuiltinSubcategories?: string[];
  } | null
): CategoryCatalogSettings {
  return {
    groupLabels: settings?.groupLabelOverrides ?? {},
    categoryLabels: settings?.categoryLabelOverrides ?? {},
    customGroups: settings?.customGroups ?? [],
    customSubcategories: settings?.customSubcategories ?? [],
    customMiniCategories: settings?.customMiniCategories ?? [],
    miniCategoryLabels: settings?.miniCategoryLabelOverrides ?? {},
    hiddenBuiltinMiniCategories: settings?.hiddenBuiltinMiniCategories ?? [],
    hiddenBuiltinSubcategories: settings?.hiddenBuiltinSubcategories ?? [],
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
export { formatCategoryOptionLabel, buildNavGroupsFromCatalog, type CategoryCatalogSettings, type CategoryLabelOverrides };
