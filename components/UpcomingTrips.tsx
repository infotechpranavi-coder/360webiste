'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  getCategoryBySlug,
} from '@/lib/packageExperienceCategories';

const WATER_GROUP_HREF = '/packages/water';
const WATER_HERO = getCategoryBySlug('yachts-sailing-cruises')?.heroImage ?? '/yaht/1629138.jpg';
const CAROUSEL_THRESHOLD = 4;

interface TripCard {
  id: string;
  title: string;
  location: string;
  image: string;
}

const generateSlug = (title: string, id: string) =>
  `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;

const TripCardItem = ({
  trip,
  onOpen,
  className = '',
}: {
  trip: TripCard;
  onOpen: () => void;
  className?: string;
}) => (
  <motion.div
    className={`relative h-[500px] rounded-2xl overflow-hidden cursor-pointer group shadow-lg ${className}`}
    onClick={onOpen}
    whileHover={{
      y: -10,
      transition: { duration: 0.3 },
    }}
  >
    <div className="absolute inset-0">
      <Image
        src={trip.image}
        alt={trip.title}
        fill
        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
        sizes="380px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
    </div>

    <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#bd9245] transition-colors">
          {trip.title}
        </h3>
        <p className="text-white/80 text-sm">{trip.location}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-[#bd9245] font-bold text-sm uppercase tracking-widest">
          View Detailed Page
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
        <div className="bg-[#bd9245]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#bd9245]/30">
          <span className="text-[#bd9245] text-xs font-black uppercase tracking-tighter">
            Inquire Now
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const UpcomingTrips = () => {
  const router = useRouter();
  const [trips, setTrips] = useState<TripCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingRides = async () => {
      try {
        const response = await fetch('/api/packages?featuredTrip=true', { cache: 'no-store' });
        const result = await response.json();
        if (result.success && result.data?.length) {
          const matched = result.data.map((pkg: {
              _id: string;
              title: string;
              location?: string;
              place?: string;
              images?: Array<{ url: string }>;
            }) => ({
              id: pkg._id,
              title: pkg.title,
              location: pkg.location || pkg.place || 'Explore 360',
              image: pkg.images?.[0]?.url || WATER_HERO,
            }));
          setTrips(matched);
        } else {
          setTrips([]);
        }
      } catch (error) {
        console.error('Error fetching upcoming rides:', error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingRides();
  }, []);

  const useCarousel = trips.length > CAROUSEL_THRESHOLD;
  const duplicatedTrips = useCarousel ? [...trips, ...trips, ...trips] : [];

  const openTrip = (trip: TripCard) => {
    router.push(`/packages/${generateSlug(trip.title, trip.id)}`);
  };

  return (
    <section id="trips" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <div className="grid lg:grid-cols-4 gap-8 items-end">
          <div className="lg:col-span-3">
            <p className="text-[#bd9245] font-bold text-sm uppercase tracking-[0.2em] mb-3">
              Featured Adventures
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-6">
              FEATURED ADVENTURES
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Curated adventures and premium experiences from Gateway of India and beyond.
            </p>
          </div>
          <div className="lg:col-span-1 lg:text-right">
            <Button
              variant="outline"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 rounded-full font-bold"
              onClick={() => router.push(WATER_GROUP_HREF)}
            >
              View All Water Experiences
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#bd9245] animate-spin mb-4" />
          <p className="text-gray-500 font-semibold uppercase tracking-widest text-xs">
            Loading featured adventures...
          </p>
        </div>
      ) : trips.length === 0 ? (
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-gray-500 mb-6">No featured adventures yet. Mark packages as &quot;Featured Adventures&quot; in the dashboard.</p>
          <Button
            onClick={() => router.push(WATER_GROUP_HREF)}
            className="bg-[#bd9245] hover:bg-[#a07835] text-white rounded-full px-8"
          >
            Browse Water Experiences
          </Button>
        </div>
      ) : useCarousel ? (
        <div className="relative w-full overflow-hidden">
          <div className="flex marquee-container">
            <div className="flex animate-marquee hover:pause-marquee py-4">
              {duplicatedTrips.map((trip, index) => (
                <TripCardItem
                  key={`${trip.id}-${index}`}
                  trip={trip}
                  onOpen={() => openTrip(trip)}
                  className="flex-shrink-0 w-[300px] sm:w-[380px] mx-4"
                />
              ))}
            </div>
          </div>

          <style jsx>{`
            .animate-marquee {
              display: flex;
              width: fit-content;
              animation: marquee 30s linear infinite;
            }
            .hover\\:pause-marquee:hover {
              animation-play-state: paused;
            }
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }
            .marquee-container::after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              width: 150px;
              height: 100%;
              background: linear-gradient(to left, white, transparent);
              z-index: 2;
            }
            .marquee-container::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 150px;
              height: 100%;
              background: linear-gradient(to right, white, transparent);
              z-index: 2;
            }
          `}</style>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div
            className={`grid gap-6 py-4 ${
              trips.length === 1
                ? 'grid-cols-1 max-w-md mx-auto'
                : trips.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
                  : trips.length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {trips.map((trip) => (
              <TripCardItem
                key={trip.id}
                trip={trip}
                onOpen={() => openTrip(trip)}
                className="w-full"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UpcomingTrips;
