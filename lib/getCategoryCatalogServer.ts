import dbConnect from './mongodb';
import Settings from '../models/Settings';
import {
  buildNavGroupsFromCatalog,
  getCategoryCatalogFromSettings,
  type CategoryCatalogSettings,
} from './categoryCatalog';

export async function getCategoryCatalogFromDb(): Promise<CategoryCatalogSettings> {
  await dbConnect();
  const settings = await Settings.findOne().lean();
  return getCategoryCatalogFromSettings(settings);
}

export async function getNavGroupsFromDb() {
  const catalog = await getCategoryCatalogFromDb();
  return buildNavGroupsFromCatalog(catalog);
}
