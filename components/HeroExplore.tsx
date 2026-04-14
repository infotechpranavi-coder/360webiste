'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "@/lib/types";
import Image from "next/image";

interface HeroExploreProps {
  initialBanners?: BannerData[];
}

const HeroExplore = ({ initialBanners }: HeroExploreProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Fallback banner if none are provided or uploaded
  const defaultBanner: BannerData = {
    _id: 'default',
    title: "TRAVEL\nMORE",
    subtitle: "WORRY LESS",
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
      public_id: "default",
      alt: "South African Safari"
    },
    link: "",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [banners, setBanners] = useState<BannerData[]>(initialBanners || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderTitle = (title: string) => {
    if (title.includes('\n')) {
      return title.split('\n').map((line, index) => (
        <span key={index} className={index === 0 ? "text-white block" : "text-amber-500 block"}>
          {line}
        </span>
      ));
    }
    const words = title.split(' ');
    if (words.length > 1) {
      return (
        <>
          {words.slice(0, -1).join(' ')}
          <br />
          <span className="text-amber-500 text-bold font-black">{words.slice(-1)}</span>
        </>
      );
    }
    return title;
  };

  useEffect(() => {
    // Only fetch if not provided via props
    if (initialBanners && initialBanners.length > 0) {
      return;
    }

    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners?activeOnly=true');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setBanners(data.data);
        } else {
          setBanners([defaultBanner]);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
        setBanners([defaultBanner]);
      }
    };
    fetchBanners();
  }, [initialBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners]);

  const currentBanner = banners[currentIndex] || defaultBanner;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-[#faf8f3]"
    >
      {/* Background Images with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBanner._id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <Image
                src={currentBanner.image.url}
                alt={currentBanner.image.alt || currentBanner.title}
                fill
                className="object-cover"
                priority={currentIndex === 0}
                sizes="100vw"
                quality={90}
              />
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/25"></div>
              {/* Vertical Gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom fade into page background for smooth section transition */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#faf8f3] via-[#faf8f3]/70 to-transparent z-10 pointer-events-none" />
      </div>



      {/* Content with AnimatePresence */}
      <div className="relative z-20 container mx-auto px-4 text-center pt-24 md:pt-32">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: -40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: 40 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-amber-500 font-black uppercase tracking-[0.5em] text-xs sm:text-sm mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
                PREMIUM EXPERIENCE
              </p>
              
              <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[140px] font-[1000] leading-[0.85] tracking-tighter uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,1)] mb-8">
                {renderTitle(currentBanner.title)}
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-12 max-w-3xl mx-auto tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] uppercase">
                {currentBanner.subtitle.split('\n').filter(l => l.trim()).map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Static CTA Button */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 mb-24">
            <Button
              onClick={() => currentBanner.link ? router.push(currentBanner.link) : openForm()}
              size="lg"
              className="bg-amber-500 hover:bg-white hover:text-gray-900 text-gray-900 font-black px-12 py-8 text-xs rounded-2xl shadow-2xl transition-all uppercase tracking-widest border-none"
            >
              {currentBanner.link ? 'View Details' : 'Start With SkyGo'}
            </Button>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-12 h-1 transition-all duration-500 rounded-full",
                i === currentIndex ? "bg-[#bd9245] w-20" : "bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
};

// Helper for class consolidation if not available in this scope, 
// though typically it is. I'll check if I need to import it.
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default HeroExplore;
