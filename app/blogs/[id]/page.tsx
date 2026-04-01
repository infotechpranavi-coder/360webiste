'use client'

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Calendar, User, Eye, Heart, Share2, Clock
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  publishDate: string;
  readTime: string;
  category: string;
  image: string;
  views: number;
  likes: number;
  tags: string[];
}

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      if (params.id === 'dubai-stopover-tour') {
        setBlog({
          id: 'dubai-stopover-tour',
          title: "Dubai Stopover Tour – Make the Most of Your Layover in Dubai",
          excerpt: "Long international journeys often come with extended layovers, and for many travelers, those hours feel like lost time, spent waiting inside an airport lounge or watching the clock tick between flights. But if your journey routes through Dubai, a layover doesn't have to be a pause.",
          content: "Full content will be rendered below",
          author: "SkyGo",
          authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
          publishDate: "2024-02-20",
          readTime: "15 min read",
          category: "Travel Guide",
          image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
          views: 3200,
          likes: 245,
          tags: ["Dubai", "Stopover", "Layover", "Transit", "Travel Guide"]
        });
        setLoading(false);
      } else if (params.id === 'dubai-tour-packages-budget-friendly') {
        setBlog({
          id: 'dubai-tour-packages-budget-friendly',
          title: "Dubai Tour Packages – Budget Friendly Holidays from 1 Night to 7 Nights",
          excerpt: "Dubai is one of the few destinations in the world that successfully balances modern luxury with cultural heritage, family-friendly attractions with romantic experiences, and short stopovers with extended holidays.",
          content: "Full content will be rendered below",
          author: "SkyGo",
          authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
          publishDate: "2024-03-15",
          readTime: "18 min read",
          category: "Travel Guide",
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
          views: 2800,
          likes: 198,
          tags: ["Dubai", "Tour Packages", "Budget Travel", "Holiday Packages", "Travel Guide"]
        });
        setLoading(false);
      } else if (params.id === 'premium-dubai-tour-packages-luxury') {
        setBlog({
          id: 'premium-dubai-tour-packages-luxury',
          title: "Customized Luxury: The Ultimate Guide to Premium Private Travel in Dubai",
          excerpt: "Dubai is a city that rewards thoughtful travel. Beyond the iconic skyline and record-breaking attractions lies a destination best experienced with time, comfort, and careful planning.",
          content: "Full content will be rendered below",
          author: "SkyGo",
          authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
          publishDate: "2024-04-10",
          readTime: "20 min read",
          category: "Travel Guide",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
          views: 3500,
          likes: 312,
          tags: ["Dubai", "Premium Tours", "Luxury Travel", "Private Tours", "Travel Guide"]
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900">Loading article...</h2>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h3>
          <p className="text-gray-600 mb-8">The article you are looking for does not exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="w-full h-[400px] md:h-[500px] relative overflow-hidden bg-gray-100">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content - Full Width */}
      {/* Main Content - Full Width */}
      <article className="max-w-none w-full">
        {/* Article Header */}
        <header className="max-w-5xl mx-auto px-1 sm:px-2 lg:px-3 pt-12 pb-8">
          <div className="mb-6">
            <Badge className="mb-4">{blog.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8">
              {blog.excerpt}
            </p>
          </div>

          {/* Author & Meta Info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={blog.authorImage}
                  alt={blog.author}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{blog.author}</p>
                <p className="text-sm text-gray-500">{blog.publishDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{blog.likes.toLocaleString()} likes</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body - Full Width Content */}
        <div className="max-w-none w-full">
          <div className="prose prose-lg prose-gray max-w-none px-1 sm:px-2 lg:px-3 pb-16">
            {/* Introduction */}
            <div className="max-w-5xl mx-auto border border-gray-200 rounded-lg p-6 mb-16">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                Long international journeys often come with extended layovers, and for many travelers, those hours feel like lost time, spent waiting inside an airport lounge or watching the clock tick between flights. But if your journey routes through Dubai, a layover doesn't have to be a pause. With the right planning, it can become a highlight of your trip.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                A Dubai stopover tour allows transit passengers to step beyond the airport and experience the city's iconic skyline, cultural heritage, and world-class attractions, even if they have only a few hours or a single night. Dubai is one of the very few global transit hubs where exploring the city during a layover is not only possible but genuinely rewarding.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12">
                Whether you are a business traveler with a tight connection, a leisure traveler on a long-haul flight, or a first-time visitor curious about the city, a well-organized Dubai transit tour can turn waiting time into a meaningful travel experience.
              </p>
            </div>

            {/* What Is a Dubai Stopover */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Is a Dubai Stopover or Transit Tour?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                A Dubai stopover or transit tour is a short-duration sightseeing experience designed specifically for travelers passing through Dubai on an international flight. These tours are carefully structured around flight arrival and departure times, ensuring that travelers can explore the city comfortably and return to the airport without stress.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Unlike standard holiday tours, a Dubai layover tour prioritizes efficiency. The focus is on:
              </p>
              <ul className="text-lg text-gray-700 leading-relaxed mb-4 space-y-2 ml-6 list-disc">
                <li>Seamless airport pickup and drop-off</li>
                <li>Flexible timing based on layover duration</li>
                <li>Attractions located close to the airport</li>
                <li>Minimal waiting and optimized routing</li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Stopover tours can range from quick 3–4 hour city highlights to overnight stays that include accommodation, sightseeing, and dining experiences. Many travelers flying between Europe, Asia, Africa, Australia, and the Americas pass through Dubai for 8 to 24 hours—making it an ideal gateway for short city exploration.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                A Dubai airport stopover tour ensures that even limited time is used wisely, without the complexity of planning transport, tickets, or navigation on your own.
              </p>
            </section>

            {/* Why Dubai */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Dubai Is One of the Best Cities in the World for Stopover Travel
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Not every transit city is suitable for layover exploration. Dubai stands out for several practical and experiential reasons.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Strategic Airport Location
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dubai International Airport (DXB) is located just 15–30 minutes from most major attractions. Downtown Dubai, Dubai Marina, Jumeirah Beach, and Old Dubai are all easily accessible, meaning travelers don't lose valuable hours commuting.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Smooth Immigration and Transit Infrastructure
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dubai has efficient immigration processes, especially for transit passengers. Many nationalities qualify for visa-on-arrival, while others can obtain a Transit Visa Dubai in advance with minimal paperwork.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Flexible Tourism Hours
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dubai operates on a different rhythm. Attractions, restaurants, malls, and experiences are available throughout the day and late into the night. This makes it ideal for travelers arriving early morning or departing after midnight.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Safety and Cleanliness
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dubai consistently ranks among the safest cities globally. This gives solo travelers, families, and business passengers confidence to step out during short stays.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Year-Round Accessibility
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Even during the summer months, most Dubai sightseeing in transit is conducted in air-conditioned vehicles, indoor venues, or during evening hours, making stopovers comfortable throughout the year.
                  </p>
                </div>
              </div>
            </section>

            {/* Best Dubai Stopover Tour Options */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Best Dubai Stopover Tour Options Based on Layover Duration
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Choosing the right stopover tour depends largely on how much time you have between flights. Below are realistic options travelers commonly choose.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Dubai Express City Tour (3–5 Hours)
                  </h3>
                  <p className="text-lg font-medium text-gray-600 mb-3">
                    Ideal for travelers with a 6–8 hour layover.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    This fast-paced Dubai express city tour covers the city's most recognizable landmarks with short stops and panoramic views. Typical highlights include:
                  </p>
                  <ul className="text-lg text-gray-700 leading-relaxed mb-4 space-y-2 ml-6 list-disc">
                    <li>Burj Khalifa (external view or optional entry)</li>
                    <li>Dubai Mall and Fountain area</li>
                    <li>Burj Al Arab photo stop</li>
                    <li>Palm Jumeirah drive</li>
                    <li>Dubai Marina skyline</li>
                  </ul>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    This option is perfect for first-time visitors who want a snapshot of modern Dubai without rushing through long visits.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Half-Day Dubai City Tour from Airport (5–7 Hours)
                  </h3>
                  <p className="text-lg font-medium text-gray-600 mb-3">
                    Best suited for layovers of 8–12 hours.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    This Dubai city tour from airport blends modern attractions with cultural districts. In addition to Downtown and Marina, it often includes:
                  </p>
                  <ul className="text-lg text-gray-700 leading-relaxed mb-4 space-y-2 ml-6 list-disc">
                    <li>Dubai Creek and abra ride</li>
                    <li>Al Fahidi Historical District</li>
                    <li>Gold and Spice Souks</li>
                    <li>Jumeirah Mosque</li>
                  </ul>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    This option offers a more rounded understanding of Dubai's past and present within limited time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Dubai Overnight Stopover (1 Night / 2 Days)
                  </h3>
                  <p className="text-lg font-medium text-gray-600 mb-3">
                    Recommended for layovers of 18–36 hours.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    A Dubai overnight stopover allows travelers to relax, sleep comfortably, and enjoy the city without watching the clock. These tours typically include:
                  </p>
                  <ul className="text-lg text-gray-700 leading-relaxed mb-4 space-y-2 ml-6 list-disc">
                    <li>Airport pickup and hotel accommodation</li>
                    <li>Evening activity such as a dhow cruise or Marina walk</li>
                    <li>City tour the following day</li>
                    <li>Airport drop-off for onward flight</li>
                  </ul>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Business travelers and long-haul passengers often prefer this option to reset before continuing their journey.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    Desert Safari as a Transit Experience
                  </h3>
                  <p className="text-lg font-medium text-gray-600 mb-3">
                    Surprisingly popular among transit passengers.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    If your layover includes an evening window, a desert safari fits well into a Dubai short stay tour. Within an hour from the city, travelers can enjoy dune bashing, sunset photography, cultural performances, and BBQ dinner before returning to the airport or hotel.
                  </p>
                </div>
              </div>
            </section>

            {/* Top Attractions */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Top Attractions Covered During a Dubai Layover Tour
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                A successful layover tour Dubai focuses on attractions that offer high impact without long travel times.
              </p>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-3 ml-6 list-disc">
                <li><strong>Burj Khalifa and Downtown Dubai</strong> – The heart of modern Dubai. Even without going up the tower, the surrounding area provides impressive architecture, fountains, and dining options.</li>
                <li><strong>Dubai Marina</strong> – A waterfront district known for its skyline and relaxed atmosphere. Evening visits or dhow cruises are especially popular during transit tours.</li>
                <li><strong>Palm Jumeirah</strong> – An engineering marvel offering scenic drives and iconic views of Atlantis The Palm.</li>
                <li><strong>Old Dubai and Dubai Creek</strong> – For cultural contrast, Old Dubai introduces travelers to traditional markets, heritage houses, and abra crossings—an authentic side of the city often missed on short trips.</li>
                <li><strong>Jumeirah Beach and Burj Al Arab</strong> – A classic photo opportunity that fits well into short itineraries.</li>
              </ul>
            </section>

            {/* Sample Itinerary */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sample Dubai Stopover Itinerary (12–14 Hour Layover)
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Here's a practical example for travelers landing in Dubai in the morning and departing late at night.
              </p>
              <ol className="text-lg text-gray-700 leading-relaxed space-y-4 ml-6 list-decimal">
                <li><strong>Arrival at Dubai Airport</strong> – Immigration and baggage clearance.</li>
                <li><strong>Airport Pickup and City Tour Start</strong> – Drive towards Old Dubai.</li>
                <li><strong>Dubai Creek and Heritage Walk</strong> – Explore Al Fahidi, take an abra ride.</li>
                <li><strong>Downtown Dubai Visit</strong> – Lunch at Dubai Mall, Burj Khalifa photo stop.</li>
                <li><strong>Palm Jumeirah and Marina Drive</strong> – Short walk and skyline views.</li>
                <li><strong>Return to Airport</strong> – Drop-off for onward flight.</li>
              </ol>
              <p className="text-lg text-gray-700 leading-relaxed mt-6 font-semibold">
                Furthermore, here are our offers! Select your perfect Day Tours and Tickets options!
              </p>
            </section>

            {/* Who Should Book */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Who Should Book a Dubai Stopover Tour?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                A Dubai stopover tour is ideal for:
              </p>
              <ul className="text-lg text-gray-700 leading-relaxed space-y-2 ml-6 list-disc mb-4">
                <li>International transit passengers with 6+ hour layovers</li>
                <li>Business travelers seeking productive breaks</li>
                <li>First-time Dubai visitors, but has a minimum time</li>
                <li>Families preferring guided experiences</li>
                <li>Solo travelers avoiding navigation challenges</li>
                <li>Couples on long-haul routes</li>
              </ul>
              <p className="text-lg text-gray-700 leading-relaxed">
                It is especially helpful for travelers unfamiliar with local transport or visa procedures.
              </p>
            </section>

            {/* Practical Tips */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Practical Tips for Planning a Dubai Layover Tour
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Check Visa Requirements Early
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Many travelers qualify for a visa-on-arrival. If not, arrange a Transit Visa Dubai in advance to avoid delays. A free consultation is available! Contact us.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Choose the Right Layover Length
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-2">
                    For comfort and safety:
                  </p>
                  <ul className="text-lg text-gray-700 leading-relaxed space-y-1 ml-6 list-disc">
                    <li>Minimum recommended layover: 6–7 hours</li>
                    <li>Ideal duration: 8–24 hours</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Always Allow Time Buffers
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Leave at least 2–3 hours before your onward flight to account for traffic and airport formalities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Luggage Handling
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Most tours provide secure storage in vehicles or coordinate airport luggage facilities.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
                    Best Time of Day for Stopovers
                  </h3>
                  <ul className="text-lg text-gray-700 leading-relaxed space-y-1 ml-6 list-disc">
                    <li><strong>Morning arrivals:</strong> City and cultural tours</li>
                    <li><strong>Evening arrivals:</strong> Marina, dhow cruise, desert safari</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions (FAQs)
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Is a Dubai stopover tour worth it?
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Yes. Dubai's proximity to the airport makes sightseeing efficient and stress-free, even during short layovers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    How long should my layover be for a Dubai transit tour?
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Ideally 8–12 hours, though express tours can work with shorter durations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Do I need a visa for a Dubai layover tour?
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Visa requirements depend on nationality. Many travelers are eligible for visa-on-arrival or transit visas.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can I explore Dubai at night during a layover?
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Yes. Many attractions operate late, making night tours very popular.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Is it safe to travel alone during a Dubai stopover?
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dubai is one of the safest cities globally and well-suited for solo travelers.
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="max-w-5xl mx-auto mb-16 border border-gray-200 rounded-lg p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Turn Your Transit into a Travel Experience
              </h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
                A layover in Dubai is not just a break between flights; it's an opportunity. With careful planning, a Dubai stopover tour allows travelers to experience a city known for innovation, culture, and hospitality without committing to a full holiday.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                From express city tours to overnight stopovers and evening desert safaris, Dubai offers unmatched flexibility for transit travelers. Instead of waiting inside the terminal, step out and experience one of the world's most fascinating cities, even if only for a few hours.
              </p>
            </section>
          </div>
        </div>

        {/* Tags & Footer */}
        <footer className="max-w-5xl mx-auto px-1 sm:px-2 lg:px-3 pb-16">
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Explore Dubai During Your Layover?
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Contact us for a free consultation and customized stopover tour itinerary
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/packages/premium">
                  <Button size="lg" variant="outline">
                    View Premium Tours
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetailPage;
