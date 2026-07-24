'use client'

import { useEffect, useState } from "react";
import { Check, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  explorePhoneHref,
  resolveExploreSectionContent,
  type ExploreSectionContent,
} from "@/lib/exploreSectionDefaults";
import type { SiteSettings } from "@/lib/types";

type ExploreWithUsProps = {
  initialContent?: Partial<ExploreSectionContent>;
};

const POLAROID_IMAGES = [
  { src: "/safeimagekit-kayak2__1_.webp", alt: "Kayaking adventure", rotate: "-rotate-[6deg]", z: "z-10" },
  {
    src: "/four-adventurous-friends-whitewater-rafting-through-rapids-free-photo.webp",
    alt: "Whitewater rafting",
    rotate: "rotate-[4deg]",
    z: "z-20",
  },
  { src: "/bungee-jumping-nedir.webp", alt: "Bungee jumping", rotate: "-rotate-[2deg]", z: "z-30" },
] as const;

const ExploreWithUs = ({ initialContent }: ExploreWithUsProps) => {
  const { openForm } = useInquiryForm();
  const [content, setContent] = useState<ExploreSectionContent>(() =>
    resolveExploreSectionContent(initialContent)
  );

  useEffect(() => {
    if (initialContent) {
      setContent(resolveExploreSectionContent(initialContent));
      return;
    }

    let cancelled = false;

    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!cancelled && data.success && data.data) {
          setContent(resolveExploreSectionContent(data.data as SiteSettings));
        }
      } catch (error) {
        console.error('Failed to load explore section settings:', error);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, [initialContent]);

  const inclusions = content.exploreInclusions;
  const midPoint = Math.ceil(inclusions.length / 2);
  const leftColumn = inclusions.slice(0, midPoint);
  const rightColumn = inclusions.slice(midPoint);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="explore"
      ref={ref}
      className="py-10 sm:py-12 bg-white relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="text-[#bd9245] font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
              {content.exploreEyebrow}
            </p>

            <h2 className="section-hero-title text-gray-900 mb-6 sm:mb-8">
              {content.exploreHeadingLine1}<br />{content.exploreHeadingLine2}
            </h2>

            <p className="text-gray-500 text-base sm:text-lg md:text-xl font-medium tracking-wide mb-6">
              {content.exploreSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3 sm:gap-y-4 mb-8 sm:mb-10">
              <ul className="space-y-3 sm:space-y-4">
                {leftColumn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#bd9245] flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-gray-900" strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 text-sm sm:text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <ul className="space-y-3 sm:space-y-4">
                {rightColumn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#bd9245] flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-gray-900" strokeWidth={3} />
                    </div>
                    <span className="text-gray-900 text-sm sm:text-base font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <Button
                onClick={() => openForm()}
                className="w-full sm:w-auto bg-[#bd9245] hover:bg-[#a07835] text-gray-900 font-bold px-8 py-5 sm:py-6 rounded-lg text-base"
              >
                {content.exploreCtaLabel}
              </Button>

              <div className="flex flex-col items-start sm:items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-[#bd9245] shrink-0" />
                  <a
                    href={explorePhoneHref(content.explorePhone)}
                    className="text-gray-900 text-base sm:text-lg font-semibold hover:text-[#bd9245] transition-colors break-all"
                  >
                    {content.explorePhone}
                  </a>
                </div>
                <span className="text-xs text-gray-500 mt-1 pl-7 sm:pl-0">{content.explorePhoneLabel}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {/* Mobile polaroid stack */}
            <div className="lg:hidden relative h-[300px] sm:h-[340px] max-w-[min(100%,360px)] mx-auto">
              <div className="absolute top-0 left-0 w-32 h-40 sm:w-36 sm:h-44 bg-white p-2 sm:p-3 shadow-2xl transform -rotate-6 z-10">
                <div className="relative w-full h-full">
                  <Image src={POLAROID_IMAGES[0].src} alt={POLAROID_IMAGES[0].alt} fill className="object-cover" />
                </div>
              </div>
              <div className="absolute top-6 sm:top-8 left-[4.5rem] sm:left-20 w-32 h-40 sm:w-36 sm:h-44 bg-white p-2 sm:p-3 shadow-2xl transform rotate-[4deg] z-20">
                <div className="relative w-full h-full">
                  <Image src={POLAROID_IMAGES[1].src} alt={POLAROID_IMAGES[1].alt} fill className="object-cover" />
                </div>
              </div>
              <div className="absolute top-12 sm:top-16 left-[9rem] sm:left-40 w-32 h-40 sm:w-36 sm:h-44 bg-white p-2 sm:p-3 shadow-2xl transform -rotate-[2deg] z-30">
                <div className="relative w-full h-full">
                  <Image src={POLAROID_IMAGES[2].src} alt={POLAROID_IMAGES[2].alt} fill className="object-cover" />
                </div>
              </div>
              <div className="absolute top-0 right-0 z-40 w-24 h-24 sm:w-28 sm:h-28 bg-[#bd9245] rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white">
                <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Up to</span>
                <span className="text-3xl sm:text-4xl font-black text-white leading-none my-0.5">50%</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">Discount</span>
              </div>
            </div>

            {/* Desktop polaroid stack */}
            <div className="hidden lg:block relative h-[500px]">
              <div className="relative h-full">
                <div className="absolute top-0 left-0 w-64 h-80 bg-white p-4 shadow-2xl transform rotate-[-8deg] z-10">
                  <div className="relative w-full h-full">
                    <Image src={POLAROID_IMAGES[0].src} alt={POLAROID_IMAGES[0].alt} fill className="object-cover" />
                  </div>
                </div>
                <div className="absolute top-20 left-32 w-64 h-80 bg-white p-4 shadow-2xl transform rotate-[5deg] z-20">
                  <div className="relative w-full h-full">
                    <Image src={POLAROID_IMAGES[1].src} alt={POLAROID_IMAGES[1].alt} fill className="object-cover" />
                  </div>
                </div>
                <div className="absolute top-40 left-64 w-64 h-80 bg-white p-4 shadow-2xl transform rotate-[-3deg] z-30">
                  <div className="relative w-full h-full">
                    <Image src={POLAROID_IMAGES[2].src} alt={POLAROID_IMAGES[2].alt} fill className="object-cover" />
                  </div>
                </div>
              </div>

              <div
                className="absolute top-[18%] right-0 z-40 w-36 h-36 bg-[#bd9245] rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white transition-all duration-500 hover:scale-110 hover:-rotate-12 cursor-pointer"
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Up to</span>
                  <span className="text-5xl font-black text-white leading-none my-1 drop-shadow-sm">50%</span>
                  <span className="text-sm font-black text-white uppercase tracking-tighter leading-none mt-1">Discount</span>
                </div>
                <div className="absolute inset-2 border border-dashed border-white/30 rounded-full pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreWithUs;
