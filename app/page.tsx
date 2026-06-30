import HeroExplore from "../components/HeroExplore";
export const dynamic = 'force-dynamic';
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
import { BannerData, PackageData } from "@/lib/types";

export default async function Home() {
  // Use try/catch for database operations
  let initialBanners: BannerData[] = [];
  let initialPackages: PackageData[] = [];
  let settings = { 
    popularSection: true, 
    upcomingSection: true,
    destinationsSection: true,
    exploreSection: true,
    testimonialsSection: true
  };

  try {
    await connectDB();
    
    // Fetch banners with a timeout or limited fields to keep it fast
    const bannerDocs = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    // Fetch popular packages limited to top 5
    const packageDocs = await Package.find({ isPopularPackage: true })
      .limit(5)
      .lean();

    // Fetch site settings
    const settingsDoc = await Settings.findOne().lean();
    if (settingsDoc) {
      settings = JSON.parse(JSON.stringify(settingsDoc));
    }
    
    // Stringify/Parse to handle MongoDB ObjectIds for client components
    initialBanners = JSON.parse(JSON.stringify(bannerDocs));
    initialPackages = JSON.parse(JSON.stringify(packageDocs));
  } catch (error) {
    console.warn("Database fetching failed on home page, using fallback client-side fetching or static data.", error);
  }

  return (
    <div className="min-h-screen">
      {initialBanners[0]?.mediaType !== 'video' &&
        initialBanners[0]?.mediaType !== 'youtube' &&
        initialBanners[0]?.image?.url && (
        <link
          rel="preload"
          as="image"
          href={getHeroBannerUrl(
            initialBanners[0].image.url,
            initialBanners[0].image.public_id,
            3840
          )}
        />
      )}
      <HeroExplore initialBanners={initialBanners} />
      <AboutHomeSection />
      {settings.exploreSection !== false && <ExploreWithUs />}
      {settings.destinationsSection !== false && <DestinationsGrid />}
      {settings.upcomingSection !== false && <UpcomingTrips />}
      {settings.popularSection !== false && <PopularPackages initialPackages={initialPackages} />}
      {settings.testimonialsSection !== false && <ClientFeedback />}
    </div>
  );
}

