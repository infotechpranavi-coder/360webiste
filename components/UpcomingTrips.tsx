'use client'

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { upcomingTrips } from "@/data/homeData";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const UpcomingTrips = () => {
  const router = useRouter();

  // Triple the trips for a seamless infinite scroll
  const duplicatedTrips = [...upcomingTrips, ...upcomingTrips, ...upcomingTrips];

  return (
    <section
      id="trips"
      className="py-24 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 mb-16">
        <div className="grid lg:grid-cols-4 gap-8 items-end">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 mb-6">
              UPCOMING TRIPS
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Join us on these exciting upcoming adventures. Limited spots available!
            </p>
          </div>
          <div className="lg:col-span-1 lg:text-right">
            <Button
              variant="outline"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 rounded-full font-bold"
              onClick={() => router.push('/packages')}
            >
              View All Trips
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        <div className="flex marquee-container">
          <div className="flex animate-marquee hover:pause-marquee py-4">
            {duplicatedTrips.map((trip, index) => (
              <motion.div
                key={`${trip.id}-${index}`}
                className="relative flex-shrink-0 w-[300px] sm:w-[380px] h-[500px] mx-4 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
                onClick={() => {
                  const itemType = trip.type || 'package';
                  const generateSlug = (title: string, id: string) => {
                      return `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
                  };
                  const slug = generateSlug(trip.title, trip.id);
                  const route = itemType === 'tour' ? `/tours/${slug}` : itemType === 'ticket' ? `/tickets/${slug}` : `/packages/${slug}`;
                  router.push(route);
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col">
                  {/* Title and Location */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#bd9245] transition-colors">
                      {trip.title}
                    </h3>
                    <p className="text-white/80 text-sm">{trip.location}</p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#bd9245] font-bold text-sm uppercase tracking-widest">
                      View Detailed Page
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                    <div className="bg-[#bd9245]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#bd9245]/30">
                      <span className="text-[#bd9245] text-xs font-black uppercase tracking-tighter">Inquire Now</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .animate-marquee {
            display: flex;
            width: fit-content;
            animation: marquee 30s linear infinite;
          }
          .hover\:pause-marquee:hover {
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
    </section>
  );
};

export default UpcomingTrips;
