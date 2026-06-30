'use client'

import { useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BannerData } from "@/lib/types";
import { SITE_NAME } from "@/lib/branding";
import { getHeroBannerSrcSet, getHeroBannerUrl } from "@/lib/utils";
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/bannerMedia";

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

function splitHeadline(title: string) {
  if (title.includes('\n')) {
    const [lead, ...rest] = title.split('\n').filter((line) => line.trim());
    return {
      lead: lead?.trim() || 'ADVENTURES BEGIN WITH',
      accent: rest.join(' ').trim() || SITE_NAME,
    };
  }

  const words = title.trim().split(/\s+/);
  if (words.length > 2) {
    return {
      lead: words.slice(0, -1).join(' ').toUpperCase(),
      accent: words[words.length - 1].toUpperCase(),
    };
  }

  return {
    lead: 'ADVENTURES BEGIN WITH',
    accent: title.trim().toUpperCase() || SITE_NAME.toUpperCase(),
  };
}

const HeroExplore = ({ initialBanners }: HeroExploreProps) => {
  const router = useRouter();
  const { openForm } = useInquiryForm();
  const sectionRef = useRef<HTMLElement>(null);
  const heroWidth = useHeroImageWidth();

  const defaultBanner: BannerData = {
    _id: 'default',
    title: `ADVENTURES BEGIN WITH\n${SITE_NAME.toUpperCase()}`,
    subtitle:
      'Start your exciting travel adventure with Explore 360, where safety and memorable experiences come first.',
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

  const [banners, setBanners] = useState<BannerData[]>(initialBanners || []);
  const [currentIndex, setCurrentIndex] = useState(0);

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
  const headline = splitHeadline(currentBanner.title);
  const description =
    currentBanner.subtitle?.trim() ||
    'Start your exciting travel adventure with Explore 360, where safety and memorable experiences come first.';

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
      'h-full w-full object-cover object-[72%_center] sm:object-[78%_center] lg:object-right';

    if (mediaType === 'youtube' && banner.youtubeUrl) {
      const embedUrl = getYoutubeEmbedUrl(banner.youtubeUrl);
      const poster =
        banner.image?.url || getYoutubeThumbnail(banner.youtubeUrl) || undefined;

      if (embedUrl) {
        return (
          <div key={banner._id} className={`${visibilityClass} overflow-hidden`} aria-hidden={!isActive}>
            {isActive ? (
              <iframe
                src={embedUrl}
                title={banner.title}
                className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : poster ? (
              <img src={poster} alt="" className={`${objectClass}`} aria-hidden />
            ) : null}
          </div>
        );
      }
    }

    if (mediaType === 'video' && banner.video?.url) {
      return (
        <video
          key={banner._id}
          src={banner.video.url}
          className={`${visibilityClass} ${objectClass}`}
          autoPlay={isActive}
          muted
          loop
          playsInline
          poster={banner.image?.url}
          aria-hidden={!isActive}
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
      className="relative min-h-screen overflow-hidden bg-[#0b1f2d]"
    >
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) =>
          renderBannerBackground(banner, index, index === currentIndex)
        )}

        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#0a2233]/85 via-[#0a2233]/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a2233]/35 via-transparent to-[#0a2233]/15 pointer-events-none" />
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-between px-5 pb-10 pt-28 sm:px-8 sm:pb-14 sm:pt-32 lg:px-12 lg:pb-16 lg:pt-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={`top-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <p className="text-sm font-medium leading-relaxed text-white/90 sm:text-base md:max-w-md md:text-[17px]">
              {description}
            </p>

            <button
              type="button"
              onClick={handlePrimaryAction}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#c8d8e2] px-7 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#17303f] transition hover:bg-white sm:mt-8 sm:px-8 sm:py-3.5 sm:text-xs"
            >
              {currentBanner.link ? 'View Details' : 'Book An Experience'}
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-col gap-8 sm:mt-0 sm:flex-row sm:items-end sm:justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={`bottom-${currentIndex}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-3xl"
            >
              <p className="text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {headline.lead}
              </p>
              <h1 className="mt-1 text-[clamp(3.5rem,12vw,9rem)] font-black uppercase leading-[0.82] tracking-tighter text-white">
                {headline.accent}
              </h1>
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
                    i === currentIndex ? 'w-10 bg-white' : 'w-6 bg-white/35 hover:bg-white/60'
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
