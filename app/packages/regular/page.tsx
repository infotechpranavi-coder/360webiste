'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Search, Mountain, Camera, Heart, ShieldCheck } from "lucide-react";
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

const RegularPackagesPage = () => {
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


  const getDefaultRegularPackages = (): Package[] => [
    {
      _id: 'dubai-grand-explorer',
      title: 'Dubai Grand Explorer',
      subtitle: '7 Nights / 8 Days Dubai Tour Package',
      about: 'The Dubai Grand Explorer â€“ 7 Nights / 8 Days tour is designed for travelers who want to experience Dubai at an unhurried pace while covering the city\'s most iconic attractions along with regional highlights. This itinerary balances guided sightseeing with free time, allowing you to explore Dubai comfortably without feeling rushed.',
      services: [
        '7 nights hotel accommodation with daily breakfast',
        'Half-day Dubai city tour (Old & New Dubai)',
        'Desert safari with BBQ dinner and camp activities',
        'Dhow cruise dinner at Dubai Marina',
        'Burj Khalifa & Dubai Mall visit',
        'Abu Dhabi city tour with one theme park option',
        'Dubai Frame, Miracle Garden & Museum of the Future',
        'Global Village evening tour',
        'Shopping and leisure day',
        'Private airport transfers'
      ],
      tourDetails: 'Abstract\n\nThe Dubai Grand Explorer â€“ 7 Nights / 8 Days tour is designed for travelers who want to experience Dubai at an unhurried pace while covering the city\'s most iconic attractions along with regional highlights. This itinerary balances guided sightseeing with free time, allowing you to explore Dubai comfortably without feeling rushed.\n\nFrom modern landmarks and cultural districts to desert landscapes, waterfront dining, and leisure days, this tour delivers a complete Dubai experience. It is ideal for families, senior travelers, and long-stay guests who value organization, comfort, and clear planning.\n\nWith carefully scheduled activities, shared city tours, private airport transfers, and multiple accommodation options, this Regular Dubai Tour Package offers excellent value while maintaining service reliability and professional coordination throughout your stay.\n\nTour Overview\n\nDubai is a city best enjoyed with time, time to explore, time to relax, and time to absorb the contrast between tradition and modern ambition. The Dubai Grand Explorer package gives you exactly that.\n\nOver eight days, you will explore Dubai\'s historical neighborhoods, iconic skyscrapers, shopping districts, and entertainment zones, while also venturing beyond the city with a guided Abu Dhabi tour. The itinerary includes Dubai\'s essential experiences, such as a desert safari with BBQ dinner, a dhow cruise dinner at Dubai Marina, Burj Khalifa visit, Miracle Garden, Dubai Frame, Museum of the Future, Global Village, and cultural sightseeing.\n\nUnlike rushed itineraries, this tour spreads activities across multiple days and includes free time for shopping or rest. All major sightseeing tours are conducted on a sharing (SIC) basis, ensuring affordability, while airport transfers and hotel stays remain private and comfortable.\n\nThis package operates year-round. During summer months, activities are scheduled in air-conditioned venues or evenings, making it suitable even in warmer seasons, often at more economical pricing.\n\nKey Highlights\n\nâ€¢ 7 nights hotel accommodation with daily breakfast\nâ€¢ Half-day Dubai city tour (Old & New Dubai)\nâ€¢ Desert safari with BBQ dinner and camp activities\nâ€¢ Dhow cruise dinner at Dubai Marina\nâ€¢ Burj Khalifa & Dubai Mall visit\nâ€¢ Abu Dhabi city tour with one theme park option\nâ€¢ Dubai Frame, Miracle Garden & Museum of the Future\nâ€¢ Global Village evening tour\nâ€¢ Shopping and leisure day\nâ€¢ Private airport transfers\nâ€¢ English-speaking guide\n\nHotel Options\n\nâ€¢ Deluxe Package (3â˜… Hotels)\nâ€¢ Gold Package (4â˜… Hotels)\nâ€¢ Platinum Package (5â˜… Hotels)\n\nBest Time to Visit\n\nDubai can be visited throughout the year.\n\nâ€¢ November to March: Pleasant weather, peak season\nâ€¢ April to October: Hotter months, but tours are mostly indoor or evening-based and offered at more economical prices\n\nWhy Choose Premium Dubai Tours for This Trip?\n\nâ€¢ Clear itineraries with no rushed schedules\nâ€¢ Professional coordination and transparent inclusions\nâ€¢ Comfortable vehicles and experienced guides\nâ€¢ Multiple hotel category options under one package\nâ€¢ Suitable for families, seniors, and long-stay travelers\nâ€¢ Reliable support before and during the tour\n\nInclusions:\nâ€¢ Private airport arrival & departure transfers\nâ€¢ 7 nights hotel accommodation (twin sharing)\nâ€¢ Daily breakfast at hotel\nâ€¢ Dinners during desert safari and dhow cruise\nâ€¢ Half-day Dubai city tour (SIC basis)\nâ€¢ Abu Dhabi city tour (SIC basis)\nâ€¢ Desert safari in 4x4 vehicle with BBQ dinner (sharing)\nâ€¢ Dhow cruise dinner at Marina (sharing)\nâ€¢ Other tours as per the itinerary\nâ€¢ English-speaking guide during tours\nâ€¢ All government taxes and service charges\n\nExclusions:\nâ€¢ International airfare\nâ€¢ UAE entry visa (arranged on request)\nâ€¢ Personal expenses (shopping, drinks, laundry, insurance, tourism dirhams)\nâ€¢ Entry tickets to parks and attractions (arranged at actual cost)\nâ€¢ Tips and gratuities',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Dubai & Hotel Transfer',
          description: 'Upon arrival at Dubai International Airport, you will be welcomed and transferred to your hotel in a private, air-conditioned vehicle. After check-in, the rest of the day is free to relax or explore nearby areas at your own pace. Overnight: Dubai'
        },
        {
          day: 2,
          title: 'Half-Day Dubai City Tour, Burj Khalifa & Dubai Mall',
          description: 'After breakfast, proceed on a guided half-day Dubai city tour covering both Old and New Dubai. Highlights include photo stops at Jumeirah Mosque, Burj Al Arab, Palm Jumeirah, Atlantis The Palm, and Dubai Marina, along with visits to heritage areas and traditional souks. Later, visit Dubai Mall and ascend Burj Khalifa (124th/125th floor â€“ optional upgrade) for panoramic city views. Overnight: Dubai'
        },
        {
          day: 3,
          title: 'Abu Dhabi City Tour with One Park',
          description: 'Today, travel to the UAE capital, Abu Dhabi. Visit the Sheikh Zayed Grand Mosque, Corniche, Heritage Village, and key landmarks. The tour includes one theme park or attraction (Ferrari World / Warner Bros / Yas Waterworld â€“ ticket arranged at actual cost). Return to Dubai in the evening. Overnight: Dubai'
        },
        {
          day: 4,
          title: 'Dubai Frame, Miracle Garden, Museum of the Future & Dhow Cruise Dinner',
          description: 'Explore Dubai Frame for a visual journey between old and new Dubai. Visit Miracle Garden (seasonal) and enjoy an external or optional internal visit to the Museum of the Future. In the evening, enjoy a Dhow Cruise Dinner at Dubai Marina, featuring international buffet dining, soft entertainment, and skyline views. Overnight: Dubai'
        },
        {
          day: 5,
          title: 'Dolphin Show & Global Village (Evening)',
          description: 'After breakfast, attend a Dolphin or Seal Show, suitable for families and children. In the evening, visit Global Village, Dubai\'s multicultural entertainment and shopping destination with live performances and international pavilions. Overnight: Dubai'
        },
        {
          day: 6,
          title: 'Dhow Cruise Dinner at Marina',
          description: 'Daytime is free for shopping, optional activities, or rest. In the evening, enjoy another leisure-focused Marina experience, ideal for relaxed sightseeing, dining, and waterfront exploration. Overnight: Dubai'
        },
        {
          day: 7,
          title: 'Free Day for Shopping or Leisure',
          description: 'Enjoy a full free day to shop at malls, visit local markets, or add optional experiences such as theme parks, yacht cruises, or spa sessions. Overnight: Dubai'
        },
        {
          day: 8,
          title: 'Departure',
          description: 'After breakfast, check out from the hotel and transfer to Dubai International Airport for your onward journey.'
        }
      ],
      price: 0,
      duration: '7 Nights / 8 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 4.8,
      packageCategory: 'regular'
    },
    {
      _id: 'dubai-transit-escape',
      title: 'Dubai Transit Escape',
      subtitle: '1 Night / 2 Days Stopover Tour',
      about: 'The Dubai Transit Escape â€“ 1 Night 2 Days is a thoughtfully curated stopover tour designed for travelers passing through Dubai with limited time. Whether you are on an overnight airline layover or a short business visit, this package allows you to experience the essence of Dubai without rushed schedules or complex planning.',
      services: [
        'Ideal for airline stopovers and overnight transit stays',
        'Private airport transfers for stress-free arrival and departure',
        'Choice of Desert Safari or Marina Dhow Cruise',
        'Guided Dubai city sightseeing tour',
        'Flexible scheduling aligned with flight timings'
      ],
      tourDetails: 'Abstract\n\nThe Dubai Transit Escape â€“ 1 Night 2 Days is a thoughtfully curated stopover tour designed for travelers passing through Dubai with limited time. Whether you are on an overnight airline layover or a short business visit, this package allows you to experience the essence of Dubai without rushed schedules or complex planning.\n\nThis transit-focused itinerary prioritizes timing efficiency, comfort, and seamless coordination, ensuring you enjoy Dubai\'s iconic experiences while maintaining flexibility around flight schedules. With private airport transfers, comfortable hotel accommodation, and a choice of evening experiences, even a short stay becomes a meaningful travel experience.\n\nOverview\n\nDubai is one of the world\'s most important aviation hubs, welcoming millions of transit passengers each year. Many travelers pass through the city without realizing that even a single night is enough to experience its contrast, modern skylines, cultural heritage, and desert landscapes. The Dubai Transit Escape is designed precisely for this purpose.\n\nThis package eliminates the uncertainty that often comes with short stays. From the moment you land at Dubai or any airport in the United Arab Emirates, every aspect of your stopover is professionally managed. A private airport transfer ensures a smooth arrival, followed by check-in at a carefully selected hotel based on your chosen category: Deluxe (3â˜…), Gold (4â˜…), or Platinum (5â˜…).\n\nThe highlight of this transit tour is its flexible evening experience, allowing you to choose between two iconic Dubai activities:\n\n1. Desert Safari with BBQ Dinner, ideal for travelers wanting a glimpse of the Arabian landscape\n2. Dhow Cruise Dinner at Dubai Marina, perfect for a relaxed evening with skyline views\n\nBoth experiences are scheduled to accommodate late arrivals and jet lag considerations, making them suitable even for travelers arriving in the afternoon or early evening.\n\nThe second day focuses on a half-day Dubai sightseeing tour, covering both Old Dubai and New Dubai. This guided tour provides a structured introduction to the city, ensuring you return to the airport with a clear sense of Dubai\'s identityâ€”modern ambition balanced with cultural roots.\n\nThe Dubai Transit Escape proves that even a brief stay can be enriching when planned with care, timing precision, and professional support.\n\nHighlights:\nâ€¢ Ideal for airline stopovers and overnight transit stays\nâ€¢ Private airport transfers for stress-free arrival and departure\nâ€¢ Choice of Desert Safari or Marina Dhow Cruise\nâ€¢ Guided Dubai city sightseeing tour\nâ€¢ Flexible scheduling aligned with flight timings\n\nBest Time to Visit:\nThis transit tour operates throughout the year.\nâ€¢ October to April: Pleasant weather, higher demand\nâ€¢ May to September: Lower prices, indoor and evening-focused experiences\nDubai\'s infrastructure ensures comfort even during warmer months.\n\nWhy Premium Dubai Tours for This Transit Trip?\nâ€¢ Expertise in short-stay and stopover logistics\nâ€¢ Flight-time-sensitive planning\nâ€¢ Clear inclusions with no hidden surprises\nâ€¢ Professional coordination from airport to departure\n\nOptional Add-Ons:\nâ€¢ Burj Khalifa observation deck\nâ€¢ Private city tour upgrade\nâ€¢ Late check-out (subject to availability)\n\nInclusions:\nâ€¢ Airport Transfers: Arrival and departure airport transfers in a private, air-conditioned vehicle\nâ€¢ Hotel Accommodation: Twin-sharing accommodation based on selected category (Deluxe 3â˜…, Gold 4â˜…, Platinum 5â˜…)\nâ€¢ Meals: Daily breakfast at hotel, BBQ Dinner during Desert Safari OR Dinner during Dhow Cruise\nâ€¢ Sightseeing & Tours: Half-day Dubai City Tour (Old & New Dubai) on a sharing (SIC) basis\nâ€¢ Experiences: 4x4 Desert Safari with dune bashing, camel ride, sandboarding & camp activities OR Dhow Cruise Dinner on a sharing basis\nâ€¢ Guide & Assistance: English-speaking guide during city tours, Local assistance and coordination throughout the trip\nâ€¢ Taxes: Government taxes and official service charges\n\nExclusions:\nâ€¢ International Airfare: Flights to and from Dubai (can be arranged upon request)\nâ€¢ UAE Entry Visa: Dubai visa fees (assistance available if required)\nâ€¢ Entry Tickets: Theme parks, attractions, and monument tickets (Arranged at actual cost based on traveler preference)\nâ€¢ Personal Expenses: Lunches, beverages, shopping, Tourism Dirham fees, Laundry, phone calls, minibar usage\nâ€¢ Insurance: Travel and medical insurance\nâ€¢ Early Check-in / Late Check-out: Subject to hotel policy and availability',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Dubai & Evening Experience',
          description: 'Arrival at Dubai International Airport followed by meet & greet and private hotel transfer. Check-in at selected hotel. Evening activity - choose one: Desert Safari with BBQ Dinner OR Dhow Cruise Dinner at Dubai Marina. Overnight stay in Dubai.'
        },
        {
          day: 2,
          title: 'Dubai City Tour & Departure',
          description: 'Breakfast at the hotel. Half-day guided Dubai city tour (sharing basis) covering Old and New Dubai. Return to hotel or airport transfer. Departure as per flight schedule.'
        }
      ],
      price: 0,
      duration: '1 Night / 2 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Airport' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 4.5,
      packageCategory: 'regular'
    },
    {
      _id: 'dubai-stopover-signature',
      title: 'Dubai Stopover Signature',
      subtitle: '2 Nights / 3 Days Stopover Tour',
      about: 'The Dubai Stopover Signature â€“ 2 Nights 3 Days is designed for travelers who want to experience Dubai beyond a single night, without committing to a long holiday. Perfect for airline stopovers and short leisure breaks, this itinerary balances guided sightseeing with signature experiences such as desert safaris and marina cruises.',
      services: [
        'Designed for 2â€“3 day airline stopovers',
        'Balanced mix of sightseeing and leisure',
        'Marina Dhow Cruise & Desert Safari included',
        'Flexible departure day schedule',
        'Multiple hotel category options'
      ],
      tourDetails: 'Abstract\nThe Dubai Stopover Signature â€“ 2 Nights 3 Days is designed for travelers who want to experience Dubai beyond a single night, without committing to a long holiday. Perfect for airline stopovers and short leisure breaks, this itinerary balances guided sightseeing with signature experiences such as desert safaris and marina cruises.\nWith structured planning, flexible pacing, and professional coordination, this stopover package allows you to enjoy Dubai\'s highlights while maintaining comfort and clarity throughout your stay.\n\nOverview\nDubai rewards travelers who take even a little extra time to explore. With two nights at your disposal, the city unfolds at a more relaxed pace, allowing you to experience both its cultural depth and modern appeal. The Dubai Stopover Signature is crafted for travelers who want a complete experience within a short timeframe.\n\nYour journey begins with a smooth airport arrival and private hotel transfer. After settling in, the first evening introduces you to Dubai Marina through a Dhow Cruise Dinner, offering skyline views, calm waters, and a relaxed dining atmosphere.\n\nDay two is dedicated to exploration. A half-day Dubai city tour provides insight into the city\'s evolution, from historic neighborhoods and traditional markets to modern landmarks. In the afternoon, the pace shifts as you venture into the desert safari by a 4x4 desert safari vehicle, featuring dune driving, cultural activities, and a BBQ dinner under the stars.\n\nThe final day is intentionally unstructured, allowing time for shopping, leisure, or last-minute exploration before departure. This flexibility makes the package ideal for travelers managing return flights or onward connections.\n\nKey Highlights',
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Marina Cruise',
          description: 'Arrival and private airport transfer. Hotel check-in. Evening Dhow Cruise Dinner at Dubai Marina. Overnight stay.'
        },
        {
          day: 2,
          title: 'City Tour & Desert Safari',
          description: 'Breakfast at hotel. Half-day Dubai city sightseeing tour and back to hotel. Desert Safari with other activities and BBQ Dinner. Overnight stay.'
        },
        {
          day: 3,
          title: 'Shopping & Departure',
          description: 'Breakfast. Free time for shopping or leisure. Private airport transfer. Departure.'
        }
      ],
      price: 0,
      duration: '2 Nights / 3 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' }
      ],
      bookings: 0,
      rating: 4.6,
      packageCategory: 'regular'
    },
    {
      _id: 'dubai-essential-experience',
      title: 'Dubai Essential Experience',
      subtitle: '3 Nights / 4 Days Dubai Tour',
      about: 'The Dubai Essential Experience â€“ 3 Nights 4 Days is a thoughtfully designed short holiday that introduces travelers to Dubai\'s iconic landmarks, cultural contrasts, and leisure lifestyle. This package balances guided sightseeing with relaxed pacing, making it ideal for travelers who want a meaningful Dubai experience within a limited timeframe.',
      services: [
        'Half-day guided Dubai city tour',
        'Desert Safari with BBQ dinner and cultural activities',
        'Burj Khalifa and Dubai Mall visit',
        'Dubai Marina Dhow Cruise Dinner',
        'Flexible hotel options (3â˜…, 4â˜…, 5â˜…)'
      ],
      tourDetails: 'Dubai is a destination that rewards thoughtful planning. In just a few days, visitors can witness historic neighborhoods, futuristic skylines, golden deserts, and vibrant waterfronts. The Dubai Essential Experience is curated for travelers who want to see the highlights without feeling rushed or overwhelmed. This package begins with a smooth airport arrival and private hotel transfer, ensuring comfort from the very first moment. The sightseeing flow is structured to avoid early fatigueâ€”city tours are scheduled during favorable hours, while experiential activities such as desert safaris and dhow cruises are placed in the evenings for maximum comfort. A half-day Dubai city tour introduces both Old Dubai, with its traditional markets and cultural quarters, and New Dubai, showcasing architectural icons and modern infrastructure. The desert safari adds cultural depth, offering insight into Bedouin heritage through traditional activities and a relaxed BBQ dinner. A dedicated day for Burj Khalifa and Dubai Mall allows guests to explore at their own pace, followed by a scenic Marina Dhow Cruise Dinner, providing a calm and memorable conclusion to the journey. This tour is suitable year-round, with summer departures focusing on air-conditioned attractions and evening experiences. Hotel categories allow travelers to choose comfort levels without altering the core itinerary.',
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Hotel Transfer',
          description: 'Arrival at Dubai International Airport followed by private transfer to the hotel. Rest of the day at leisure.'
        },
        {
          day: 2,
          title: 'Dubai City Tour & Desert Safari',
          description: 'Morning half-day city tour covering major highlights of Old and New Dubai. Afternoon, desert safari with dune bashing, camp activities, and BBQ dinner.'
        },
        {
          day: 3,
          title: 'Burj Khalifa, Dubai Mall & Marina Dhow Cruise',
          description: 'Visit Dubai Mall and Burj Khalifa (ticket optional). Evening Marina Dhow Cruise with dinner.'
        },
        {
          day: 4,
          title: 'Departure',
          description: 'Private transfer to the airport for departure.'
        }
      ],
      price: 0,
      duration: '3 Nights / 4 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 4.7,
      packageCategory: 'regular'
    },
    {
      _id: 'dubai-grand-experience',
      title: 'Dubai Grand Experience',
      subtitle: '6 Nights / 7 Days Dubai Tour',
      about: 'The Dubai Grand Experience â€“ 6 Nights / 7 Days tour is thoughtfully curated for travelers who want to explore Dubai in depth while maintaining a relaxed and enjoyable pace. This itinerary allows guests to experience the city\'s iconic landmarks, cultural heritage, leisure attractions, and neighboring Abu Dhabi without feeling rushed.',
      services: [
        'Private airport transfers on arrival and departure',
        'Half-day Dubai city tour covering old and new Dubai',
        'Burj Khalifa and Dubai Mall visit',
        'Desert safari with BBQ dinner and cultural activities',
        'Full-day Abu Dhabi city tour with one optional park',
        'Dubai Frame, Miracle Garden, and Museum of the Future',
        'Dolphin show and Global Village evening visit',
        'Free day for shopping or optional activities',
        'Choice of 3â˜…, 4â˜…, or 5â˜… hotel accommodations'
      ],
      tourDetails: 'Abstract\nThe Dubai Grand Experience â€“ 6 Nights / 7 Days tour is thoughtfully curated for travelers who want to explore Dubai in depth while maintaining a relaxed and enjoyable pace. This itinerary allows guests to experience the city\'s iconic landmarks, cultural heritage, leisure attractions, and neighboring Abu Dhabi without feeling rushed.\nBy combining guided sightseeing with free leisure time, this package offers flexibility while ensuring that all major highlights are covered. It is especially suitable for families and travelers who value comfort, structured planning, and dependable local support throughout their journey.\n\nTour Overview\nDubai is not a city to be rushed. Its diversity, from ancient trading routes to ultra-modern architecture, requires time to fully appreciate. The Dubai Grand Experience is designed for travelers who want a more comprehensive understanding of the city and its surroundings.\n\nOver the course of seven days, guests explore Dubai\'s old quarters, modern skyline, desert landscapes, and world-famous attractions. The itinerary includes essential experiences such as a half-day city tour, Burj Khalifa and Dubai Mall visit, a traditional desert safari, and a relaxing dhow cruise through Dubai Marina.\n\nA full-day excursion to Abu Dhabi, the capital of the UAE, adds significant depth to the trip. This visit provides cultural and architectural contrast, helping travelers understand the broader national identity beyond Dubai.\n\nAdditional experiences such as Dubai Frame, Miracle Garden, and the Museum of the Future ensure exposure to both cultural storytelling and innovative design. The tour also includes a dolphin show and an evening visit to Global Village, offering entertainment suitable for all age groups.\n\nA dedicated free day allows guests to rest, shop, or add optional activities based on personal interests. This balance between planned sightseeing and leisure time makes the tour suitable year-round, including the summer season when many activities are scheduled indoors or during cooler evening hours.',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Dubai & Hotel Transfer',
          description: 'Arrive at Dubai International Airport, where you will be greeted by our representative and transferred privately to your hotel. After check-in, the remainder of the day is free for rest or a short walk around the hotel area. Overnight stay in Dubai.'
        },
        {
          day: 2,
          title: 'Half-Day Dubai City Tour, Burj Khalifa & Dubai Mall',
          description: 'After breakfast, depart for a half-day Dubai city tour on a shared basis. The tour introduces major cultural and modern landmarks, offering insight into the city\'s transformation. In the afternoon, proceed to Dubai Mall, followed by time at the Burj Khalifa area. Guests may choose to add observation deck tickets as an optional experience. Return to the hotel for overnight stay.'
        },
        {
          day: 3,
          title: 'Abu Dhabi City Tour with One Park',
          description: 'After breakfast, travel to Abu Dhabi for a full-day city tour on a shared basis. The tour includes major landmarks of the capital and one theme park visit (tickets arranged at actual cost). This day provides a broader understanding of the UAE\'s culture, governance, and architectural development. Return to Dubai in the evening. Overnight stay at the hotel.'
        },
        {
          day: 4,
          title: 'Dubai Frame, Miracle Garden, Museum of the Future & Marina Dhow Cruise Dinner',
          description: 'After breakfast, proceed for a sightseeing tour including Dubai Frame, Miracle Garden, and the Museum of the Future (entry tickets arranged separately). In the evening, enjoy a Marina Dhow Cruise Dinner on a sharing basis. Experience Dubai Marina\'s skyline from the water while enjoying a buffet dinner. Return to the hotel for overnight stay.'
        },
        {
          day: 5,
          title: 'Dolphin Show & Global Village Evening Tour',
          description: 'After breakfast, the day begins with a visit to a dolphin show, a popular attraction for families and children. In the evening, proceed to Global Village, a seasonal attraction offering international pavilions, shopping stalls, and live entertainment. Return to the hotel for overnight stay.'
        },
        {
          day: 6,
          title: 'Shopping & Free Day',
          description: 'After breakfast, enjoy a free day for shopping or independent exploration. Guests may visit malls, local markets, or add optional tours such as theme parks or cultural experiences. Overnight stay at the hotel.'
        },
        {
          day: 7,
          title: 'Departure',
          description: 'After breakfast and hotel check-out, you will be transferred privately to Dubai International Airport for your onward journey.'
        }
      ],
      price: 0,
      duration: '6 Nights / 7 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 4.8,
      packageCategory: 'regular'
    },
    {
      _id: 'dubai-signature-explorer',
      title: 'Dubai Signature Explorer',
      subtitle: '5 Nights / 6 Days Dubai Tour',
      about: 'The Dubai Signature Explorer â€“ 5 Nights / 6 Days tour is designed for travelers who wish to experience Dubai in a more immersive and relaxed way, without rushing through major attractions. This itinerary carefully balances guided sightseeing, iconic landmarks, cultural experiences, and personal free time, allowing guests to absorb the city at a comfortable pace.',
      services: [
        'Private airport transfers for arrival and departure',
        'Half-day Dubai city tour covering old and new districts',
        'Burj Khalifa and Dubai Mall visit',
        'Desert safari with BBQ dinner and cultural activities',
        'Full-day Abu Dhabi city tour with one optional theme park',
        'Free day for shopping and independent exploration',
        'Choice of Deluxe, Gold, or Platinum hotel categories'
      ],
      tourDetails: 'Abstract\nThe Dubai Signature Explorer â€“ 5 Nights / 6 Days tour is designed for travelers who wish to experience Dubai in a more immersive and relaxed way, without rushing through major attractions. This itinerary carefully balances guided sightseeing, iconic landmarks, cultural experiences, and personal free time, allowing guests to absorb the city at a comfortable pace.\nWith the inclusion of both Dubai and Abu Dhabi highlights, modern attractions, desert landscapes, and waterfront experiences, this tour offers a well-rounded introduction to the UAE. Whether you are traveling with family, as a couple, or independently, this package ensures smooth logistics, dependable service, and transparent planning from arrival to departure.\n\nTour Overview\nDubai is a city that rewards time. While shorter trips offer glimpses of its skyline, a 5-night stay allows travelers to truly settle in, explore beyond surface-level attractions, and enjoy the rhythm of the city.\n\nThe Dubai Signature Explorer tour begins with a relaxed arrival day, followed by guided sightseeing that introduces both Old and New Dubai. Guests gain cultural context through heritage districts and iconic landmarks while enjoying the convenience of shared city tours led by experienced guides.\n\nA dedicated Burj Khalifa and Dubai Mall visit allows time to appreciate the city\'s architectural achievements and retail culture. The experience is complemented by a desert safari, offering a striking contrast to the urban environment through natural landscapes and traditional entertainment.\n\nThe inclusion of a full-day Abu Dhabi city tour broadens the journey, showcasing the UAE\'s political and cultural capital. This addition provides perspective on the country\'s development beyond Dubai alone.\n\nUnlike tightly packed itineraries, this package intentionally includes a free shopping and leisure day, recognizing that travelers value flexibility, whether for relaxation, shopping, or optional experiences.\n\nThis tour is available year-round. While winter months are ideal for outdoor exploration, summer travel offers cost-effective pricing, with most activities conducted indoors or during cooler evening hours.\n\nKey Highlights',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Dubai & Hotel Transfer',
          description: 'Upon arrival at Dubai International Airport, our representative will welcome you and assist with a private transfer to your hotel. After check-in, the rest of the day is free for relaxation or light exploration nearby. Overnight stay at the hotel.'
        },
        {
          day: 2,
          title: 'Half-Day Dubai City Tour, Burj Khalifa & Dubai Mall',
          description: 'After breakfast, depart for a half-day Dubai city tour on a shared basis. This guided experience introduces you to both historic and modern areas of the city, providing cultural insight and orientation. In the afternoon, proceed to Dubai Mall, one of the world\'s largest shopping destinations, followed by a visit to the Burj Khalifa area (observation deck tickets can be arranged separately if required). Return to the hotel for overnight stay.'
        },
        {
          day: 3,
          title: 'Abu Dhabi City Tour with One Park',
          description: 'After breakfast, depart for a full-day Abu Dhabi city tour on a shared basis. The tour includes major landmarks of the UAE capital and one optional theme park (entry tickets arranged at actual cost). This day offers a deeper understanding of the country\'s cultural, political, and architectural development. Return to Dubai in the evening. Overnight stay at the hotel.'
        },
        {
          day: 4,
          title: 'Dubai Frame, Miracle Garden, Museum of the Future & Marina Dhow Cruise Dinner',
          description: 'After breakfast, proceed for a sightseeing day covering Dubai Frame, Miracle Garden, and the Museum of the Future (entry tickets arranged separately if required). In the evening, enjoy a Marina Dhow Cruise Dinner on a sharing basis. Relax aboard a traditional wooden dhow while cruising through Dubai Marina, accompanied by a buffet dinner and city views at night. Return to the hotel for overnight stay.'
        },
        {
          day: 5,
          title: 'Shopping & Global Village Evening Tour',
          description: 'After breakfast, the day is kept free for shopping and leisure. Guests may visit popular shopping areas, malls, or local markets. In the evening, proceed for a visit to Global Village, a seasonal cultural attraction featuring international pavilions, shopping stalls, and entertainment. Return to the hotel for overnight stay.'
        },
        {
          day: 6,
          title: 'Departure',
          description: 'After breakfast and check-out, you will be transferred privately to Dubai International Airport for your onward journey.'
        }
      ],
      price: 0,
      duration: '5 Nights / 6 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' },
        { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Desert Safari' }
      ],
      bookings: 0,
      rating: 4.8,
      packageCategory: 'regular'
    },
    {
      _id: 'classic-discovery-dubai-abu-dhabi',
      title: 'Classic Discovery of Dubai and Abu Dhabi',
      subtitle: '4 Nights / 5 Days Dubai Tour',
      about: 'The Dubai Classic Discovery â€“ 4 Nights / 5 Days tour is thoughtfully designed for travelers who want to experience Dubai in a balanced and unhurried way. This itinerary combines the city\'s iconic attractions, cultural experiences, and modern leisure with the added depth of an Abu Dhabi visit.',
      services: [
        'Private airport transfers for arrival and departure',
        'Half-day guided Dubai city tour covering old and new districts',
        'Desert Safari with BBQ dinner and cultural activities',
        'Evening Marina Dhow Cruise Dinner',
        'Abu Dhabi city tour with one optional theme park',
        'Free day for shopping and personal exploration',
        'Choice of 3-Star, 4-Star, or 5-Star hotels'
      ],
      tourDetails: '',
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Dubai & Marina Dhow Cruise Dinner',
          description: 'Upon arrival at Dubai International Airport, you will be greeted by our representative and transferred to your hotel in a private, air-conditioned vehicle. After check-in, the afternoon is kept free to allow you to rest or settle in. In the evening, you will proceed for a Marina Dhow Cruise Dinner on a sharing basis. Enjoy a relaxed cruise through Dubai Marina, surrounded by illuminated skyscrapers, while savoring an international buffet dinner. After the cruise, return to your hotel for an overnight stay.'
        },
        {
          day: 2,
          title: 'Dubai City Tour & Desert Safari with BBQ Dinner',
          description: 'After breakfast, depart for a half-day guided Dubai city tour on a shared basis. This tour introduces you to both historic and modern sides of Dubai, including traditional neighborhoods, cultural landmarks, and modern districts. Following the city tour, return to the hotel for rest. In the afternoon, you will be picked up for a desert safari experience in a shared 4x4 vehicle. Activities include dune bashing, sandboarding, and cultural performances at the desert camp. The evening concludes with a BBQ dinner before returning to the hotel.'
        },
        {
          day: 3,
          title: 'Abu Dhabi City Tour',
          description: 'After breakfast, proceed for a full-day Abu Dhabi city tour on a shared basis. This tour provides insight into the capital city of the UAE, known for its wide boulevards, cultural institutions, and modern landmarks. The itinerary includes major highlights and one optional theme park (entry tickets arranged separately). After completing the tour, return to Dubai in the evening for overnight stay.'
        },
        {
          day: 4,
          title: 'Free Day for Shopping & Leisure',
          description: 'This day is kept completely free for personal activities. Guests may explore Dubai Mall, visit Burj Khalifa (tickets can be arranged separately), shop at local markets, or simply relax at the hotel. This flexibility allows travelers to customize their experience based on interests and energy levels.'
        },
        {
          day: 5,
          title: 'Departure',
          description: 'After breakfast and hotel check-out, you will be transferred privately to Dubai International Airport for your onward journey.'
        }
      ],
      price: 0,
      duration: '4 Nights / 5 Days',
      location: 'Dubai, UAE',
      capacity: '2-6 Guests',
      packageType: 'domestic',
      place: 'dubai',
      images: [
        { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Skyline' },
        { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Burj Khalifa' },
        { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Abu Dhabi' },
        { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', alt: 'Dubai Marina' }
      ],
      bookings: 0,
      rating: 4.8,
      packageCategory: 'regular'
    }
  ];

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
        // Filter STRICTLY for regular packages (packageCategory must be 'Regular' or 'regular')
        let regularPackages = result.data.filter((pkg: Package) =>
          pkg.packageCategory && (
            pkg.packageCategory === 'Regular' ||
            pkg.packageCategory === 'regular'
          )
        );

        setPackages(regularPackages);
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

  const generateSlug = (title: string, id: string) => {
    return `${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading regular packages...</p>
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
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-md text-white border-white/30">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Regular Packages
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              Regular Dubai Tour Packages
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 opacity-90">
              Affordable and comfortable Dubai tours designed for budget-conscious travelers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                Budget-Friendly
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Great Value
              </Badge>
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
                  <h3 className="text-xl font-semibold text-[#1e1f44] mb-2">No regular packages found</h3>
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
                      Regular Packages
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
                              <Mountain className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <Badge className="absolute top-4 right-4 bg-white text-[#1e1f44]">
                            {pkg.price > 0 ? formatPrice(pkg.price) : 'Custom Pricing'}
                          </Badge>
                          <Badge className="absolute top-4 left-4 bg-primary text-white">
                            Regular
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
                            <Link href={`/packages/${generateSlug(pkg.title, pkg._id)}`} className="flex-1">
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

      {/* Why Choose Regular Packages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1e1f44] mb-4">
                Why Choose Regular Packages?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Perfect for travelers seeking quality experiences at affordable prices
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                  Great Value
                </h3>
                <p className="text-gray-600">
                  Quality tours at budget-friendly prices without compromising on comfort
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                  All Essential Experiences
                </h3>
                <p className="text-gray-600">
                  Visit Dubai's iconic landmarks and enjoy memorable experiences
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e1f44] mb-3">
                  Comfortable Travel
                </h3>
                <p className="text-gray-600">
                  Well-maintained vehicles and professional guides for a pleasant journey
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
              Explore More Options
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Check out our Premium and Luxury packages for enhanced experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/packages/premium">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  View Premium Packages
                </Button>
              </Link>
              <Link href="/packages/luxury">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
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

export default RegularPackagesPage;

