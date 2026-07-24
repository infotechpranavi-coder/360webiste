'use client'

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Destination } from "@/data/homeData";
import { useRouter } from "next/navigation";
import { PackageData } from "@/lib/types";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useMemo } from "react";

function mapPackagesToDestinations(packages: PackageData[]): Destination[] {
  const generateSlug = (title: string, id: string) =>
    `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;

  return packages.map((pkg) => ({
    id: pkg._id,
    title: pkg.title,
    subtitle: pkg.subtitle || '',
    image: pkg.images?.[0]?.url || "",
    link: `/packages/${generateSlug(pkg.title, pkg._id)}`,
  }));
}

interface DestinationsGridProps {
  initialPackages?: PackageData[];
}

const DestinationsGrid = ({ initialPackages }: DestinationsGridProps) => {
  const router = useRouter();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [hoveredCardImage, setHoveredCardImage] = useState<string | null>(null);
  const seeded = useMemo(
    () => (initialPackages?.length ? mapPackagesToDestinations(initialPackages) : []),
    [initialPackages]
  );
  const [displayDestinations, setDisplayDestinations] = useState<Destination[]>(seeded);

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      setDisplayDestinations(mapPackagesToDestinations(initialPackages));
      return;
    }

    const fetchFeaturedPackages = async () => {
      try {
        const res = await fetch('/api/packages?featured=true');
        const result = await res.json();

        if (result.success && result.data?.length) {
          setDisplayDestinations(mapPackagesToDestinations(result.data as PackageData[]));
        } else {
          setDisplayDestinations([]);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchFeaturedPackages();
  }, [initialPackages]);

  return (
    <section
      id="destinations"
      ref={ref}
      className="py-24 relative overflow-hidden min-h-[480px] sm:min-h-[560px] lg:min-h-[700px] h-auto"
    >
      {/* Default Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/b5.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(4px) brightness(0.45)',
            transform: 'scale(1.15)',
          }}
        />
        <div className="absolute inset-0 bg-gray-900/30" />
      </div>

      {/* Hover Background Layer - Only one active at a time for performance */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{ opacity: hoveredCardImage ? 1 : 0 }}
      >
        {hoveredCardImage && (
          <>
            <img
              src={hoveredCardImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
              style={{
                filter: 'blur(4px) brightness(0.55) saturate(1.3)',
                transform: 'scale(1.05)',
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 relative z-[3]">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Panel */}
          <div className="lg:col-span-1">
            <h2 className="section-hero-title text-white mb-6 mt-0 lg:-mt-16">
              DESTINATIONS
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Explore the world&rsquo;s most iconic destinations with our curated travel packages. From luxury beach getaways to wild safari adventures, we turn your dream tour into a seamless reality.
            </p>
            <Button
              className="bg-black text-white border-2 border-white hover:bg-white hover:text-black px-8 py-6 rounded-full transition-colors duration-300"
              onClick={() => router.push('/packages')}
            >
              View All Destinations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Grid - 2x2 */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 lg:mt-12">
            {displayDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                className="group relative rounded-2xl overflow-hidden cursor-pointer h-64 card-hover z-10"
                onClick={() => {
                  const itemType = destination.type || 'package';
                  const isDetailLink = destination.link.includes('/packages/') || destination.link.includes('/tours/') || destination.link.includes('/tickets/');
                  
                  if (isDetailLink) {
                    router.push(destination.link);
                  } else {
                    const generateSlug = (title: string, id: string) => {
                        return `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
                    };
                    const slug = generateSlug(destination.title, destination.id);
                    const route = itemType === 'tour' ? `/tours/${slug}` : itemType === 'ticket' ? `/tickets/${slug}` : `/packages/${slug}`;
                    // If link is a generic list page like '/packages', use the respective detail route
                    if (destination.link === '/packages' || destination.link === '/tours' || destination.link === '/tickets') {
                      router.push(route);
                    } else {
                      router.push(destination.link);
                    }
                  }
                }}
                onMouseEnter={() => setHoveredCardImage(destination.image)}
                onMouseLeave={() => setHoveredCardImage(null)}
                initial={{ opacity: 0, y: 40 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              >
                <div className="absolute inset-0">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#bd9245] transition-colors">
                    {destination.title}
                  </h3>
                  <p className="text-white/80 mb-4">{destination.subtitle}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Explore Options</span>
                    <div className="w-10 h-10 rounded-full bg-[#bd9245] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight className="h-5 w-5 text-gray-900" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
