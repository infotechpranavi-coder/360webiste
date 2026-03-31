'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin, MessageSquare } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const [settings, setSettings] = useState<any>({
    facebookEnabled: true,
    facebookUrl: "",
    instagramEnabled: true,
    instagramUrl: "",
    twitterEnabled: true,
    twitterUrl: "",
    linkedinEnabled: true,
    linkedinUrl: "",
    youtubeEnabled: true,
    youtubeUrl: "",
    whatsappEnabled: true,
    whatsappUrl: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch footer settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="relative bg-[#f4f7f9] text-gray-900 overflow-hidden border-t border-gray-200 font-inter">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                <Image
                  src="/Untitled_design__2_-removebg-preview.png"
                  alt="Sky Go Logo"
                  fill
                  sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 200px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-gray-600 text-[13px] font-medium leading-relaxed max-w-sm">
              SkyGo specializes in comprehensive tours, travel, and ticketing services. We provide well-curated travel experiences and seamless flight bookings, offering professional and personalized solutions for all your journey needs within the region and beyond.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {settings?.facebookEnabled && settings?.facebookUrl && (
                <Link href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 transition-all duration-300">
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings?.instagramEnabled && settings?.instagramUrl && (
                <Link href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#E4405F] hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5 transition-all duration-300">
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {settings?.twitterEnabled && settings?.twitterUrl && (
                <Link href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black/30 hover:bg-black/5 transition-all duration-300">
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {settings?.linkedinEnabled && settings?.linkedinUrl && (
                <Link href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 transition-all duration-300">
                  <Linkedin className="h-5 w-5" />
                </Link>
              )}
              {settings?.youtubeEnabled && settings?.youtubeUrl && (
                <Link href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FF0000] hover:border-[#FF0000]/30 hover:bg-[#FF0000]/5 transition-all duration-300">
                  <Youtube className="h-5 w-5" />
                </Link>
              )}
              {settings?.whatsappEnabled && settings?.whatsappUrl && (
                <Link href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-[#25D366]/5 transition-all duration-300">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Home</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">About</Link></li>
              <li><Link href="/packages" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Packages</Link></li>
              <li><Link href="/blogs" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Travel Blog </Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-widest">Our Services</h4>
            <ul className="space-y-3">
              <li><Link href="/tours" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Exclusive Tours</Link></li>
              <li><Link href="/international" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">International Packages</Link></li>
              <li><Link href="/domestic" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Domestic Packages</Link></li>
              <li><Link href="/packages/premium" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Premium Packages</Link></li>
              <li><Link href="/packages/luxury" className="text-gray-600 hover:text-[#bd9245] transition-colors text-sm font-medium">Luxury Packages</Link></li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-base font-bold text-gray-900 uppercase tracking-widest">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#bd9245] mt-0.5" />
                <span className="text-gray-600 text-sm font-medium leading-tight">Head office - Yaoundé, Cameroon</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#bd9245]" />
                <span className="text-gray-600 text-sm font-medium">+237 6 83 57 76 76</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#bd9245]" />
                <span className="text-gray-600 text-sm font-medium">sales@skygovoyages.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4 pt-2">
              <h5 className="text-sm font-bold text-gray-900 uppercase">Subscribe</h5>
              <div className="flex gap-2">
                <Input
                  placeholder="Email"
                  className="bg-white border-gray-200 text-gray-900 placeholder-gray-400 text-sm h-10"
                />
                <Button size="sm" className="bg-[#bd9245] hover:bg-[#a07835] text-white font-bold h-10 border-none px-4">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-xs font-medium">
              © 2025 Sky Go. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 text-xs font-medium transition-colors underline-offset-4 hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;