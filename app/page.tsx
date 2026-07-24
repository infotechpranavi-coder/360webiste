import HeroExplore from "../components/HeroExplore";
import AboutHomeSection from "../components/AboutHomeSection";
import ExploreWithUs from "../components/ExploreWithUs";
import DestinationsGrid from "../components/DestinationsGrid";
import UpcomingTrips from "../components/UpcomingTrips";
import PopularPackages from "../components/PopularPackages";
import ClientFeedback from "../components/ClientFeedback";
import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import Package from "@/models/Package";
import Settings from "@/models/Settings";
import { getHeroBannerUrl } from "@/lib/utils";
import { BannerData, PackageData, SiteSettings } from "@/lib/types";
import { resolveExploreSectionContent } from "@/lib/exploreSectionDefaults";
import { BANNER_CARD_SELECT, PACKAGE_CARD_SELECT } from "@/lib/packageCardFields";

// Cache homepage data briefly so visitors don't hit Mongo on every request
export const revalidate = 60;

export default async function Home() {
  let initialBanners: BannerData[] = [];
  let initialPackages: PackageData[] = [];
  let featuredDestinations: PackageData[] = [];
  let featuredTrips: PackageData[] = [];
  let settings: SiteSettings = {
    popularSection: true,
    upcomingSection: true,
    destinationsSection: true,
    exploreSection: true,
    testimonialsSection: true,
  };

  try {
    await connectDB();

    const [bannerDocs, packageDocs, featuredDocs, tripDocs, settingsDoc] =
      await Promise.all([
        Banner.find({ isActive: true })
          .select(BANNER_CARD_SELECT)
          .sort({ order: 1, createdAt: 1 })
          .lean(),
        Package.find({ isPopularPackage: true })
          .select(PACKAGE_CARD_SELECT)
          .limit(5)
          .lean(),
        Package.find({ isFeaturedDestination: true })
          .select(PACKAGE_CARD_SELECT)
          .limit(8)
          .lean(),
        Package.find({ isFeaturedTrip: true })
          .select(PACKAGE_CARD_SELECT)
          .limit(12)
          .lean(),
        Settings.findOne().lean(),
      ]);

    if (settingsDoc) {
      settings = JSON.parse(JSON.stringify(settingsDoc));
    }

    initialBanners = JSON.parse(JSON.stringify(bannerDocs));
    initialPackages = JSON.parse(JSON.stringify(packageDocs));
    featuredDestinations = JSON.parse(JSON.stringify(featuredDocs));
    featuredTrips = JSON.parse(JSON.stringify(tripDocs));
  } catch (error) {
    console.warn(
      "Database fetching failed on home page, using fallback client-side fetching or static data.",
      error
    );
  }

  const firstBanner = initialBanners[0];
  const preloadHero =
    firstBanner &&
    firstBanner.mediaType !== "video" &&
    firstBanner.mediaType !== "youtube" &&
    firstBanner.image?.url;

  return (
    <div className="min-h-screen">
      {preloadHero && (
        <link
          rel="preload"
          as="image"
          href={getHeroBannerUrl(
            firstBanner.image.url,
            firstBanner.image.public_id,
            1920
          )}
        />
      )}
      <HeroExplore initialBanners={initialBanners} />
      <AboutHomeSection />
      {settings.exploreSection !== false && (
        <ExploreWithUs initialContent={resolveExploreSectionContent(settings)} />
      )}
      {settings.destinationsSection !== false && (
        <DestinationsGrid initialPackages={featuredDestinations} />
      )}
      {settings.upcomingSection !== false && (
        <UpcomingTrips initialPackages={featuredTrips} />
      )}
      {settings.popularSection !== false && (
        <PopularPackages initialPackages={initialPackages} />
      )}
      {settings.testimonialsSection !== false && <ClientFeedback />}
    </div>
  );
}
