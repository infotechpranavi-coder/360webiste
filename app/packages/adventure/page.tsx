'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Search, Mountain, Camera, Heart, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Package {
  _id: string;
  title: string;
  subtitle: string;
  about: string;
  services: string[] | string;
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
  packageType: string;
  place: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  bookings: number;
  rating: number;
  packageCategory?: string;
}

interface FilterState {
  searchTerm: string;
  priceRange: [number, number];
  durationRange: [number, number];
  location: string;
  departureCity: string[];
  tourType: string[];
  departBetween: {
    startDate: string;
    endDate: string;
  };
}

const AdventureActivitiesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    priceRange: [0, 20000],
    durationRange: [1, 30],
    location: "all",
    departureCity: [],
    tourType: [],
    departBetween: {
      startDate: "",
      endDate: ""
    }
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam) {
      setFilters(prev => ({
        ...prev,
        searchTerm: searchParam
      }));
    }

    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, filters]);

  useEffect(() => {
    if (filters.searchTerm !== undefined) {
      fetchPackages();
    }
  }, [filters.searchTerm]);


  const fetchPackages = async () => {
    try {
      // First, try to seed packages if database is empty
      try {
        await fetch('/api/packages/seed', { method: 'POST' });
      } catch (seedError) {
        console.log('Seed attempt completed or failed:', seedError);
      }

      const baseUrl = '/api/packages';
      const searchParam = filters.searchTerm ? `?search=${encodeURIComponent(filters.searchTerm)}` : '';
      const url = `${baseUrl}${searchParam}`;

      const response = await fetch(url);
      const result = await response.json();
      if (result.success && result.data) {
        // Filter STRICTLY for adventure packages (packageCategory must be 'Adventure' or 'adventure')
        let adventurePackages = result.data.filter((pkg: Package) =>
          pkg.packageCategory && (
            pkg.packageCategory === 'Adventure' ||
            pkg.packageCategory === 'adventure'
          )
        );

        setPackages(adventurePackages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    if (filters.searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pkg.about.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(pkg =>
      pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1]
    );

    filtered = filtered.filter(pkg => {
      const durationText = pkg.duration.toLowerCase();
      const durationMatch = durationText.match(/(\d+)\s*(?:days?|nights?|day|night)/);
      if (durationMatch) {
        const duration = parseInt(durationMatch[1]);
        return duration >= filters.durationRange[0] && duration <= filters.durationRange[1];
      }
      const fallbackMatch = durationText.match(/(\d+)/);
      if (fallbackMatch) {
        const duration = parseInt(fallbackMatch[1]);
        return duration >= filters.durationRange[0] && duration <= filters.durationRange[1];
      }
      return true;
    });

    if (filters.location !== "all") {
      filtered = filtered.filter(pkg => {
        if (filters.location === "domestic") {
          return pkg.packageType === 'domestic';
        }
        return pkg.place?.toLowerCase() === filters.location.toLowerCase();
      });
    }

    if (filters.tourType.length > 0) {
      filtered = filtered.filter(pkg => {
        const packageText = (pkg.title + ' ' + pkg.subtitle + ' ' + pkg.about).toLowerCase();
        return filters.tourType.some(type =>
          packageText.includes(type.toLowerCase())
        );
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading adventure activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-20 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda2d32bd4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/60 to-green-900/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-md text-white border-white/30">
              <Mountain className="h-4 w-4 mr-2" />
              Adventure Activities
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Dubai Adventure Activities
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-90">
              Thrilling experiences, outdoor adventures, and adrenaline-pumping activities
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-md">
                <Zap className="h-4 w-4 mr-2" />
                Extreme Sports
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-md">
                <Mountain className="h-4 w-4 mr-2" />
                Outdoor Adventures
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div>
              {filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1e1f44] mb-2">No adventure activities found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                  <Button onClick={() => {
                    setFilters({
                      searchTerm: "",
                      priceRange: [0, 50000],
                      durationRange: [1, 30],
                      location: "all",
                      departureCity: [],
                      tourType: [],
                      departBetween: {
                        startDate: "",
                        endDate: ""
                      }
                    });
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1e1f44]">
                      Adventure Activities
                    </h2>
                    <div className="text-sm text-gray-600">
                      {filteredPackages.length} activit{filteredPackages.length !== 1 ? 'ies' : 'y'} found
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg) => (
                      <Card key={pkg._id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-500/20">
                        <div className="relative">
                          {pkg.images && pkg.images.length > 0 ? (
                            <div className="aspect-video relative">
                              <Image
                                src={pkg.images[0].url}
                                alt={pkg.images[0].alt || pkg.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-gray-200 flex items-center justify-center">
                              <Mountain className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-white text-[#1e1f44] font-bold">
                            {formatPrice(pkg.price)}
                          </Badge>
                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold">
                            <Mountain className="h-3 w-3 mr-1" />
                            Adventure
                          </Badge>
                        </div>

                        <CardHeader>
                          <CardTitle className="text-xl">{pkg.title}</CardTitle>
                          <p className="text-gray-600">{pkg.subtitle}</p>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {pkg.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              {pkg.duration}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              {pkg.capacity}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                              {pkg.rating}/5
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                            {pkg.about}
                          </p>

                          <div className="mt-6 flex space-x-2">
                            <Link href={`/packages/${pkg._id}`} className="flex-1">
                              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                                View Details
                              </Button>
                            </Link>
                            <Link href="/contact" className="flex-1">
                              <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
                                Book Now
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Adventure Activities Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Adventure Activities?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the thrill of Dubai with exciting outdoor activities and extreme sports
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Adrenaline Rush
                </h3>
                <p className="text-gray-300">
                  Skydiving, dune bashing, water sports, and extreme activities for thrill-seekers
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Mountain className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Outdoor Exploration
                </h3>
                <p className="text-gray-300">
                  Desert safaris, hiking trails, and nature experiences in Dubai's stunning landscapes
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Unforgettable Memories
                </h3>
                <p className="text-gray-300">
                  Capture amazing moments with professional photography and unique experiences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Explore More Options
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Check out our Regular, Premium, and Luxury packages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages/regular">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  View Regular Packages
                </Button>
              </Link>
              <Link href="/packages/premium">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  View Premium Packages
                </Button>
              </Link>
              <Link href="/packages/luxury">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  View Luxury Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdventureActivitiesPage;

