'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Search, Star, Users } from 'lucide-react';
import {
  PackageExperienceCategory,
  accentStyles,
  packageMatchesExperienceCategory,
} from '@/lib/packageExperienceCategories';

interface PackageItem {
  _id: string;
  title: string;
  subtitle: string;
  about: string;
  price: number;
  duration: string;
  location: string;
  capacity: string;
  packageCategory?: string;
  images: Array<{ url: string; alt: string }>;
  rating: number;
}

interface PackageExperiencePageProps {
  category: PackageExperienceCategory;
}

export default function PackageExperiencePage({ category }: PackageExperiencePageProps) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const styles = accentStyles[category.accent];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) setSearchTerm(searchParam);
    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages;
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pkg) =>
          pkg.title.toLowerCase().includes(query) ||
          pkg.subtitle.toLowerCase().includes(query) ||
          pkg.location.toLowerCase().includes(query) ||
          pkg.about.toLowerCase().includes(query)
      );
    }
    setFilteredPackages(filtered);
  }, [packages, searchTerm]);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const result = await response.json();
      if (result.success && result.data) {
        const matched = result.data.filter((pkg: PackageItem) =>
          packageMatchesExperienceCategory(pkg.packageCategory, category)
        );
        setPackages(matched);
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading {category.label.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative text-white py-16 md:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('${category.heroImage}')` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${styles.gradient}`} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-md text-white border-white/30">
              {category.label}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{category.heroTitle}</h1>
            <p className="text-lg md:text-xl opacity-90">{category.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#1e1f44]">{category.label}</h2>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={`Search ${category.label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#bd9245]/30"
                />
              </div>
            </div>

            {filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-2">{category.emptyMessage}</h3>
                <p className="text-gray-600 mb-6">Check back soon or explore other experience categories.</p>
                <Button onClick={() => router.push('/packages')}>View All Packages</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <Card
                    key={pkg._id}
                    className={`overflow-hidden hover:shadow-xl transition-shadow border-2 border-transparent ${styles.ring}`}
                  >
                    <div className="relative">
                      {pkg.images?.[0] ? (
                        <div className="aspect-video relative">
                          <Image
                            src={pkg.images[0].url}
                            alt={pkg.images[0].alt || pkg.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-200" />
                      )}
                      <Badge className="absolute top-4 right-4 bg-white text-[#1e1f44] font-bold">
                        {formatPrice(pkg.price)}
                      </Badge>
                      <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${styles.badge} text-white font-bold`}>
                        {category.label}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{pkg.title}</CardTitle>
                      <p className="text-gray-600">{pkg.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {pkg.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {pkg.capacity}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                          {pkg.rating || 5}/5
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-4 line-clamp-3">{pkg.about}</p>
                      <div className="mt-6 flex space-x-2">
                        <Link href={`/packages/${pkg._id}`} className="flex-1">
                          <Button className={`w-full ${styles.button}`}>View Details</Button>
                        </Link>
                        <Link href="/contact" className="flex-1">
                          <Button variant="outline" className={`w-full ${styles.outline}`}>
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
