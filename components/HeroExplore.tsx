'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "@/lib/types";
import { SITE_NAME } from "@/lib/branding";
import { getHeroBannerSrcSet, getHeroBannerUrl } from "@/lib/utils";

interface HeroExploreProps {
  initialBanners?: BannerData[];
}

function useHeroImageWidth() {
  const [width, setWidth] = useState(3840);

  useEffect(() => {
    const update = () => {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const viewport = typeof window !== 'undefined' ? window.innerWidth : 1920;
      setWidth(Math.min(3840, Math.max(1920, Math.ceil(viewport * dpr))));
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return width;
}

const HeroExplore = ({ initialBanners }: HeroExploreProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const sectionRef = useRef<HTMLElement>(null);
  const heroWidth = useHeroImageWidth();
  
  const defaultBanner: BannerData = {
    _id: 'default',
    title: "TRAVEL\nMORE",
    subtitle: "WORRY LESS",
    image: {
      url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=100",
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
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const src = getHeroBannerUrl(banner.image.url, banner.image.public_id, heroWidth);
          const srcSet = getHeroBannerSrcSet(banner.image.url, banner.image.public_id);
          const alt = banner.image.alt || banner.title;

          return (
            <img
              key={banner._id}
              src={src}
              srcSet={srcSet}
              sizes="100vw"
              alt={alt}
              aria-hidden={!isActive}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
              }`}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding={index === 0 ? 'sync' : 'async'}
            />
          );
        })}

        <div className="absolute inset-0 z-[2] bg-black/15 pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/30 via-transparent to-black/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#faf8f3] via-[#faf8f3]/70 to-transparent z-[3] pointer-events-none" />
      </div>

      <div className="relative z-20 container mx-auto px-4 text-center pt-24 md:pt-32">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
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

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 mb-24">
            <Button
              onClick={() => currentBanner.link ? router.push(currentBanner.link) : openForm()}
              size="lg"
              className="bg-amber-500 hover:bg-white hover:text-gray-900 text-gray-900 font-black px-12 py-8 text-xs rounded-2xl shadow-2xl transition-all uppercase tracking-widest border-none"
            >
              {currentBanner.link ? 'View Details' : `Start With ${SITE_NAME}`}
            </Button>
          </div>
        </div>
      </div>

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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default HeroExplore;
