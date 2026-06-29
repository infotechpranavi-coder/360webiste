'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SITE_NAME } from '@/lib/branding';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const customerAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
];

const features = [
  {
    icon: Compass,
    title: 'Designed for Adventure-Lovers',
    description: 'We believe extraordinary travel should be accessible, exciting, and enjoyable for everyone.',
  },
  {
    icon: Sparkles,
    title: 'Comfort Without Compromise',
    description: 'Every journey is planned with care — thoughtful itineraries, trusted partners, and seamless support.',
  },
];

const AboutHomeSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-[#f4f5f0] relative overflow-hidden">
      {/* Decorative leaf accent */}
      <div className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 hidden xl:block opacity-20">
        <div className="h-72 w-72 rounded-full bg-gradient-to-br from-[#bd9245]/30 to-emerald-200/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          initial={{ opacity: 0, y: 32 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Left — image + social proof badge */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -24 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative aspect-[4/5] max-h-[620px] w-full overflow-hidden rounded-[32px] md:rounded-[40px] shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt={`${SITE_NAME} travel experience`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-auto md:max-w-sm">
              <div className="rounded-2xl bg-[#1a1f16]/85 backdrop-blur-md px-5 py-4 text-white shadow-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {customerAvatars.map((src, i) => (
                      <div key={src} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#1a1f16]">
                        <Image src={src} alt="" fill className="object-cover" sizes="36px" />
                      </div>
                    ))}
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c8d4a8] text-xs font-black text-[#1a1f16]">
                    500+
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold tracking-wide text-white/90">
                  Over 500+ Satisfied Customers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 24 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[#7a8f4e]">
              <span className="text-[#bd9245]">✦</span> About Us
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-[1.15] tracking-tight text-gray-900">
              We created a unique escape where nature, comfort and adventure come together to redefine the way you
              experience travel
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-gray-600 max-w-xl">
              Our story begins with a love for discovery and a desire to share it in a way that feels extraordinary.
              {` ${SITE_NAME}`} carefully designs every experience to bring you closer to remarkable destinations while
              surrounding you with beauty, comfort, and thoughtful details. We create journeys that inspire, relax, and
              connect people to the world.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dce5c8] text-[#5a6b3c]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group inline-flex w-full sm:w-auto min-w-[240px] items-center justify-between gap-4 rounded-full bg-[#c8d4a8] pl-8 pr-2 py-2.5 text-gray-900 font-bold transition-all hover:bg-[#bd9245] hover:text-white shadow-sm"
            >
              <span>More About Us</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-900 transition-transform group-hover:scale-105">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHomeSection;
