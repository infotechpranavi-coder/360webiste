'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Users, Star, Search, Globe, Plane, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  reviews?: Array<{
    name: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  bookings: number;
  rating: number;
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

const InternationalPackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    priceRange: [0, 20000],
    durationRange: [1, 30],
    location: "international",
    departureCity: [],
    tourType: [],
    departBetween: {
      startDate: "",
      endDate: ""
    }
  });
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    // Check for URL query parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    console.log('Initial mount, search param:', searchParam);

    if (searchParam) {
      console.log('Setting initial search term:', searchParam);
      setFilters(prev => ({
        ...prev,
        searchTerm: searchParam
      }));
    }

    // Fetch packages after setting search term
    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, filters, selectedDestination]);

  // Refetch packages when searchTerm changes
  useEffect(() => {
    if (filters.searchTerm !== undefined) { // Only fetch if searchTerm has been initialized
      fetchPackages();
    }
  }, [filters.searchTerm]);

  // Simple URL parameter check on mount (since we use force refresh now)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam && searchParam !== filters.searchTerm) {
      setFilters(prev => ({
        ...prev,
        searchTerm: searchParam
      }));
    }
  }, []); // Run only on mount


  const fetchPackages = async () => {
    try {
      // Build URL with search parameter if searchTerm exists
      const baseUrl = '/api/packages';
      const searchParam = filters.searchTerm ? `?search=${encodeURIComponent(filters.searchTerm)}` : '';
      const url = `${baseUrl}${searchParam}`;

      const response = await fetch(url);
      const result = await response.json();
      console.log('API Response:', result);
      if (result.success) {
        console.log('All packages:', result.data);
        // Filter for international packages based on packageType and legacy destinations
        const internationalPackages = result.data.filter((pkg: Package) => {
          const isInternational = pkg.packageType === 'international' ||
            pkg.place === 'nepal' ||
            pkg.place === 'bhutan' ||
            pkg.place === 'dubai' ||
            pkg.place === 'vietnam' ||
            pkg.place === 'sri-lanka' ||
            pkg.place === 'bali' ||
            pkg.place === 'malaysia' ||
            pkg.place === 'singapore';
          console.log(`Package ${pkg.title}: packageType=${pkg.packageType}, place=${pkg.place}, isInternational=${isInternational}`);
          return isInternational;
        });
        console.log('Filtered international packages:', internationalPackages);

        // If no international packages found, create sample data for demonstration
        if (internationalPackages.length === 0) {
          console.log('No international packages found, creating sample data');
          const samplePackages: Package[] = [
            {
              _id: 'sample-bhutan',
              title: 'Best of BHUTAN',
              subtitle: 'Phuentsholing â†’ Thimphu â†’ Punakha â†’ Paro â†’ Tiger\'s Nest Hike',
              about: 'Experience the mystical kingdom of Bhutan with its stunning monasteries, breathtaking landscapes, and rich cultural heritage.',
              services: ['Accommodation', 'Meals', 'Transportation', 'Guide'],
              tourDetails: '6N/7D tour covering major attractions',
              itinerary: [
                { day: 1, title: 'Arrival in Phuentsholing', description: 'Arrive and explore the border town' },
                { day: 2, title: 'Drive to Thimphu', description: 'Capital city exploration' },
                { day: 3, title: 'Thimphu to Punakha', description: 'Visit Punakha Dzong' },
                { day: 4, title: 'Punakha to Paro', description: 'Travel to Paro valley' },
                { day: 5, title: 'Tiger\'s Nest Hike', description: 'Hike to the famous monastery' },
                { day: 6, title: 'Paro Exploration', description: 'Explore Paro town and local attractions' },
                { day: 7, title: 'Departure', description: 'Return journey' }
              ],
              price: 28999,
              duration: '6N/7D',
              location: 'Bhutan',
              capacity: 'Min 6 People',
              packageType: 'international',
              place: 'bhutan',
              images: [{ url: '/gallery_37b0b49.jpg', alt: 'Bhutan Monastery' }],
              bookings: 0,
              rating: 4.8
            },
            {
              _id: 'sample-nepal',
              title: 'Nepal Adventure',
              subtitle: 'Explore Kathmandu, Pokhara & Nagarkot',
              about: 'Discover the beauty of Nepal with its ancient temples, stunning mountain views, and rich cultural heritage.',
              services: ['Accommodation', 'Meals', 'Transportation', 'Guide'],
              tourDetails: '4N/5D tour covering major attractions',
              itinerary: [
                { day: 1, title: 'Arrival in Kathmandu', description: 'Arrive and explore the capital' },
                { day: 2, title: 'Kathmandu Sightseeing', description: 'Visit temples and cultural sites' },
                { day: 3, title: 'Drive to Pokhara', description: 'Travel to the lake city' },
                { day: 4, title: 'Pokhara Exploration', description: 'Explore Pokhara and nearby attractions' },
                { day: 5, title: 'Departure', description: 'Return journey' }
              ],
              price: 9999,
              duration: '4N/5D',
              location: 'Nepal',
              capacity: 'Min 4 People',
              packageType: 'international',
              place: 'nepal',
              images: [{ url: '/Nepal.webp', alt: 'Nepal Landscape' }],
              bookings: 0,
              rating: 4.6
            }
          ];
          setPackages(samplePackages);
        } else {
          setPackages(internationalPackages);
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pkg.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pkg.about.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(pkg =>
      pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1]
    );

    // Duration range filter - improved parsing
    filtered = filtered.filter(pkg => {
      const durationText = pkg.duration.toLowerCase();
      const durationMatch = durationText.match(/(\d+)\s*(?:days?|nights?|day|night)/);
      if (durationMatch) {
        const duration = parseInt(durationMatch[1]);
        return duration >= filters.durationRange[0] && duration <= filters.durationRange[1];
      }
      // Fallback: look for any number in duration
      const fallbackMatch = durationText.match(/(\d+)/);
      if (fallbackMatch) {
        const duration = parseInt(fallbackMatch[1]);
        return duration >= filters.durationRange[0] && duration <= filters.durationRange[1];
      }
      return true;
    });

    // Location filter - improved
    if (filters.location !== "all") {
      filtered = filtered.filter(pkg => {
        if (filters.location === "international") {
          return pkg.packageType === 'international' ||
            ['nepal', 'bhutan', 'dubai', 'vietnam', 'sri-lanka', 'bali', 'malaysia', 'singapore'].includes(pkg.place?.toLowerCase());
        }
        return pkg.place?.toLowerCase() === filters.location.toLowerCase();
      });
    }

    // Tour type filter - basic implementation
    if (filters.tourType.length > 0) {
      filtered = filtered.filter(pkg => {
        const packageText = (pkg.title + ' ' + pkg.subtitle + ' ' + pkg.about).toLowerCase();
        return filters.tourType.some(type =>
          packageText.includes(type.toLowerCase())
        );
      });
    }

    // Departure city filter - basic implementation
    if (filters.departureCity.length > 0) {
      filtered = filtered.filter(pkg => {
        // For now, we'll assume all packages are available from all cities
        // This can be enhanced when departure city data is available
        return true;
      });
    }

    // Date range filter - basic implementation
    if (filters.departBetween.startDate || filters.departBetween.endDate) {
      filtered = filtered.filter(pkg => {
        // For now, we'll assume all packages are available for all dates
        // This can be enhanced when departure date data is available
        return true;
      });
    }

    // Destination filter
    if (selectedDestination) {
      filtered = filtered.filter(pkg =>
        pkg.place?.toLowerCase() === selectedDestination.toLowerCase()
      );
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

  const popularCountries = [
    { name: "Bhutan", icon: Plane },
    { name: "Nepal", icon: Plane },
    { name: "Dubai", icon: Plane },
    { name: "Vietnam", icon: Plane },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading international packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 whitespace-nowrap">
              International Packages
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 opacity-90">
              Explore the world with our carefully crafted international tour packages
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                International Packages
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Global Destinations
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#1e1f44] mb-8">
              Popular International Destinations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularCountries.map((country, index) => (
                <Card
                  key={index}
                  className={`text-center hover:shadow-lg transition-all cursor-pointer ${selectedDestination === country.name.toLowerCase()
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-gray-50'
                    }`}
                  onClick={() => setSelectedDestination(
                    selectedDestination === country.name.toLowerCase() ? "" : country.name.toLowerCase()
                  )}
                >
                  <CardContent className="p-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${selectedDestination === country.name.toLowerCase()
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 text-primary'
                      }`}>
                      <country.icon className="h-8 w-8" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${selectedDestination === country.name.toLowerCase()
                      ? 'text-primary'
                      : 'text-[#1e1f44]'
                      }`}>
                      {country.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clear Filter Button */}
            {selectedDestination && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDestination("")}
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  Clear Filter
                </Button>
              </div>
            )}
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
                  <h3 className="text-xl font-semibold text-[#1e1f44] mb-2">No international packages found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                  <Button onClick={() => {
                    setFilters({
                      searchTerm: "",
                      priceRange: [0, 50000],
                      durationRange: [1, 30],
                      location: "international",
                      departureCity: [],
                      tourType: [],
                      departBetween: {
                        startDate: "",
                        endDate: ""
                      }
                    });
                    setSelectedDestination("");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1e1f44]">
                      {selectedDestination
                        ? `${selectedDestination.charAt(0).toUpperCase() + selectedDestination.slice(1)} Packages`
                        : 'International Packages'
                      }
                    </h2>
                    <div className="text-sm text-gray-600">
                      {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg) => (
                      <Card key={pkg._id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                              <Globe className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-white text-[#1e1f44]">
                            {formatPrice(pkg.price)}
                          </Badge>
                          <Badge className="absolute top-4 left-4 bg-primary text-white">
                            {pkg.place === 'bhutan' ? 'Bhutan' :
                              pkg.place === 'nepal' ? 'Nepal' :
                                pkg.place === 'dubai' ? 'Dubai' :
                                  pkg.place === 'vietnam' ? 'Vietnam' :
                                    pkg.place === 'sri-lanka' ? 'Sri Lanka' :
                                      pkg.place === 'bali' ? 'Bali' :
                                        pkg.place === 'malaysia' ? 'Malaysia' :
                                          pkg.place === 'singapore' ? 'Singapore' : pkg.place}
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
                              <Star className="h-4 w-4 mr-2" />
                              {pkg.rating}/5
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mt-4 line-clamp-3">
                            {pkg.about}
                          </p>

                          <div className="mt-6 flex space-x-2">
                            <Link href={`/packages/${pkg._id}`} className="flex-1">
                              <Button className="w-full">
                                View Details
                              </Button>
                            </Link>
                            <Link href="/contact" className="flex-1">
                              <Button variant="outline" className="w-full">
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

      {/* Why Choose International Travel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1f44] mb-4">
                Why Choose International Travel?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the benefits of exploring destinations beyond Nepal
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                  Cultural Diversity
                </h3>
                <p className="text-gray-600">
                  Experience different cultures, traditions, and ways of life around the world
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Plane className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                  Easy Travel
                </h3>
                <p className="text-gray-600">
                  We handle all visa processing, flights, and logistics for a hassle-free experience
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                  Unique Experiences
                </h3>
                <p className="text-gray-600">
                  Visit iconic landmarks, try exotic cuisines, and create unforgettable memories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Explore the World?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let us create the perfect international adventure for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link href="/packages/domestic">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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

export default InternationalPackagesPage;

