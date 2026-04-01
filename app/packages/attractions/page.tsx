'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Camera, Heart, Sparkles, CheckCircle, Globe, Shield, Users, Star, Zap, ArrowRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Package {
  _id: string;
  title: string;
  subtitle: string;
  about: string;
  price: number;
  duration: string;
  location: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  rating: number;
  packageCategory?: string;
}

const AttractionsActivitiesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // First, try to seed packages if database is empty
      try {
        console.log('Seeding packages...');
        await fetch('/api/packages/seed', { method: 'POST' });
        // Wait a bit for the database to update
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (seedError) {
        console.log('Seed attempt completed or failed:', seedError);
      }

      console.log('Fetching packages from API...');
      const response = await fetch('/api/packages');
      const result = await response.json();

      if (result.success && result.data) {
        console.log('Total packages fetched:', result.data.length);

        // Filter STRICTLY for attraction packages (packageCategory must be 'Attraction and Activity')
        let attractionPackages = result.data.filter((pkg: Package) =>
          pkg.packageCategory && (
            pkg.packageCategory === 'Attraction and Activity' ||
            pkg.packageCategory === 'attraction and activity'
          )
        );

        console.log('Attraction packages found:', attractionPackages.length);
        console.log('Attraction packages:', attractionPackages.map(p => p.title));

        setPackages(attractionPackages);
      } else {
        console.error('API response not successful:', result);
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-28 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-indigo-800/70 to-purple-900/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm font-medium">
              <Ticket className="h-4 w-4 mr-2" />
              Attractions & Activities
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              Attractions & Activities
              <span className="block bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Tickets in Dubai
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-95 font-light">
              Explore the UAE with Confidence
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-base px-5 py-2.5 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 transition-all">
                <Sparkles className="h-4 w-4 mr-2" />
                Iconic Landmarks
              </Badge>
              <Badge variant="secondary" className="text-base px-5 py-2.5 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 transition-all">
                <Ticket className="h-4 w-4 mr-2" />
                Theme Parks
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-light">
                Dubai is not just a destination: it is an <span className="font-semibold text-purple-600">experience capital</span>. From record-breaking skyscrapers and immersive museums to world-class theme parks, adventure sports, and cultural landmarks, the city offers one of the widest ranges of attractions anywhere in the world. Add Abu Dhabi and the other emirates to the mix, and travelers gain access to an unmatched portfolio of experiences within a single country.
              </p>
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border border-purple-100 shadow-lg">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  For visitors, however, choosing the right attractions and activities tickets in Dubai can quickly become overwhelming. With hundreds of ticket types, time slots, peak and non-peak pricing, combo offers, seasonal promotions, and strict entry rules for certain attractions, booking incorrectly can lead to missed experiences or unnecessary costs.
                </p>
                <p className="text-lg text-gray-800 font-semibold leading-relaxed">
                  This is where <span className="text-purple-600">SkyGo</span> plays a key role: simplifying access to all major attractions and activities tickets across South Africa, while offering clarity, reliability, and expert guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages Section */}
      {!loading && (
        <section className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-4">
                  Featured Attraction
                  <span className="block text-purple-600 text-3xl md:text-4xl mt-2">Tickets & Packages</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Book your tickets for Dubai's most iconic attractions
                </p>
              </div>
              {packages.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg) => (
                    <Card key={pkg._id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 hover:-translate-y-2 group">
                      <div className="relative">
                        {pkg.images && pkg.images.length > 0 ? (
                          <div className="aspect-video relative">
                            <Image
                              src={pkg.images[0].url}
                              alt={pkg.images[0].alt || pkg.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            <Ticket className="h-16 w-16 text-purple-400" />
                          </div>
                        )}
                        <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#1e1f44] font-bold px-3 py-1.5 shadow-lg">
                          From {formatPrice(pkg.price)}
                        </Badge>
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-3 py-1.5 shadow-lg">
                          <Ticket className="h-4 w-4 mr-1" />
                          Ticket
                        </Badge>
                      </div>

                      <CardHeader className="bg-white">
                        <CardTitle className="text-2xl font-bold text-[#1e1f44] group-hover:text-purple-600 transition-colors">
                          {pkg.title}
                        </CardTitle>
                        <p className="text-gray-600 mt-2">{pkg.subtitle}</p>
                      </CardHeader>

                      <CardContent className="bg-white">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                            {pkg.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-purple-600" />
                            {pkg.duration}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                            {pkg.rating}/5
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-6 line-clamp-3">
                          {pkg.about}
                        </p>

                        <div className="flex space-x-3">
                          <Link href={`/packages/${pkg._id}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                              View Details
                            </Button>
                          </Link>
                          <Link href="/contact" className="flex-1">
                            <Button variant="outline" className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                    <Ticket className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1f44] mb-2">No Attraction Packages Found</h3>
                  <p className="text-gray-600 mb-6">
                    We're currently loading our attraction packages. Please refresh the page or check back soon.
                  </p>
                  <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    Refresh Page
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-6">
                Overview: Attractions & Activities
                <span className="block text-3xl md:text-4xl text-purple-600 mt-2">Tickets in Dubai</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dubai's attractions span multiple travel interests, making the city suitable for:
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {['First-time visitors', 'Families with children', 'Couples and honeymooners', 'Adventure seekers', 'Culture and museum lovers', 'Luxury and premium travelers'].map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center space-x-4 p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-lg">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6 flex items-center">
                  <Globe className="h-8 w-8 mr-3" />
                  Coverage Areas
                </h3>
                <p className="text-xl mb-8 opacity-95">
                  At Premium Dubai Tours, we provide authorized attraction tickets and activity bookings covering:
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah', 'Other Emirates'].map((emirate, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                      <Globe className="h-6 w-6 text-white" />
                      <span className="text-lg font-medium">{emirate}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xl opacity-95">
                  Our offerings range from iconic landmarks and theme parks to high-adrenaline adventures, water experiences, cultural museums, and immersive exhibitions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-4">
                Why Book with
                <span className="block text-purple-600">SkyGo?</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your trusted partner for all UAE attractions and activities tickets
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1e1f44] mb-3">1. One Platform, Complete Coverage</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Instead of booking from multiple sources, we provide all major South African attractions tickets in one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1e1f44] mb-3">2. Authentic & Authorized Tickets</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      We work with official suppliers and attraction partners, ensuring:
                    </p>
                    <ul className="space-y-2">
                      {['Genuine tickets', 'Valid entry', 'Clear time slots and rules'].map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1e1f44] mb-3">3. Expert Guidance, Not Just Ticket Sales</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Some attractions have:
                    </p>
                    <ul className="space-y-2 mb-4">
                      {['Peak vs non-peak hours', 'Seasonal closures', 'Maintenance periods', 'Age or health restrictions'].map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      We guide travelers to choose the right ticket at the right time, avoiding disappointment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform shadow-lg">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1e1f44] mb-3">4. Combo Tickets & Smart Savings</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      We offer:
                    </p>
                    <ul className="space-y-2 mb-4">
                      {['Combo attraction tickets', 'Multi-attraction passes', 'Seasonal promotional offers'].map((item, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      This helps travelers save time and money, especially families and long-stay visitors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-8 rounded-2xl shadow-2xl md:col-span-2 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-5 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">5. Easy Add-On to Tours & Packages</h3>
                    <p className="text-lg opacity-95 leading-relaxed">
                      Attractions tickets can be booked standalone, added to Dubai tour packages, or combined with city tours, desert safaris, or stopovers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-4">
                Dubai's Iconic Attractions
                <span className="block text-purple-600 text-3xl md:text-4xl mt-2">& Experiences</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the world's most spectacular attractions and activities
              </p>
            </div>

            {/* Iconic Landmarks */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Iconic Landmarks & Observation Experiences
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl">
                Dubai is home to some of the most recognizable landmarks in the world. We provide tickets for:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Burj Khalifa – At the Top Entry Tickets', 'Burj Khalifa Combo Entry Tickets', 'Sky Views Observation Deck', 'The View at The Palm', 'Ain Dubai', 'Dubai Frame'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                These attractions are ideal for first-time visitors and photographers, offering panoramic views of the city's skyline and coastline.
              </p>
            </div>

            {/* Dubai Mall Attractions */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Dubai Mall Attractions & Indoor Experiences
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-4 max-w-3xl">
                Located in the heart of Downtown Dubai, Dubai Mall is not just a shopping destination—it's a major entertainment hub.
              </p>
              <p className="text-lg text-gray-800 font-semibold mb-6">Available tickets include:</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Dubai Aquarium & Underwater Zoo', 'Dubai Mall Attractions & Activities', 'House of Hype (HOH)', 'Museum of Illusions', 'AYA Universe'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                These experiences are perfect for families, couples, and travelers visiting Dubai during warmer months.
              </p>
            </div>

            {/* Cultural & Museum */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Cultural, Museum & Immersive Experiences
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-4 max-w-3xl">
                Dubai has made significant investments in culture, innovation, and immersive storytelling.
              </p>
              <p className="text-lg text-gray-800 font-semibold mb-6">Tickets available through Premium Dubai Tours include:</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Museum of the Future (MOTF)', 'Museum of the Future – Pioneer Pass', 'Shindagha Museum', 'Arte Museum Dubai – Immersive Media Art Exhibition', 'Inside Burj Al Arab Tour'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                These attractions appeal to travelers seeking insight into Dubai's past, present, and future.
              </p>
            </div>

            {/* Nature & Wildlife */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Nature, Wildlife & Garden Attractions
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl">
                Dubai also offers beautifully curated green spaces and wildlife experiences:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Dubai Miracle Garden Entrance Ticket', 'Dubai Butterfly Garden Entrance Ticket', 'Combo: Miracle Garden + Butterfly Garden', 'Glow Garden (Regular Ticket – includes Dinosaur Park & Fantasy Park)', 'The Green Planet', 'The Green Planet (Promotional Offer – booking valid until 31 Jan 2026, ticket validity until 20 Mar 2026)', 'Crocodile Park Dubai', 'Dubai Safari Park – Day Pass', 'Safari Bundle (Park Pass + Train + Explorer Safari)'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                These attractions are especially popular with families and nature lovers.
              </p>
            </div>

            {/* Theme Parks */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Theme Parks, Water Parks & Family Entertainment
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-4 max-w-3xl">
                Dubai is a global leader in large-scale entertainment and theme parks.
              </p>
              <p className="text-lg text-gray-800 font-semibold mb-6">Tickets available include:</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Atlantis The Palm – Marine & Waterpark', 'Wild Wadi General Admission', 'Wild Wadi General Admission with Meal', 'Ski Dubai – Snow Park (Mall of the Emirates)', 'Dubai Parks and Resorts (DPR)', 'IMG Worlds of Adventure Dubai', 'Global Village', 'La Perle Dubai'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                These attractions are ideal for families, thrill-seekers, and entertainment-focused travelers.
              </p>
            </div>

            {/* Sightseeing Tours */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Sightseeing Tours & Water Adventures
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl">
                For travelers who want to experience Dubai from land, sea, and sky:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Big Bus Tours Dubai – Hop-On Hop-Off', 'Speed Boat Tours in Dubai', 'The Yellow Boats – Dubai', 'The Black Boat (TBB)', 'The Dubai Balloon – Atlantis'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                These experiences provide unique city perspectives and flexible sightseeing options.
              </p>
            </div>

            {/* Adventure Sports */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#1e1f44]">
                  Adventure, Extreme Sports & Aerial Experiences
                </h3>
              </div>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl">
                Dubai is also a global hub for adrenaline experiences:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['XLine Dubai Marina', 'Skydive Dubai', 'Dubai Helicopter Tours', 'Deep Dive Dubai', 'Hot Air Balloon Desert Experience', 'Paramotor Desert Adventure', 'Parasailing Experience in Marina', 'Sky & Sea Adventure Sports'].map((attraction, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 italic bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                Each activity has specific eligibility and safety requirements, which we clearly communicate during booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Abu Dhabi Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-4">
                Abu Dhabi Attractions
                <span className="block text-purple-600 text-3xl md:text-4xl mt-2">& Experiences</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Beyond Dubai, Premium Dubai Tours provides full coverage of Abu Dhabi attractions tickets, including:
              </p>
            </div>

            <div className="space-y-12">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1f44]">Museums & Cultural Landmarks</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Louvre Museum Abu Dhabi – General Admission', 'Louvre Museum Guided Tour (Add-on)', 'Qasr Al Watan – General Admission (Peak & Non-Peak Hours)', 'Natural History Museum Abu Dhabi', 'Zayed National Museum', 'TeamLab Phenomena Abu Dhabi'].map((attraction, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1f44]">Family & Wildlife Attractions</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['National Aquarium Abu Dhabi', 'The Butterfly Garden Abu Dhabi', 'Combo: National Aquarium + Butterfly Garden', 'Emirates Park Zoo – Regular Pass', 'Emirates Park Zoo – Explorer Pass', 'KidZania Abu Dhabi'].map((attraction, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1f44]">Yas Island Theme Parks</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Ferrari World Abu Dhabi', 'Yas Waterworld', 'Warner Bros. World', 'SeaWorld Abu Dhabi'].map((attraction, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl shadow-md hover:shadow-xl border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-800 font-medium leading-relaxed">{attraction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Dubai & Abu Dhabi */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-4">
                Attractions Beyond
                <span className="block text-purple-600 text-3xl md:text-4xl mt-2">Dubai & Abu Dhabi</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We also assist with:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {['Ras Al Khaimah Adventure Parks', 'The Yellow Boats – Abu Dhabi & RAK'].map((attraction, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-purple-400 text-center transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-purple-600 mr-2" />
                    <span className="text-gray-800 font-semibold text-lg">{attraction}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-8 text-center italic text-lg bg-purple-50 p-5 rounded-xl border-l-4 border-purple-500 max-w-2xl mx-auto">
              These are ideal for travelers looking to explore beyond the main cities.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e1f44] mb-4">
                A Category Built for
                <span className="block text-purple-600 text-3xl md:text-4xl mt-2">Growth</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The Attractions & Activities Tickets category is designed to scale easily. Future sub-categories can include:
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {['Observation Decks', 'Theme Parks & Water Parks', 'Museums & Cultural Attractions', 'Adventure & Extreme Sports', 'Family-Friendly Experiences', 'Dubai vs Abu Dhabi Attractions'].map((category, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-md hover:shadow-xl border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-purple-600 mr-3 group-hover:translate-x-1 transition-transform" />
                    <span className="text-gray-800 font-semibold text-lg">{category}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -ml-40 -mb-40 blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">Experience More While Planning Less</h3>
                <div className="space-y-4 text-lg opacity-95 leading-relaxed mb-8">
                  <p>
                    Dubai and the UAE offer one of the richest collections of attractions anywhere in the world, but the experience is only as good as the planning that goes into it.
                  </p>
                  <p>
                    With Premium Dubai Tours, travelers gain access to all major UAE attractions, expert advice, clear ticket options, reliable bookings, and one trusted point of contact.
                  </p>
                  <p>
                    Whether you're visiting for a short stopover or an extended holiday, our attractions and activities tickets allow you to experience more while planning less.
                  </p>
                </div>
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                    Contact Us for More Information
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore More Options
            </h2>
            <p className="text-xl mb-10 opacity-95">
              Check out our other Dubai packages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages/regular">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-base px-6 py-6 transition-all shadow-lg hover:shadow-xl">
                  View Regular Packages
                </Button>
              </Link>
              <Link href="/packages/premium">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-base px-6 py-6 transition-all shadow-lg hover:shadow-xl">
                  View Premium Packages
                </Button>
              </Link>
              <Link href="/packages/luxury">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-base px-6 py-6 transition-all shadow-lg hover:shadow-xl">
                  View Luxury Packages
                </Button>
              </Link>
              <Link href="/packages/adventure">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 text-base px-6 py-6 transition-all shadow-lg hover:shadow-xl">
                  View Adventure Activities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AttractionsActivitiesPage;

