'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, Star, Search, Filter, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Package {
  _id: string;
  title: string;
  subtitle: string;
  about: string;
  services: string[];
  tourDetails: string;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  price: number;
  duration: string;
  location: string;
  capacity: string;
  packageCategory: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  bookings: number;
  rating: number;
}

const PackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    // Check for URL query parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const locationParam = urlParams.get('location');
    const categoryParam = urlParams.get('category');

    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (locationParam) {
      setLocationFilter(locationParam);
    }
    if (categoryParam) {
      setCategoryFilter(categoryParam);
    }

    // Fetch packages with the search parameter from URL
    const fetchInitialPackages = async () => {
      try {
        const url = searchParam ? `/api/packages?search=${encodeURIComponent(searchParam)}` : '/api/packages';
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
          setPackages(result.data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPackages();
  }, []);

  // Refetch packages when searchTerm changes
  useEffect(() => {
    if (searchTerm !== undefined) { // Only fetch if searchTerm has been initialized
      fetchPackages();
    }
  }, [searchTerm]);

  // Simple URL parameter check on mount (since we use force refresh now)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, []); // Run only on mount

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm, priceFilter, durationFilter, locationFilter, categoryFilter]);

  const fetchPackages = async () => {
    try {
      // Build URL with search parameter if searchTerm exists
      const url = searchTerm ? `/api/packages?search=${encodeURIComponent(searchTerm)}` : '/api/packages';
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setPackages(result.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    // Price filter
    if (priceFilter !== "all") {
      filtered = filtered.filter(pkg => {
        switch (priceFilter) {
          case "under-50k":
            return pkg.price < 50000;
          case "50k-100k":
            return pkg.price >= 50000 && pkg.price < 100000;
          case "100k-200k":
            return pkg.price >= 100000 && pkg.price < 200000;
          case "over-200k":
            return pkg.price >= 200000;
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (durationFilter !== "all") {
      filtered = filtered.filter(pkg => {
        const duration = pkg.duration.toLowerCase();
        switch (durationFilter) {
          case "short":
            return duration.includes("3") || duration.includes("4") || duration.includes("5");
          case "medium":
            return duration.includes("6") || duration.includes("7") || duration.includes("8") || duration.includes("9") || duration.includes("10");
          case "long":
            return duration.includes("11") || duration.includes("12") || duration.includes("14") || duration.includes("15");
          default:
            return true;
        }
      });
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(pkg =>
        pkg.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(pkg => pkg.packageCategory === categoryFilter);
    }

    setFilteredPackages(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const generateSlug = (title: string, id: string) => {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-28 md:py-40 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)]" />
        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#faf8f3] to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-6">
              Curated Experiences
            </p>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-[1000] mb-6 leading-none tracking-tighter uppercase">
              Tour Packages
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto font-medium">
              Discover amazing destinations with our carefully crafted tour packages
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm font-bold uppercase tracking-widest">
              <span>{packages.length} Packages Available</span>
              <span className="text-white/30">·</span>
              <span>Best Price Guarantee</span>
              <span className="text-white/30">·</span>
              <span>Expert Guided</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50k">Under ZAR 50,000</SelectItem>
                  <SelectItem value="50k-100k">ZAR 50,000 - ZAR 1,00,000</SelectItem>
                  <SelectItem value="100k-200k">ZAR 1,00,000 - ZAR 2,00,000</SelectItem>
                  <SelectItem value="over-200k">Over ZAR 2,00,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Duration Filter */}
              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="short">Short (3-5 days)</SelectItem>
                  <SelectItem value="medium">Medium (6-10 days)</SelectItem>
                  <SelectItem value="long">Long (11+ days)</SelectItem>
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="bhutan">Bhutan</SelectItem>
                  <SelectItem value="tibet">Tibet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-[#faf8f3]">
        <div className="container mx-auto px-4">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-[#1e1f44] mb-2 uppercase tracking-tighter">No packages found</h3>
              <p className="text-gray-400 mb-8 font-medium">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("all");
                  setDurationFilter("all");
                  setLocationFilter("all");
                  setCategoryFilter("all");
                }}
                className="bg-[#bd9245] hover:bg-[#a07835] text-white font-bold px-8 py-3 rounded-full"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl md:text-5xl font-[1000] text-[#1e1f44] uppercase tracking-tighter leading-none">
                  {filteredPackages.length} Package{filteredPackages.length !== 1 ? 's' : ''}<br />
                  <span className="text-[#bd9245]">Found</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
                  <Filter className="h-4 w-4" />
                  <span>Filtered results</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg._id}
                    className="group bg-white rounded-[32px] overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.1)] transition-all duration-700 cursor-pointer flex flex-col"
                    onClick={() => router.push(`/packages/${generateSlug(pkg.title, pkg._id)}`)}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-[220px] flex-shrink-0 overflow-hidden">
                      {pkg.images && pkg.images.length > 0 ? (
                        <Image
                          src={pkg.images[0].url}
                          alt={pkg.images[0].alt || pkg.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <MapPin className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Info Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                          {pkg.duration} &nbsp;·&nbsp; {pkg.location}
                        </p>
                        <h3 className="text-xl font-black text-[#1e1f44] leading-tight mb-2 uppercase tracking-tighter group-hover:text-gray-900 transition-colors duration-300">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.round(pkg.rating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                            />
                          ))}
                          <span className="text-[10px] font-bold text-gray-300 ml-1">{pkg.bookings || 0} Bookings</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                          {pkg.subtitle || pkg.about}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#1e1f44] tracking-tighter">{formatPrice(pkg.price)}</span>
                          <span className="text-xs font-bold text-gray-300">/ person</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-[360deg] shadow-md">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              We can create a custom package tailored to your specific needs and preferences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link href="/packages/domestic">
                <Button size="lg" variant="outline" className="border-white bg-white text-gray-900 hover:bg-transparent hover:text-white font-bold flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  View Domestic Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;

