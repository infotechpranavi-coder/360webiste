import connectDB from '../../../lib/mongodb';
import Package from '../../../models/Package';
import { isConnected } from '../../../lib/mongodb';

// Demo data for when database is unavailable
const getDemoPackages = () => {
  return [
    {
      _id: 'demo-1',
      title: 'Cape Town coastal adventure',
      subtitle: 'Explore the Mother City and its coast',
      about: 'Experience the best of Cape Town with our comprehensive coastal tour. Visit Table Mountain, enjoy the V&A Waterfront, and drive along the scenic Chapmans Peak for breathtaking ocean views.',
      services: 'Private airport transfers, Guided Table Mountain tour, V&A Waterfront exploration, Scenic coastal drives',
      tourDetails: 'Full-day Cape Town tour including Table Mountain cable car, Bo-Kaap heritage walk, and a sunset cruise from the Waterfront.',
      price: 1299,
      duration: '1 Day',
      location: 'Cape Town, South Africa',
      capacity: '2-8 persons',
      packageType: 'domestic',
      place: 'cape-town',
      packageCategory: 'Deluxe',
      images: [
        {
          public_id: 'demo-ct-1',
          url: '/cape town.webp',
          alt: 'Cape Town Skyline'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'The Mother City Highlights',
          description: 'Morning Cable Car ride to Table Mountain, afternoon Bo-Kaap cultural tour, and evening at the V&A Waterfront.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['Table Mountain tickets', 'Private vehicle', 'Expert Guide'],
      exclusions: ['Meals', 'Personal expenses'],
      reviews: [],
      bookings: 45,
      rating: 4.9,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'demo-2',
      title: 'Kruger Safari Experience',
      subtitle: 'The ultimate Big Five wildlife safari',
      about: 'Immerse yourself in the wild heart of South Africa. Witness lions, elephants, and leopards in their natural habitat with our expert trackers and luxurious bush LODGE stays.',
      services: 'Professional game drives, Luxury bush accommodation, Traditional boma dinners',
      tourDetails: 'Multi-day safari at a private concession within Kruger National Park, including sunrise and sunset game drives.',
      price: 8499,
      duration: '3 Days',
      location: 'Kruger Park, Mpumalanga',
      capacity: '2-12 persons',
      packageType: 'domestic',
      place: 'kruger',
      packageCategory: 'Luxury',
      images: [
        {
          public_id: 'demo-kruger-1',
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          alt: 'Kruger Wildlife'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'Into the Wild',
          description: 'Arrival at the lodge, afternoon game drive, and welcome dinner under the stars.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['All meals', 'All game drives', 'Conservation fees'],
      exclusions: ['Flights', 'Premium beverages'],
      reviews: [],
      bookings: 32,
      rating: 4.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'demo-3',
      title: 'Garden Route Scenic Quest',
      subtitle: 'Pristine beaches and magic forests',
      about: 'Journey through the most beautiful coastal stretch of South Africa. Explore Knysna, Plettenberg Bay, and the Tsitsikamma forest on this spectacular road trip.',
      services: 'Boutique hotel stays, Coastal hiking tours, Whale watching (seasonal)',
      tourDetails: 'Panoramic tour of the Garden Route including world-class beaches and indigenous forests.',
      price: 4999,
      duration: '4 Days',
      location: 'Garden Route, Western Cape',
      capacity: '1-10 persons',
      packageType: 'domestic',
      place: 'garden-route',
      packageCategory: 'Premium',
      images: [
        {
          public_id: 'demo-gr-1',
          url: '/coast , south afirca.webp',
          alt: 'Garden Route'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'The Forest & The Sea',
          description: 'Hiking in Tsitsikamma, crossing the suspension bridge, and staying in Knysna.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['Activity fees', 'Transport', 'Breakfast', 'Accommodation'],
      exclusions: ['Lunch and Dinner', 'Optional activities'],
      reviews: [],
      bookings: 28,
      rating: 4.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export default async function handler(req, res) {
  // Force connection attempt and wait a bit longer
  const dbConnection = await connectDB();
  const connected = isConnected();
  const useDemoData = !dbConnection || !connected;

  // Log connection status for debugging
  if (req.method === 'POST') {
    console.log('POST Request - Connection Status:', {
      hasConnection: !!dbConnection,
      isConnected: connected,
      useDemoData: useDemoData,
      hasEnvVar: !!process.env.MONGODB_URI
    });
  }

  if (req.method === 'GET') {
    try {
      if (useDemoData) {
        console.warn('Database not connected. Returning empty packages list.');
        return res.status(200).json({ success: true, data: [], demo: false, error: 'Database connection failed' });
      }

      const { search, popular, featured } = req.query;
      let query = {};

      // If search parameter is provided, create a search query
      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { subtitle: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { about: { $regex: search, $options: 'i' } },
            { tourDetails: { $regex: search, $options: 'i' } }
          ]
        };
      }

      // Add popular filter if requested
      if (popular === 'true') {
        query.isPopularPackage = true;
      }

      // Add featured filter if requested
      if (featured === 'true') {
        query.isFeaturedDestination = true;
      }

      const packages = await Package.find(query).sort({ createdAt: -1 });

      // Return empty array if no packages found instead of falling back to demo
      res.status(200).json({ success: true, data: packages });
    } catch (error) {
      console.error('Error fetching packages:', error.message);
      res.status(500).json({ success: false, data: [], error: error.message });
    }
  } else if (req.method === 'POST') {
    if (useDemoData) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Cannot save package in demo mode.'
      });
    }

    try {
      console.log('Received package data:', JSON.stringify(req.body, null, 2));
      const packageData = {
        ...req.body,
        duration: req.body.duration?.trim() || req.body.subtitle?.trim() || 'Flexible',
        capacity: req.body.capacity?.trim() || '2 Adults',
        subtitle: req.body.subtitle?.trim() || req.body.title?.trim() || 'Package',
      };
      const newPackage = new Package(packageData);
      const savedPackage = await newPackage.save();
      console.log('Package saved successfully:', savedPackage._id);
      res.status(201).json({ success: true, data: savedPackage });
    } catch (error) {
      console.error('Error creating package:', error);
      res.status(500).json({ success: false, error: error.message, details: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
