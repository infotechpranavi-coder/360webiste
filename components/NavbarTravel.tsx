'use client'

import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { SITE_NAME, LOGO_SRC } from "@/lib/branding";
const NavbarTravel = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const contactRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { openForm } = useInquiryForm();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Package', href: '/packages' },
    { name: 'Tours', href: '/tours' },
    { name: 'Tickets', href: '/tickets' },
    { name: 'International', href: '/international' },
    { name: 'Domestic', href: '/domestic' },
    { name: 'Blogs', href: '/blogs' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) || false;
  };

  // Find active index
  const activeIndex = navigation.findIndex(item => isActive(item.href));
  const isContactActive = isActive('/contact');
  // Use index 8 for Contact Us (after the 8 navigation items)
  const contactIndex = 8;
  const currentIndex = hoveredIndex !== null
    ? hoveredIndex
    : (isContactActive ? contactIndex : (activeIndex >= 0 ? activeIndex : null));

  // Update pill position on hover/active change
  useEffect(() => {
    // Small delay to ensure refs are set
    const timer = setTimeout(() => {
      let element: HTMLAnchorElement | null = null;

      // Check if it's Contact Us (index 5) or a navigation item
      if (currentIndex === contactIndex) {
        element = contactRef.current;
      } else if (currentIndex !== null && navRefs.current[currentIndex]) {
        element = navRefs.current[currentIndex];
      }

      if (element) {
        const parent = element.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const left = elementRect.left - parentRect.left;
          const width = elementRect.width;

          setPillStyle({
            width,
            left,
            opacity: 1
          });
        }
      } else if (currentIndex === null) {
        setPillStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [currentIndex, pathname]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => {
      let element: HTMLAnchorElement | null = null;

      // Check if it's Contact Us (index 5) or a navigation item
      if (currentIndex === contactIndex) {
        element = contactRef.current;
      } else if (currentIndex !== null && navRefs.current[currentIndex]) {
        element = navRefs.current[currentIndex];
      }

      if (element) {
        const parent = element.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          const left = elementRect.left - parentRect.left;
          const width = elementRect.width;

          setPillStyle({
            width,
            left,
            opacity: 1
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    
    if (query.includes('tour') || query.includes('visit') || query.includes('sightsee')) {
      router.push(`/tours?search=${encodeURIComponent(searchQuery)}`);
    } else if (query.includes('ticket') || query.includes('flight') || query.includes('air')) {
      router.push(`/tickets?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/packages?search=${encodeURIComponent(searchQuery)}`);
    }
    
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center relative z-50">
            <div className="relative w-40 h-12 md:w-52 md:h-14">
              <Image
                src={LOGO_SRC}
                alt={SITE_NAME}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Centered Navigation Pill */}
          <div className={`hidden lg:flex items-center justify-center flex-1 transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100'}`}>
            <div className="relative flex items-center gap-[10px] rounded-full px-[12px] py-[10px] bg-black/55 backdrop-blur-[10px] border border-black/20">
              {/* Sliding White Pill Indicator */}
              <div
                className="absolute bg-white rounded-full transition-all duration-500 ease-out pointer-events-none"
                style={{
                  width: `${pillStyle.width}px`,
                  left: `${pillStyle.left}px`,
                  height: '32px',
                  opacity: pillStyle.opacity,
                  transform: 'translateY(-50%)',
                  top: '50%'
                }}
              />

              {navigation.map((item, index) => {
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  // If on home page and clicking Home, scroll to top
                  if (pathname === '/' && item.href === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                };

                return (
                  <Link
                    key={item.name}
                    ref={(el) => {
                      navRefs.current[index] = el;
                    }}
                    href={item.href}
                    onClick={handleClick}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative z-10 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/55 ${isActive(item.href)
                      ? 'text-gray-900 font-bold'
                      : 'text-white/90 hover:text-gray-900'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {/* Contact Us CTA Button */}
              <Link
                ref={contactRef}
                href="/contact"
                aria-current={isActive('/contact') ? 'page' : undefined}
                onMouseEnter={() => setHoveredIndex(contactIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative z-10 px-[14px] py-2 rounded-full font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/55 ${isActive('/contact')
                  ? 'text-gray-900 font-bold'
                  : 'text-white/90 hover:text-gray-900'
                  }`}
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Side: Search + Book Now */}
          <div className="hidden lg:flex items-center space-x-4 relative">
            <div className={`flex items-center transition-all duration-500 overflow-hidden ${isSearchOpen ? 'w-[400px] absolute right-32' : 'w-10'}`}>
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center w-full bg-white/80 backdrop-blur-xl rounded-full border border-[#bd9245]/30 shadow-sm px-2 overflow-hidden">
                  <Input
                    autoFocus
                    placeholder="Search trips, flights, or packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none outline-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-800 h-10 w-full rounded-full"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-red-400 rounded-full h-8 w-8 ml-1 shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:bg-white/10`}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            <Button
              onClick={() => openForm()}
              className="bg-[#bd9245] hover:bg-[#a07835] text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg h-10 whitespace-nowrap"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-md ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`block px-4 py-2 rounded-lg transition-colors ${isActive(item.href)
                  ? 'bg-primary text-white font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block px-4 py-2 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Button
              onClick={() => {
                openForm();
                setIsMenuOpen(false);
              }}
              className="w-full bg-[#bd9245] hover:bg-[#a07835] text-gray-900 font-bold mt-4"
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarTravel;
