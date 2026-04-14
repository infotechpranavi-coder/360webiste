export interface Destination {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  type?: 'package' | 'tour' | 'ticket';
}

export interface Trip {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  link: string;
  type?: 'package' | 'tour' | 'ticket';
}

export interface Package {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  price: string;
  image: string;
  link: string;
  type?: 'package' | 'tour' | 'ticket';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const destinations: Destination[] = [
  {
    id: '1',
    title: 'Cape Town Waterfront',
    subtitle: 'Beauty at the foot of Table Mountain',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages/1',
    type: 'package'
  },
  {
    id: '2',
    title: 'Kruger National Park',
    subtitle: 'Ultimate wildlife safari experience',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages',
    type: 'package'
  },
  {
    id: '3',
    title: 'Johannesburg City',
    subtitle: 'The vibrant heart of South Africa',
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages',
    type: 'package'
  },
  {
    id: '4',
    title: 'Garden Route Scenic Drive',
    subtitle: 'Majestic coastal landscapes',
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages',
    type: 'package'
  }
];

export const upcomingTrips: Trip[] = [
  {
    id: '1',
    title: 'Cape Town coastal drive',
    location: 'Western Cape',
    price: 'from R2,999',
    image: '/coast , south afirca.webp',
    link: '/packages/1',
    type: 'package'
  },
  {
    id: '2',
    title: 'Table Mountain Views',
    location: 'Cape Town',
    price: 'from R1,299',
    image: '/cape town,south africa.webp',
    link: '/packages/2',
    type: 'package'
  },
  {
    id: '3',
    title: 'Cape Town City Lights',
    location: 'Cape Town',
    price: 'from R1,999',
    image: '/cape town.webp',
    link: '/packages/3',
    type: 'package'
  }
];

export const popularPackages: Package[] = [
  {
    id: '1',
    title: 'Kruger Big Five Safari',
    subtitle: '4 Days / 3 Nights Wild Adventure',
    duration: '4 Days',
    price: 'R15,999',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages',
    type: 'package'
  },
  {
    id: '2',
    title: 'Cape Winelands Escape',
    subtitle: 'Vineyards and scenic valley views',
    duration: '3 Days',
    price: 'R8,499',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages/2',
    type: 'package'
  },
  {
    id: '3',
    title: 'Drakensberg Mountain Quest',
    subtitle: 'Hike the peaks of South Africa',
    duration: '5 Days',
    price: 'R12,899',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages/3',
    type: 'package'
  },
  {
    id: '4',
    title: 'Johannesburg Heritage',
    subtitle: 'Experience the City of Gold',
    duration: '6 Days',
    price: 'R18,999',
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/packages',
    type: 'package'
  },
  {
    id: '5',
    title: 'Table Mountain Explorer',
    subtitle: 'Urban culture and coastal beauty',
    duration: '5 Days',
    price: 'R11,499',
    image: '/cape town,south africa.webp',
    link: '/packages/5',
    type: 'package'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Olivia Mitchell',
    role: 'Student',
    quote: 'Our family trip to Kruger was absolutely magical. Sky Go handled everything from the private transfers to the lodge bookings perfectly. Truly a world-class experience!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'James Wilson',
    role: 'Photographer',
    quote: 'The Garden Route drive was the highlight of my photography career. The attention to detail and the pacing of the tour allowed me to capture some incredible shots. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Sophia Chen',
    role: 'Architect',
    quote: 'As an architect, I was blown away by the Zeitz MOCAA and the Waterfront redevelopment. The tour was enlightening and very well coordinated. Sky Go knows their stuff!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Marcus Thorne',
    role: 'Journalist',
    quote: 'Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Elena Rodriguez',
    role: 'Marketing Lead',
    quote: 'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'David Park',
    role: 'Software Engineer',
    quote: 'Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  }
];

export const exploreInclusions = [
  '24x7 Concierge Support',
  'Visa Assistance',
  'Packing & Equipment Rental',
  'Comprehensive Travel Insurance Assistance',
  'Airport Pick Up',
  'Centralized Hotel Locations',
  'Vetted Local Partners'
];
