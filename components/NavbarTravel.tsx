'use client'

import { useState, useEffect } from "react";
import { Search, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useInquiryForm } from "../contexts/InquiryFormContext";
import { SITE_NAME, LOGO_SRC } from "@/lib/branding";
import { PACKAGE_NAV_GROUPS } from "@/lib/packageExperienceCategories";

type NavSubItem = { name: string; href: string; isFuture?: boolean };
type NavItem = {
  name: string;
  href: string;
  submenu?: NavSubItem[];
  packageGroups?: typeof PACKAGE_NAV_GROUPS;
};

const groupHoverStyles: Record<string, string> = {
  water: 'bg-teal-50 text-teal-800',
  'land-motor': 'bg-orange-50 text-orange-800',
  'land-physical': 'bg-green-50 text-green-800',
  sky: 'bg-violet-50 text-violet-800',
};

const NavbarTravel = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [hoveredPackageGroup, setHoveredPackageGroup] = useState<string | null>(null);
  const [contactHovered, setContactHovered] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { openForm } = useInquiryForm();

  const isBlogDetail = Boolean(pathname?.startsWith('/blogs/') && pathname !== '/blogs');
  const useSolidNav = isScrolled || isBlogDetail;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Package',
      href: '/packages',
      packageGroups: PACKAGE_NAV_GROUPS,
    },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Gallery', href: '/gallery' },
  ];

  const isActive = (href: string, submenu?: NavSubItem[], packageGroups?: typeof PACKAGE_NAV_GROUPS) => {
    if (href === '/') return pathname === '/';
    if (packageGroups?.length) {
      const groupHrefs = packageGroups.flatMap((group) => group.items.map((item) => item.href));
      return (
        pathname === href ||
        pathname?.startsWith(`${href}/`) ||
        groupHrefs.some((itemHref) => pathname === itemHref || pathname?.startsWith(`${itemHref}/`))
      );
    }
    if (submenu?.length) {
      return (
        pathname === href ||
        pathname?.startsWith(`${href}/`) ||
        submenu.some((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`))
      );
    }
    return pathname === href || pathname?.startsWith(`${href}/`) || false;
  };

  const isContactActive = isActive('/contact');

  const isHighlighted = (index: number, active: boolean) =>
    active || hoveredIndex === index || openDropdownIndex === index;

  const isDropdownOpen = (index: number) =>
    hoveredIndex === index || openDropdownIndex === index;

  const navItemClass = (highlighted: boolean) =>
    `relative z-10 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
      highlighted
        ? 'bg-white text-gray-900 font-bold shadow-sm'
        : 'text-white/90 hover:bg-white/15 hover:text-white'
    }`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    
    router.push(`/packages?search=${encodeURIComponent(searchQuery)}`);
    
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${useSolidNav
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
            <div className="relative flex items-center gap-1 rounded-full px-2 py-1.5 bg-black/55 backdrop-blur-md border border-white/10 shadow-lg">
              {navigation.map((item, index) => {
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (pathname === '/' && item.href === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                };

                const active = isActive(item.href, item.submenu, item.packageGroups);
                const highlighted = isHighlighted(index, active);

                if (item.packageGroups?.length) {
                  const dropdownOpen = isDropdownOpen(index);

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setOpenDropdownIndex(index);
                        setHoveredPackageGroup(item.packageGroups![0].slug);
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setOpenDropdownIndex(null);
                        setHoveredPackageGroup(null);
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        aria-expanded={dropdownOpen}
                        className={`${navItemClass(highlighted)} inline-flex items-center gap-1`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            dropdownOpen ? 'rotate-180' : ''
                          } ${highlighted ? 'text-gray-700' : ''}`}
                        />
                      </Link>
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60] transition-all duration-200 ${
                          dropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible translate-y-1 pointer-events-none'
                        }`}
                      >
                        <div className="flex rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                          <div className="min-w-[200px] py-2">
                            {item.packageGroups.map((group) => (
                              <div
                                key={group.slug}
                                className={`flex items-center justify-between px-4 py-2.5 text-sm font-semibold cursor-default transition-colors ${
                                  hoveredPackageGroup === group.slug
                                    ? groupHoverStyles[group.slug] ?? 'bg-gray-50 text-gray-800'
                                    : 'text-gray-800 hover:bg-gray-50'
                                }`}
                                onMouseEnter={() => setHoveredPackageGroup(group.slug)}
                              >
                                <span>{group.label}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            ))}
                            <Link
                              href="/packages"
                              onClick={() => {
                                setOpenDropdownIndex(null);
                                setHoveredIndex(null);
                              }}
                              className="block px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#bd9245] hover:bg-[#bd9245]/5 border-t border-gray-100 mt-1"
                            >
                              View All Packages
                            </Link>
                          </div>
                          {hoveredPackageGroup && (
                            <div className="min-w-[320px] max-w-[360px] border-l border-gray-100 py-2 bg-white max-h-[420px] overflow-y-auto">
                              {item.packageGroups
                                .find((g) => g.slug === hoveredPackageGroup)
                                ?.items.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => {
                                      setOpenDropdownIndex(null);
                                      setHoveredIndex(null);
                                      setHoveredPackageGroup(null);
                                    }}
                                    className={`flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors ${
                                      pathname === sub.href
                                        ? 'bg-[#bd9245]/10 text-[#bd9245] font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#bd9245]'
                                    }`}
                                  >
                                    <span>{sub.label}</span>
                                    {sub.isFuture && (
                                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                                        Future
                                      </span>
                                    )}
                                  </Link>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.submenu?.length) {
                  const dropdownOpen = isDropdownOpen(index);

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setOpenDropdownIndex(index);
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        setOpenDropdownIndex(null);
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        aria-expanded={dropdownOpen}
                        className={`${navItemClass(highlighted)} inline-flex items-center gap-1`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            dropdownOpen ? 'rotate-180' : ''
                          } ${highlighted ? 'text-gray-700' : ''}`}
                        />
                      </Link>
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 z-[60] transition-all duration-200 ${
                          dropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible translate-y-1 pointer-events-none'
                        }`}
                      >
                        <div className="min-w-[260px] rounded-xl bg-white shadow-2xl border border-gray-100 py-1.5 overflow-hidden">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => {
                                setOpenDropdownIndex(null);
                                setHoveredIndex(null);
                              }}
                              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                                pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
                                  ? 'bg-[#bd9245]/10 text-[#bd9245] font-semibold'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#bd9245]'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleClick}
                    aria-current={active ? 'page' : undefined}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={navItemClass(highlighted)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                aria-current={isContactActive ? 'page' : undefined}
                onMouseEnter={() => setContactHovered(true)}
                onMouseLeave={() => setContactHovered(false)}
                className={navItemClass(isContactActive || contactHovered)}
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
                  className={`${useSolidNav ? 'text-gray-700' : 'text-white'} hover:bg-white/10`}
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
            className={`lg:hidden p-2 rounded-md ${useSolidNav ? 'text-gray-700' : 'text-white'}`}
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
              <div key={item.name}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href, item.submenu, item.packageGroups) ? 'page' : undefined}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href, item.submenu, item.packageGroups)
                      ? 'bg-primary text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => !item.submenu?.length && setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.packageGroups?.map((group) => (
                  <div key={group.slug}>
                    <p className="pl-6 pr-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {group.label}
                    </p>
                    {group.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`block pl-10 pr-4 py-2 text-sm rounded-lg transition-colors ${
                          pathname === sub.href
                            ? 'text-[#bd9245] font-semibold bg-[#bd9245]/5'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.label}
                        {sub.isFuture ? ' (Future)' : ''}
                      </Link>
                    ))}
                  </div>
                ))}
                {!item.packageGroups?.length &&
                  item.submenu?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block pl-8 pr-4 py-2 text-sm rounded-lg transition-colors ${
                      pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
                        ? 'text-[#bd9245] font-semibold bg-[#bd9245]/5'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
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
