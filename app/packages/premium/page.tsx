'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Search, Mountain, Camera, Heart, Crown, CheckCircle2, Phone, Shield, Globe, Sparkles, X, Calendar, Building2, Car, Ticket, UtensilsCrossed, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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

const PremiumPackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    // Ensure we're on the client side
    if (typeof window === 'undefined') return;

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const searchParam = urlParams.get('search');

      if (searchParam) {
        setFilters(prev => ({
          ...prev,
          searchTerm: searchParam
        }));
      }
    } catch (error) {
      console.error('Error parsing URL params:', error);
    }

    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, filters]);

  useEffect(() => {
    // Only fetch if searchTerm is explicitly set (not undefined)
    // This prevents infinite loops
    if (filters.searchTerm !== undefined && filters.searchTerm !== '') {
      fetchPackages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchTerm]);


  const getDefaultPremiumPackages = (): Package[] => [
    {
      _id: 'premium-dubai-tours-default',
      title: 'Dubai Signature Private Escape',
      subtitle: '3 Nights / 4 Days Premium Private Tour Package',
      about: 'The Dubai Signature Private Escape is a carefully crafted premium short-stay itinerary designed for travelers who want to experience Dubai in comfort, privacy, and style.',
      services: [],
      tourDetails: '',
      itinerary: [],
      price: 0,
      duration: '3 Nights / 4 Days',
      location: 'Dubai, UAE',
      capacity: 'Up to 6 guests per vehicle',
      packageType: 'premium',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 5,
      packageCategory: 'premium'
    },
    {
      _id: 'dubai-private-classic-discovery',
      title: 'Dubai Private Classic Discovery',
      subtitle: '4 Nights / 5 Days Premium Private Tour Package',
      about: 'The Dubai Signature Escape – 4 Nights / 5 Days is a carefully curated premium Dubai tour designed for travelers who value privacy, comfort, flexibility, and refined experiences. This journey blends Dubai\'s iconic landmarks with exclusive private services, allowing guests to experience the city at a relaxed, unhurried pace.',
      services: [],
      tourDetails: 'This 4 Nights / 5 Days Premium Dubai Tour is designed as a complete introduction to Dubai, combining modern landmarks, cultural attractions, leisure experiences, and signature luxury elements. The itinerary follows a logical flow, avoiding rushed days and overcrowded schedules.',
      itinerary: [
        { day: 1, title: 'Arrival in Dubai & Private Yacht Dinner Cruise', description: 'Upon arrival at Dubai International Airport, guests are warmly received by our professional representative and escorted to a private vehicle for a smooth transfer to the hotel. In the evening, enjoy a private yacht dinner cruise at Dubai Marina, offering a relaxed introduction to the city\'s skyline.' },
        { day: 2, title: 'Private Dubai City Tour & Iconic Landmarks', description: 'After breakfast, embark on a private Dubai city tour, covering both Old and New Dubai. Highlights include drive through Sheikh Zayed Road, photo stops at Burj Al Arab and Jumeirah landmarks, visit to Burj Khalifa (optional ticket), leisure time at Dubai Mall, and visit to Dubai Aquarium & Underwater Zoo (optional ticket).' },
        { day: 3, title: 'Dubai Frame, Miracle Garden & Evening Entertainment', description: 'Today focuses on Dubai\'s creative and cultural attractions. Morning visits include Dubai Frame, Miracle Garden, and Butterfly Garden. In the evening, choose between Global Village or Ain Dubai Ferris Wheel experience for city views.' },
        { day: 4, title: 'Dolphin Show, Limousine Ride & Private Desert Safari', description: 'Begin the day with a visit to a dolphin show at Dubai Creek. Later, enjoy a one-hour private limousine ride. In the afternoon, proceed for a private desert safari in a 4x4 vehicle with dune bashing, sandboarding, camel rides, and a premium desert camp experience with BBQ dinner and live entertainment.' },
        { day: 5, title: 'Departure', description: 'After breakfast, enjoy a relaxed morning before your private transfer to the airport for departure, concluding a thoughtfully planned premium Dubai journey.' }
      ],
      price: 0,
      duration: '4 Nights / 5 Days',
      location: 'Dubai, UAE',
      capacity: 'Up to 6 guests per vehicle',
      packageType: 'premium',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 5,
      packageCategory: 'premium'
    },
    {
      _id: 'dubai-elite-grand-explorer',
      title: 'Dubai Elite Grand Explorer',
      subtitle: '6 Nights / 7 Days Premium Private Dubai & UAE Tour',
      about: 'The Dubai Elite Grand Explorer – 6 Nights / 7 Days Premium Tour is a comprehensive private travel experience designed for travelers who want to explore Dubai beyond the basics while also discovering neighboring Emirates in comfort and privacy.',
      services: [],
      tourDetails: '',
      itinerary: [],
      price: 0,
      duration: '6 Nights / 7 Days',
      location: 'Dubai, UAE',
      capacity: 'Up to 6 guests per vehicle',
      packageType: 'premium',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' }
      ],
      bookings: 0,
      rating: 5,
      packageCategory: 'premium'
    },
    {
      _id: 'dubai-grand-signature-journey',
      title: 'Dubai Grand Signature Journey',
      subtitle: '5 Nights / 6 Days Premium Private Dubai Tour',
      about: 'The Dubai Grand Signature Journey – 5 Nights / 6 Days is a refined private Dubai travel experience designed for travelers who want more time, more depth, and more flexibility while exploring the UAE.',
      services: [],
      tourDetails: '',
      itinerary: [],
      price: 0,
      duration: '5 Nights / 6 Days',
      location: 'Dubai, UAE',
      capacity: 'Up to 6 guests per vehicle',
      packageType: 'premium',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' }
      ],
      bookings: 0,
      rating: 5,
      packageCategory: 'premium'
    },
  ];

  const fetchPackages = async () => {
    try {
      // Ensure we're on the client side
      if (typeof window === 'undefined') {
        setPackages(getDefaultPremiumPackages());
        setLoading(false);
        return;
      }

      // First, try to seed packages if database is empty
      try {
        await fetch('/api/packages/seed', { method: 'POST' });
      } catch (seedError) {
        console.log('Seed attempt completed or failed:', seedError);
      }

      const baseUrl = '/api/packages';
      const searchParam = filters.searchTerm ? `?search=${encodeURIComponent(filters.searchTerm)}` : '';
      const url = `${baseUrl}${searchParam}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Filter STRICTLY for premium packages (packageCategory must be 'Premium' or 'premium')
        let premiumPackages = result.data.filter((pkg: Package) =>
          pkg.packageCategory && (
            pkg.packageCategory === 'Premium' ||
            pkg.packageCategory === 'premium'
          )
        );

        setPackages(premiumPackages);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
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
          <p className="text-gray-600">Loading premium packages...</p>
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
            backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-md text-white border-white/30">
              <Crown className="h-4 w-4 mr-2" />
              Premium Packages
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 font-playfair tracking-tight">
              Premium Dubai Tour Packages
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-90 font-poppins font-light tracking-wide">
              Enhanced comfort, personalized service, and exclusive experiences
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Crown className="h-4 w-4 mr-2" />
                Premium Service
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Exclusive Access
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Dubai Tours Introduction Section - Modern Design */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none px-6 py-2 text-sm font-semibold shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Premium Dubai Tours
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-[#1e1f44] leading-tight font-playfair tracking-tight">
                Discover Dubai with a <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Local Tour Operating Company</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1f44] mb-4 font-cormorant tracking-wide">Refined Experiences</h3>
                  <p className="text-gray-700 leading-relaxed text-lg font-poppins font-light">
                    Discover Dubai with a local tour operating company, Premium Dubai Tours. We are a Dubai-based travel agency committed to delivering refined, comfortable, and trustworthy travel experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Star className="h-8 w-8 text-white fill-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1f44] mb-4 font-cormorant tracking-wide">Beyond Standard</h3>
                  <p className="text-gray-700 leading-relaxed text-lg font-poppins font-light">
                    Our premium tours go beyond standard sightseeing, focusing on personalized attention, transparent pricing, and reliable service designed for travelers who value quality and peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-8 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div>
              {filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1e1f44] mb-2">No premium packages found</h3>
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
                    <h2 className="text-2xl font-bold text-[#1e1f44] font-playfair tracking-tight">
                      Premium Packages
                    </h2>
                    <div className="text-sm text-gray-600">
                      {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg) => (
                      <Card
                        key={pkg._id}
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-amber-500/30"
                      >
                        <div className="relative">
                          {pkg.images && pkg.images.length > 0 ? (
                            <div className="aspect-video relative overflow-hidden">
                              <Image
                                src={pkg.images[0].url}
                                alt={pkg.images[0].alt || pkg.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>
                          ) : (
                            <div className="aspect-video bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                              <Crown className="h-12 w-12 text-amber-600" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#1e1f44] font-semibold shadow-lg">
                            {pkg.price > 0 ? formatPrice(pkg.price) : 'Custom Pricing'}
                          </Badge>
                          <Badge className="absolute top-4 left-4 bg-amber-500 text-white shadow-lg">
                            Premium
                          </Badge>
                          {pkg.images && pkg.images.length > 1 && (
                            <Badge className="absolute bottom-4 right-4 bg-black/50 text-white backdrop-blur-sm">
                              <Camera className="h-3 w-3 mr-1" />
                              {pkg.images.length} Photos
                            </Badge>
                          )}
                        </div>

                        <CardHeader>
                          <CardTitle className="text-xl font-cormorant tracking-wide group-hover:text-amber-600 transition-colors">{pkg.title}</CardTitle>
                          <p className="text-gray-600 font-poppins font-light">{pkg.subtitle}</p>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                              {pkg.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-amber-500" />
                              {pkg.duration}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2 text-amber-500" />
                              {pkg.capacity}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-4 w-4 mr-2 text-amber-500 fill-amber-500" />
                              {pkg.rating}/5
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mt-4 line-clamp-3 font-poppins font-light">
                            {pkg.about}
                          </p>

                          <div className="mt-6">
                            <Link href={`/packages/${pkg._id}`} className="block">
                              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                                View Full Details
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

      {/* What Are Premium Dubai Tours Section - Modern Split Layout */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Card className="relative border-2 border-amber-500/10 bg-gradient-to-br from-white to-amber-50/30 p-8 shadow-xl">
                  <CardContent className="p-0">
                    <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-1">
                      What We Offer
                    </Badge>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#1e1f44] leading-tight font-playfair tracking-tight">
                      What Are Premium Dubai Tours?
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed font-poppins font-light tracking-wide">
                      Premium Dubai Tours are carefully crafted journeys that prioritize your comfort, time, and enjoyment. Whether you're visiting Dubai for the first time or returning to explore more deeply, our tours provide a thoughtful alternative to mass-market packages, blending iconic landmarks with authentic local insights.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-500/10 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1e1f44] mb-2 font-cormorant tracking-wide">Time Well Spent</h4>
                    <p className="text-gray-600 font-poppins font-light">Every moment is carefully planned to maximize your enjoyment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-500/10 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <Heart className="h-6 w-6 text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1e1f44] mb-2 font-cormorant tracking-wide">Comfort First</h4>
                    <p className="text-gray-600 font-poppins font-light">Your comfort and satisfaction are our top priorities</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-500/10 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#1e1f44] mb-2 font-cormorant tracking-wide">Authentic Insights</h4>
                    <p className="text-gray-600 font-poppins font-light">Experience Dubai through the eyes of locals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Choose Premium Dubai Tours - Modern Grid */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-amber-50/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-1">
                Perfect For You
              </Badge>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e1f44] font-playfair tracking-tight">
                Who Should Choose Premium Dubai Tours?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins font-light tracking-wide">
                Our tours are ideal for travelers who value:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  icon: Users,
                  title: "Comfort over compromise",
                  description: "Enjoy private or small-group settings instead of crowded buses"
                },
                {
                  icon: Phone,
                  title: "Clear communication",
                  description: "Upfront pricing, detailed itineraries, and responsive support"
                },
                {
                  icon: Shield,
                  title: "Professional service",
                  description: "Experienced guides, punctual pickups, and well-maintained vehicles"
                },
                {
                  icon: Globe,
                  title: "Flexibility",
                  description: "The ability to adjust plans based on your interests and pace"
                }
              ].map((item, index) => (
                <Card key={index} className="group border-2 border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl bg-white overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-[#1e1f44] mb-3 group-hover:text-amber-600 transition-colors font-cormorant tracking-wide">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-lg font-poppins font-light">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Card className="inline-block border-2 border-amber-500/20 bg-gradient-to-r from-amber-50 to-white p-8 shadow-xl">
                <CardContent className="p-0">
                  <p className="text-xl font-semibold text-[#1e1f44] italic font-cormorant tracking-wide">
                    "If you prefer structure without rigidity and quality without unnecessary extras, Premium Dubai Tours are designed for you."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Premium Tours Different - Modern Feature Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-amber-500/10 text-amber-600 border-amber-500/20 px-4 py-1">
                Our Difference
              </Badge>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e1f44] font-playfair tracking-tight">
                What Makes Premium Tours Different?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins font-light tracking-wide">
                Unlike budget or mass-market options, our customized Dubai tours focus on:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: Users, title: "Smaller group sizes", desc: "Private bookings for a more personal experience" },
                { icon: Phone, title: "Direct coordination", desc: "Dedicated team, not automated systems" },
                { icon: Shield, title: "Transparent inclusions", desc: "No hidden fees or surprise upsells" },
                { icon: Globe, title: "Curated itineraries", desc: "Balancing iconic landmarks and local culture" }
              ].map((item, index) => (
                <Card key={index} className="group text-center border-2 border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-amber-50/20">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <item.icon className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-[#1e1f44] mb-3 group-hover:text-amber-600 transition-colors font-cormorant tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-poppins font-light">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl blur opacity-25"></div>
              <Card className="relative border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-600/10 backdrop-blur-sm">
                <CardContent className="p-10 text-center">
                  <Crown className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-[#1e1f44] font-cormorant tracking-wide">
                    We don't aim to be the cheapest; we aim to be the most reliable and thoughtful choice.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Premium Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1f44] mb-4 font-playfair tracking-tight">
                Why Choose Premium Packages?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-poppins font-light tracking-wide">
                Enhanced experiences with superior comfort, personalized attention, and exclusive access
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
                  <Crown className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3 font-cormorant tracking-wide">
                  Premium Service
                </h3>
                <p className="text-gray-600 font-poppins font-light">
                  Professional guides, better vehicles, and enhanced comfort throughout your journey
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3 font-cormorant tracking-wide">
                  Exclusive Access
                </h3>
                <p className="text-gray-600 font-poppins font-light">
                  Skip-the-line access, VIP experiences, and curated itineraries
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3 font-cormorant tracking-wide">
                  Personalized Attention
                </h3>
                <p className="text-gray-600 font-poppins font-light">
                  Smaller groups and customized experiences tailored to your preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section - Modern List Design */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none px-6 py-2 text-sm font-semibold shadow-lg">
                Complete Package
              </Badge>
              <h3 className="text-4xl md:text-5xl font-bold mb-6 text-[#1e1f44] font-playfair tracking-tight">
                What's Included in Premium Dubai Tours?
              </h3>
              <p className="text-xl text-gray-600 font-poppins font-light tracking-wide">
                Every tour includes:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {[
                "Best Hotel/Resort accommodation as per your interest",
                "Professional, English-speaking guide (Other languages are available on request)",
                "Private or small-group transportation",
                "Entry tickets to attractions (where applicable)",
                "Complimentary refreshments and bottled water",
                "Flexible pickup and drop-off within United Arab Emirates"
              ].map((item, index) => (
                <Card key={index} className="group border-2 border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium leading-relaxed pt-1 font-poppins">
                        {item}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-amber-500/20 bg-gradient-to-r from-white to-amber-50/30">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                <p className="text-lg text-gray-700 leading-relaxed font-poppins font-light tracking-wide">
                  Additional services such as photography, dining reservations, or extended hours can be arranged based on your preferences.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customization and Assurance Section - Modern Split Cards */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="group border-2 border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-amber-50/20 overflow-hidden">
                <CardContent className="p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e1f44] font-playfair tracking-tight">
                      Customization and Personalized Service
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed font-poppins font-light tracking-wide">
                    Every traveler is unique. We tailor our luxury Dubai tours to fit your schedule, interests, and travel style. Whether you want a half-day overview or a multi-day itinerary, we work with you to create a seamless, enjoyable plan - never rushed or generic.
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-2 border-amber-500/10 hover:border-amber-500/30 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-white to-amber-50/20 overflow-hidden">
                <CardContent className="p-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e1f44] font-playfair tracking-tight">
                      Assurance of Quality and Professional Booking
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4 font-poppins font-light tracking-wide">
                    Premium Dubai Tours' booking process is straightforward, secure, and supported by a dedicated team ready to assist before, during, and after your trip.
                  </p>
                  <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <p className="text-lg text-[#1e1f44] font-semibold font-cormorant tracking-wide">
                      When you book with us, you're choosing a partner who respects your time and travel experience.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair tracking-tight">
              Explore More Options
            </h2>
            <p className="text-xl mb-8 opacity-90 font-poppins font-light tracking-wide">
              Check out our Regular and Luxury packages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages/regular">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-500">
                  View Regular Packages
                </Button>
              </Link>
              <Link href="/packages/luxury">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-500">
                  View Luxury Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Package Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedPackage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-playfair tracking-tight">
                  {selectedPackage.title}
                </DialogTitle>
                <DialogDescription className="text-lg font-poppins font-light">
                  {selectedPackage.subtitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Images Gallery */}
                {selectedPackage.images && selectedPackage.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-amber-500/20">
                        <Image
                          src={selectedPackage.images[0].url}
                          alt={selectedPackage.images[0].alt || selectedPackage.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {selectedPackage.images.length > 1 && (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedPackage.images.slice(1, 5).map((img, idx) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border-2 border-amber-500/20">
                              <Image
                                src={img.url}
                                alt={img.alt || `Image ${idx + 2}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Introduction Section */}
                <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-amber-50/50 to-white">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44]">
                      Introduction: A Refined Way to Experience Dubai
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      Dubai is a destination of contrast, futuristic skylines beside heritage neighborhoods, serene deserts just beyond bustling boulevards, and world-class attractions balanced by moments of quiet luxury. For travelers who prefer privacy, flexibility, and comfort over crowded itineraries, our Premium Dubai Tour Packages offer a thoughtfully curated way to explore the city and beyond.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light">
                      At Premium Dubai Tours, our premium category is designed for guests who want more than standard sightseeing. These packages focus on private transportation, exclusive experiences, and customizable schedules, ensuring every journey reflects your personal travel style. Whether you are traveling as a family, a honeymoon couple, or a small private group, our premium tours provide a relaxed and seamless way to discover Dubai and the UAE.
                    </p>
                  </CardContent>
                </Card>

                {/* What Are Premium Packages */}
                <Card className="border-2 border-amber-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Sparkles className="h-6 w-6 mr-2 text-amber-500" />
                      What Are Premium Dubai Tour Packages?
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      Premium Dubai Tour Packages are private, vehicle-based travel experiences created for guests who value discretion, space, and personalized service. Unlike regular group tours, these packages are priced per vehicle (up to 6 guests), but still other vehicles are available for a few numbers in a group and include only private tours and transfers.
                    </p>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      Each itinerary is designed with flexibility in mind. While we provide a professionally planned route covering Dubai's iconic landmarks, cultural attractions, and luxury experiences, every day can be customized to match your pace, interests, and priorities.
                    </p>
                    <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-cormorant text-lg font-semibold mb-3 text-[#1e1f44]">To offer maximum choice, our premium packages are available in three accommodation options:</h4>
                      <ul className="space-y-2 font-poppins font-light text-gray-700">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Without hotel accommodation</strong> – ideal for residents or travelers with pre-booked hotels</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>With 4-star hotel accommodation</strong> – comfort-focused, centrally located properties</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>With 5-star hotel accommodation</strong> – refined luxury and premium hospitality</span>
                        </li>
                      </ul>
                      <p className="mt-4 text-gray-700 font-poppins font-light">
                        Attraction tickets are intentionally not bundled by default, allowing us to arrange them later at discounted rates based on the final number of travelers and preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Who Should Choose */}
                <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-white to-amber-50/30">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Users className="h-6 w-6 mr-2 text-amber-500" />
                      Who Should Choose Premium Packages?
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      Our Premium Dubai Tour Packages are best suited for travelers who want a calm, controlled, and personalized travel experience.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-cormorant text-lg font-semibold mb-3 text-[#1e1f44]">These tours are ideal for:</h4>
                      <ul className="space-y-2 font-poppins font-light text-gray-700">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Families with children</strong>, seeking private vehicles and flexible schedules</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Honeymooners and couples</strong>, looking for privacy and special moments</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Small groups and friends</strong>, traveling together without mixing with strangers</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Business travelers</strong>, extending their stay with structured yet relaxed sightseeing</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Repeat visitors</strong>, wanting deeper exploration beyond standard tours</span>
                        </li>
                      </ul>
                      <p className="mt-4 text-gray-700 font-poppins font-light italic">
                        If you prefer traveling without rushing, standing in queues, or sharing space with large groups, the premium category is designed specifically for you.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Durations */}
                <Card className="border-2 border-amber-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-amber-500" />
                      Premium Package Durations Available
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      Our Premium Dubai Tour Packages are available in the following carefully structured durations:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { duration: '3 Nights / 4 Days', desc: 'A refined short escape covering Dubai\'s essentials with luxury experiences' },
                        { duration: '4 Nights / 5 Days', desc: 'A balanced itinerary with cultural, leisure, and iconic attractions' },
                        { duration: '5 Nights / 6 Days', desc: 'Dubai combined with Abu Dhabi and immersive experiences' },
                        { duration: '6 Nights / 7 Days', desc: 'A comprehensive UAE journey including Dubai, Abu Dhabi, and Sharjah' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-lg border border-amber-500/20">
                          <h4 className="font-cormorant font-semibold text-lg text-[#1e1f44] mb-2">{item.duration}</h4>
                          <p className="font-poppins font-light text-gray-700">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-gray-700 font-poppins font-light">
                      Each duration is designed to offer enough time to enjoy without feeling rushed, with optional rest periods and free time built into the itinerary.
                    </p>
                  </CardContent>
                </Card>

                {/* Experiences */}
                <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-white to-amber-50/30">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Sparkles className="h-6 w-6 mr-2 text-amber-500" />
                      Experiences That Define Our Premium Packages
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      While itineraries vary by duration, Premium Packages typically include a combination of the following private experiences:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        'Private airport and hotel transfers',
                        'Private Dubai city tour with modern and heritage landmarks',
                        'Burj Khalifa, Dubai Mall, and Aquarium visits (tickets optional)',
                        'Dubai Frame, Miracle Garden, and creative attractions',
                        'Private yacht dinner cruise at Dubai Marina',
                        'Private desert safari with premium camp and BBQ dinner',
                        'One-hour private limousine ride',
                        'Private Abu Dhabi city tour with one theme park option',
                        'Optional Sharjah cultural city tour',
                        'Evening entertainment such as Global Village or Ain Dubai'
                      ].map((exp, idx) => (
                        <div key={idx} className="flex items-start bg-white p-3 rounded-lg border border-amber-500/10">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="font-poppins font-light text-gray-700">{exp}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-gray-700 font-poppins font-light italic">
                      All experiences are arranged to maintain comfort, timing control, and exclusivity.
                    </p>
                  </CardContent>
                </Card>

                {/* Customization */}
                <Card className="border-2 border-amber-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Sparkles className="h-6 w-6 mr-2 text-amber-500" />
                      Customization & Flexibility
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      One of the defining features of our Premium Dubai Tour Packages is complete flexibility.
                    </p>
                    <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-cormorant text-lg font-semibold mb-3 text-[#1e1f44]">You can:</h4>
                      <ul className="space-y-2 font-poppins font-light text-gray-700">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Adjust daily start times</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Replace attractions with alternatives</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Add or remove experiences</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Upgrade vehicles or hotel categories</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Include special arrangements for celebrations or family needs</span>
                        </li>
                      </ul>
                      <p className="mt-4 text-gray-700 font-poppins font-light">
                        Our team works closely with you before arrival to fine-tune every detail, ensuring your itinerary aligns with your expectations.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Best Time to Visit */}
                <Card className="border-2 border-amber-500/20 bg-gradient-to-br from-white to-amber-50/30">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-amber-500" />
                      Best Time to Visit Dubai for Premium Travel
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      Dubai is a year-round destination, and our premium tours operate throughout the year.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-amber-500/20">
                        <h4 className="font-cormorant font-semibold text-lg text-[#1e1f44] mb-2">October to April</h4>
                        <p className="font-poppins font-light text-gray-700">Offers pleasant weather, ideal for outdoor sightseeing and evening activities.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-amber-500/20">
                        <h4 className="font-cormorant font-semibold text-lg text-[#1e1f44] mb-2">May to September</h4>
                        <p className="font-poppins font-light text-gray-700">Provides more competitive pricing, with tours designed around indoor attractions and evening experiences to avoid peak heat.</p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700 font-poppins font-light">
                      Regardless of season, private vehicles and flexible schedules ensure comfort at all times.
                    </p>
                  </CardContent>
                </Card>

                {/* Why Choose */}
                <Card className="border-2 border-amber-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-playfair tracking-tight mb-4 text-[#1e1f44] flex items-center">
                      <Shield className="h-6 w-6 mr-2 text-amber-500" />
                      Why Choose Premium Dubai Tours for Premium Packages?
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-poppins font-light mb-4">
                      We focus on service reliability rather than exaggerated promises.
                    </p>
                    <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-500/20">
                      <h4 className="font-cormorant text-lg font-semibold mb-3 text-[#1e1f44]">Here is what sets us apart:</h4>
                      <ul className="space-y-2 font-poppins font-light text-gray-700">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Private-only experiences with no shared transport</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Per-vehicle pricing, offering better value for families and groups</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Local operational expertise with on-ground support</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Discounted attraction tickets, arranged after final confirmation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Transparent inclusions and exclusions, with no hidden costs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>Professional field staff and licensed operations</span>
                        </li>
                      </ul>
                      <p className="mt-4 text-gray-700 font-poppins font-light italic">
                        Our approach is calm, clear, and service-oriented, designed for travelers who appreciate structure without pressure.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/contact" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg py-6">
                      <Phone className="h-5 w-5 mr-2" />
                      Book Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 text-lg py-6"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumPackagesPage;

