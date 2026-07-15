'use client'

import { useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "@/lib/types";
import { SITE_NAME, HERO_SUBHEADING } from "@/lib/branding";
import { getHeroBannerSrcSet, getHeroBannerUrl } from "@/lib/utils";
import { getYoutubeThumbnail, sortBannersByOrder } from "@/lib/bannerMedia";
import HeroYoutubePlayer from "@/components/HeroYoutubePlayer";

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

function getHeroTitle(title: string) {
  const lines = title
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.toUpperCase() !== 'ADVENTURES BEGIN WITH');

  if (lines.length > 0) {
    return lines.join(' ').toUpperCase();
  }

  return SITE_NAME.toUpperCase();
}

function isPlayToEndBanner(banner: BannerData) {
  const mediaType = banner.mediaType || 'image';
  return mediaType === 'video' || mediaType === 'youtube';
}

const HeroExplore = ({ initialBanners }: HeroExploreProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const sectionRef = useRef<HTMLElement>(null);
  const heroWidth = useHeroImageWidth();

  const defaultBanner: BannerData = {
    _id: 'default',
    title: SITE_NAME.toUpperCase(),
    subtitle: HERO_SUBHEADING,
    image: {
      url: '/safeimagekit-kayak2__1_.webp',
      public_id: 'default-kayak',
      alt: 'Kayaking adventure',
    },
    link: '/packages/kayaking-boat-rides',
    mediaType: 'image',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [banners, setBanners] = useState<BannerData[]>(sortBannersByOrder(initialBanners || []));
  const [currentIndex, setCurrentIndex] = useState(0);

  const advanceBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(banners.length, 1));
  }, [banners.length]);

  const handleMediaEnded = useCallback(() => {
    if (banners.length <= 1) return;
    advanceBanner();
  }, [banners.length, advanceBanner]);

  useEffect(() => {
    if (initialBanners && initialBanners.length > 0) {
      setBanners(sortBannersByOrder(initialBanners));
      setCurrentIndex(0);
      return;
    }

    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners?activeOnly=true');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setBanners(sortBannersByOrder(data.data));
          setCurrentIndex(0);
        } else {
          setBanners([defaultBanner]);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
        setBanners([defaultBanner]);
        setCurrentIndex(0);
      }
    };
    fetchBanners();
  }, [initialBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const current = banners[currentIndex];
    if (current && isPlayToEndBanner(current)) return;

    const interval = setInterval(advanceBanner, 6000);
    return () => clearInterval(interval);
  }, [banners, currentIndex, advanceBanner]);

  const currentBanner = banners[currentIndex] || defaultBanner;
  const heroTitle = getHeroTitle(currentBanner.title);
  const description =
    currentBanner.subtitle?.trim() || HERO_SUBHEADING;

  const handlePrimaryAction = () => {
    if (currentBanner.link) {
      router.push(currentBanner.link);
      return;
    }
    openForm();
  };

  const renderBannerBackground = (banner: BannerData, index: number, isActive: boolean) => {
    const mediaType = banner.mediaType || 'image';
    const visibilityClass = `absolute inset-0 transition-opacity duration-700 ${
      isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
    }`;
    const objectClass =
      'h-full w-full object-cover object-center sm:object-[78%_center] lg:object-right';

    if (mediaType === 'youtube' && banner.youtubeUrl) {
      const poster =
        banner.image?.url || getYoutubeThumbnail(banner.youtubeUrl) || undefined;

      return (
        <div key={banner._id} className={`${visibilityClass} overflow-hidden`} aria-hidden={!isActive}>
          <HeroYoutubePlayer
            youtubeUrl={banner.youtubeUrl}
            isActive={isActive}
            onEnded={handleMediaEnded}
            poster={poster}
            objectClass={objectClass}
          />
        </div>
      );
    }

    if (mediaType === 'video' && banner.video?.url) {
      return (
        <video
          key={`${banner._id}-${isActive ? 'active' : 'idle'}`}
          src={banner.video.url}
          className={`${visibilityClass} ${objectClass}`}
          autoPlay={isActive}
          muted
          playsInline
          poster={banner.image?.url}
          aria-hidden={!isActive}
          onEnded={() => {
            if (isActive) handleMediaEnded();
          }}
        />
      );
    }

    if (!banner.image?.url) return null;

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
        className={`${visibilityClass} ${objectClass}`}
        fetchPriority={index === 0 ? 'high' : 'auto'}
        decoding={index === 0 ? 'sync' : 'async'}
      />
    );
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0b1f2d] h-[min(58svh,480px)] min-h-[360px] sm:h-[min(72svh,620px)] sm:min-h-[480px] md:h-[min(85svh,780px)] lg:h-screen lg:min-h-[640px]"
    >
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            {renderBannerBackground(currentBanner, currentIndex, true)}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0a2233]/90 via-[#0a2233]/55 to-[#0a2233]/20 pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a2233]/70 via-[#0a2233]/15 to-[#0a2233]/25 pointer-events-none" />
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-6 pt-16 sm:px-8 sm:pb-10 sm:pt-24 lg:px-12 lg:pb-20 lg:pt-36">
        <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-end sm:justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`hero-${currentIndex}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl min-w-0"
            >
              <h1 className="text-[clamp(1.5rem,7.2vw,8rem)] font-black uppercase leading-[0.95] tracking-tighter text-white break-words">
                {heroTitle}
              </h1>

              <p className="mt-2.5 sm:mt-4 max-w-xl text-[11px] sm:text-sm font-medium leading-relaxed text-white/90 line-clamp-2 sm:line-clamp-3 md:line-clamp-none md:max-w-md md:text-[17px]">
                {description}
              </p>

              <button
                type="button"
                onClick={handlePrimaryAction}
                className="mt-3.5 sm:mt-6 inline-flex items-center justify-center rounded-full bg-[#c8d8e2] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#17303f] transition hover:bg-white sm:mt-8 sm:px-8 sm:py-3.5 sm:text-xs"
              >
                {currentBanner.link ? 'View Details' : 'Book An Experience'}
              </button>
            </motion.div>
          </AnimatePresence>

          {banners.length > 1 && (
            <div className="flex items-center gap-2 sm:pb-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show banner ${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 sm:w-10 bg-white' : 'w-5 sm:w-6 bg-white/35 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroExplore;
