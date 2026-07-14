import connectDB, { ensureConnected, getDbUnavailableReason, isConnected } from '../../../lib/mongodb';
import Package from '../../../models/Package';

// Demo data helper
const getDemoPackage = (id) => {
  const demoPackages = [
    {
      _id: 'demo-1',
      title: 'Dubai City Tour',
      subtitle: 'Explore the stunning city of Dubai',
      about: 'Experience the best of Dubai with our comprehensive city tour package. Visit iconic landmarks, enjoy luxury shopping, and witness the perfect blend of traditional and modern architecture.',
      services: 'Customized travel planning, Guided tours & local experiences, Group & family vacations, Luxury & adventure travel',
      tourDetails: 'Full-day city tour including visits to Burj Khalifa, Dubai Mall, Palm Jumeirah, and traditional souks.',
      price: 299,
      duration: '1 Day',
      location: 'Dubai, UAE',
      capacity: '2-10 persons',
      packageType: 'international',
      place: 'dubai',
      packageCategory: 'Cultural',
      images: [
        {
          public_id: 'demo-dubai-1',
          url: '/placeholder.svg',
          alt: 'Dubai Skyline'
        }
      ],
      itinerary: [
        {
          day: 1,
          title: 'City Exploration',
          description: 'Morning visit to Burj Khalifa, afternoon shopping at Dubai Mall, evening desert safari.'
        }
      ],
      transportation: [],
      accommodation: [],
      inclusions: ['Entrance fees', 'Transportation', 'Guide'],
      exclusions: ['Meals', 'Personal expenses'],
      reviews: [],
      bookings: 25,
      rating: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  return demoPackages.find(pkg => pkg._id === id) || demoPackages[0];
};

export default async function handler(req, res) {
  const dbConnection = await connectDB();
  const { id } = req.query;
  const useDemoData = !dbConnection || !isConnected();

  if (req.method === 'GET') {
    try {
      if (useDemoData) {
        console.log('Using demo data for package:', id);
        const packageData = getDemoPackage(id);
        return res.status(200).json({ success: true, data: packageData, demo: true });
      }

      const packageData = await Package.findById(id);
      if (!packageData) {
        // Return demo data if not found
        console.log('Package not found, returning demo data');
        return res.status(200).json({ success: true, data: getDemoPackage(id), demo: true });
      }
      res.status(200).json({ success: true, data: packageData });
    } catch (error) {
      console.error('Error fetching package, using demo data:', error.message);
      res.status(200).json({ success: true, data: getDemoPackage(id), demo: true });
    }
  } else if (req.method === 'PUT') {
    const dbReady = await ensureConnected(5);
    if (!dbReady) {
      return res.status(503).json({
        success: false,
        error: `Database not available. Cannot update package. ${getDbUnavailableReason()}`,
      });
    }
    
    try {
      console.log('Updating package with ID:', id);
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      
      const packageData = await Package.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      if (!packageData) {
        console.log('Package not found with ID:', id);
        return res.status(404).json({ success: false, error: 'Package not found' });
      }
      
      console.log('Package updated successfully:', packageData._id);
      res.status(200).json({ success: true, data: packageData });
    } catch (error) {
      console.error('Error updating package:', error);
      res.status(500).json({ success: false, error: error.message, details: error.name });
    }
  } else if (req.method === 'DELETE') {
    const dbReady = await ensureConnected(5);
    if (!dbReady) {
      return res.status(503).json({
        success: false,
        error: `Database not available. Cannot delete package. ${getDbUnavailableReason()}`,
      });
    }
    
    try {
      const packageData = await Package.findByIdAndDelete(id);
      if (!packageData) {
        return res.status(404).json({ success: false, error: 'Package not found' });
      }
      res.status(200).json({ success: true, data: packageData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
