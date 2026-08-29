import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA7a33q9Hha0sl892c2VTuzFfsB2qTh17k';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('solo_trip_token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface GroupInfo {
  originCity: string; // e.g. "Delhi", "Bangalore", "Mumbai", "Chandigarh", "All-India"
  departurePoint: string; // e.g. "Kashmiri Gate Metro Gate No. 6, Delhi"
  groupName: string; // e.g. "Delhi Weekend Explorers Group"
  groupType: string; // e.g. "Youth & Solo Backpackers (20-35 yrs)"
  ageGroup: string; // e.g. "20 - 35 yrs"
  totalSeats: number;
  bookedSeats: number;
  nextBatchDate: string; // e.g. "Every Friday (12 Sep)"
  upcomingBatches: string[];
  tripCaptain: string;
  genderRatio?: string;
}

export interface Destination {
  id: string | number;
  name: string;
  location: string;
  country: string;
  state?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  category: 'Mountains' | 'Beach' | 'Culture' | 'Adventure' | 'Wildlife' | 'Wellness' | 'Heritage' | 'Nature' | 'Spiritual' | 'Offbeat';
  tags: string[];
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  price: number;
  duration: string;
  nights: number;
  days: number;
  about: string;
  bestTime: string;
  tripType: string;
  difficulty: string;
  groupSize: string;
  travelType?: 'Solo' | 'Group' | 'Both';
  groupInfo?: GroupInfo;
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
  inclusions: string[];
  exclusions: string[];
  reviews: {
    id: string | number;
    userName: string;
    userAvatar?: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface Story {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'Adventure' | 'Solo Life' | 'Tips' | 'Experiences';
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  date: string;
  readTime: string;
  likes: number;
  isLiked?: boolean;
}

export interface Discussion {
  id: string | number;
  title: string;
  content: string;
  category: 'General' | 'Safety' | 'Buddy Finder' | 'Tips' | 'Itinerary';
  author: {
    name: string;
    avatar?: string;
  };
  timeAgo: string;
  repliesCount: number;
  likesCount: number;
  isLiked?: boolean;
  replies?: {
    id: string | number;
    author: string;
    avatar?: string;
    timeAgo: string;
    content: string;
  }[];
}

export interface Booking {
  id: string;
  destinationId: string | number;
  destinationName: string;
  destinationImage: string;
  date: string;
  travelers: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Completed';
  bookedAt: string;
  userName: string;
  userEmail: string;
}

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: 'Manali, Himachal Pradesh',
    location: 'Manali, India',
    country: 'India',
    city: 'Manali',
    state: 'Himachal Pradesh',
    address: 'Old Manali & Solang Valley, Manali, Himachal Pradesh 175131',
    latitude: 32.2396,
    longitude: 77.1887,
    category: 'Mountains',
    tags: ['Mountains', 'Adventure', 'Nature'],
    rating: 4.8,
    reviewsCount: 120,
    price: 6999,
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    ],
    about: 'Manali is a beautiful hill station in Himachal Pradesh, known for its scenic beauty, snow-capped Himalayan peaks, vibrant cafe culture, and exhilarating adventure activities.',
    bestTime: 'Mar - Jun, Sep - Nov',
    tripType: 'Adventure, Leisure',
    difficulty: 'Easy to Moderate',
    groupSize: '1 - 14 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Delhi',
      departurePoint: 'Kashmiri Gate Metro Gate No. 6 & Majnu Ka Tilla, Delhi',
      groupName: 'Delhi Weekend Backpackers & Trekkers Batch',
      groupType: 'Young Professionals & Solo Backpackers (20-35 yrs)',
      ageGroup: '20 - 35 yrs',
      totalSeats: 14,
      bookedSeats: 10,
      nextBatchDate: 'Every Friday (12 Sep)',
      upcomingBatches: ['12 Sep 2026', '19 Sep 2026', '26 Sep 2026'],
      tripCaptain: 'Capt. Vikram (Certified Himalayan Trek Leader)',
      genderRatio: '50% Female / 50% Male'
    },
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Manali & Old Manali Exploration',
        description: 'Check into your solo-friendly hostel/hotel, meet fellow travelers, and explore Old Manali’s cozy riverside cafes, live acoustic music, and Manu Temple.'
      },
      {
        day: 2,
        title: 'Solang Valley & Adventure Sports',
        description: 'Head to Solang Valley for paragliding, zorbing, and breathtaking views of the Pir Panjal mountain range. Optional visit to Atal Tunnel.'
      },
      {
        day: 3,
        title: 'Jogini Waterfall Trek & Vashisht Hot Springs',
        description: 'A scenic 3km nature trek to Jogini Waterfall followed by relaxing sulfur hot springs in ancient Vashisht village.'
      },
      {
        day: 4,
        title: 'Mall Road Souvenirs & Departure',
        description: 'Leisure morning walk on Mall Road, picking up local cedar crafts and Tibetan souvenirs before boarding your return coach.'
      }
    ],
    inclusions: [
      '3 Nights accommodation in solo-friendly boutique stay',
      'Daily breakfast and welcome Himalayan dinner',
      'Certified local trek leader & mountain guide',
      'Private local transfers for Solang & Vashisht',
      'First aid & emergency backup support'
    ],
    exclusions: [
      'Personal adventure sports fees (paragliding/skiing)',
      'Lunch and beverages not mentioned',
      'Personal travel insurance'
    ],
    reviews: [
      {
        id: 101,
        userName: 'Aarav Sharma',
        rating: 5,
        date: '3 days ago',
        comment: 'Unbelievable experience! As a first-time solo traveler, I felt super safe and made friends for life around the evening bonfire.'
      },
      {
        id: 102,
        userName: 'Pooja Hegde',
        rating: 5,
        date: '2 weeks ago',
        comment: 'The Jogini waterfall trek and cafe recommendations were spot on. Highly recommend SoloTrip for solo female travelers!'
      }
    ]
  },
  {
    id: 2,
    name: 'Ubud, Bali',
    location: 'Ubud, Indonesia',
    country: 'Indonesia',
    city: 'Ubud',
    state: 'Bali',
    address: 'Jalan Raya Ubud, Gianyar Regency, Bali 80571, Indonesia',
    latitude: -8.5069,
    longitude: 115.2625,
    category: 'Culture',
    tags: ['Nature', 'Culture', 'Wellness'],
    rating: 4.7,
    reviewsCount: 89,
    price: 24999,
    duration: '6 Days / 5 Nights',
    days: 6,
    nights: 5,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
    ],
    about: 'Ubud is Bali’s cultural and spiritual heart, surrounded by emerald rainforests, tiered rice terraces, sacred Hindu temples, and world-class yoga retreats.',
    bestTime: 'Apr - Oct',
    tripType: 'Culture, Wellness',
    difficulty: 'Easy',
    groupSize: '1 - 10 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'All-India',
      departurePoint: 'Denpasar Ngurah Rai Airport, Bali (Pan-India Flight Connect)',
      groupName: 'International Solo Travelers Bali Batch',
      groupType: 'Wellness, Culture & Island Explorers',
      ageGroup: '22 - 40 yrs',
      totalSeats: 10,
      bookedSeats: 7,
      nextBatchDate: '25 Sep 2026',
      upcomingBatches: ['25 Sep 2026', '15 Oct 2026', '10 Nov 2026'],
      tripCaptain: 'Wayan Sudarta (Bali Island Host)',
      genderRatio: '60% Female / 40% Male'
    },
    itinerary: [
      { day: 1, title: 'Arrival & Welcome to Ubud', description: 'Arrive at Ngurah Rai Airport, transfer to Ubud eco-resort, evening sound healing meditation.' },
      { day: 2, title: 'Tegalalang Rice Terraces & Coffee Plantation', description: 'Early morning photography at the lush rice terraces and traditional Luwak coffee tasting.' },
      { day: 3, title: 'Sacred Monkey Forest & Saraswati Water Temple', description: 'Explore Ubud town center, the ancient monkey sanctuary, and local art markets.' },
      { day: 4, title: 'Campuhan Ridge Walk & Spa Day', description: 'Scenic green ridge nature walk followed by a traditional 2-hour Balinese massage.' },
      { day: 5, title: 'Mount Batur Sunrise Trek', description: 'Early dawn hike to the summit of active volcano Mount Batur with breakfast cooked over steam vents.' },
      { day: 6, title: 'Farewell Bali', description: 'Morning pool swim, breakfast, and airport transfer.' }
    ],
    inclusions: ['5 Nights accommodation with pool', 'Daily healthy breakfast', 'Mount Batur guided sunrise trek', 'Airport transfers'],
    exclusions: ['International flights', 'Visa on arrival fee'],
    reviews: [
      { id: 201, userName: 'Rohan Mehra', rating: 5, date: '1 month ago', comment: 'The sunrise hike on Mt. Batur was breathtaking! Ubud changed my perspective on life.' }
    ]
  },
  {
    id: 3,
    name: 'Spiti Valley Road Trip',
    location: 'Spiti, Himachal Pradesh',
    country: 'India',
    city: 'Kaza',
    state: 'Himachal Pradesh',
    address: 'Kaza & Chandratal Lake, Spiti Valley, Himachal Pradesh 172114',
    latitude: 32.2461,
    longitude: 78.0349,
    category: 'Adventure',
    tags: ['Adventure', 'Mountains', 'Road Trip'],
    rating: 4.9,
    reviewsCount: 142,
    price: 18999,
    duration: '7 Days / 6 Nights',
    days: 7,
    nights: 6,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    about: 'Spiti Valley is the legendary Middle Land between Tibet and India. Famous for high-altitude monasteries, crystal clear starry night skies, and raw mountain passes.',
    bestTime: 'Jun - Sep',
    tripType: 'Adventure, Expedition',
    difficulty: 'Moderate to High',
    groupSize: '1 - 10 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Delhi',
      departurePoint: 'Majnu Ka Tilla, New Delhi & Chandigarh Sector 43 ISBT',
      groupName: 'Delhi-Chandigarh Spiti Expedition Group',
      groupType: 'Roadtrippers, Photographers & Stargazers',
      ageGroup: '21 - 38 yrs',
      totalSeats: 10,
      bookedSeats: 7,
      nextBatchDate: '15 Sep 2026',
      upcomingBatches: ['15 Sep 2026', '22 Sep 2026', '29 Sep 2026'],
      tripCaptain: 'Rahul Negi (Spiti Expedition Lead)',
      genderRatio: '45% Female / 55% Male'
    },
    itinerary: [
      { day: 1, title: 'Shimla to Kalpa', description: 'Drive along Sutlej river with stunning views of Kinnaur Kailash.' },
      { day: 2, title: 'Kalpa to Tabo via Nako Lake', description: 'Visit 1000-year-old Tabo Monastery.' },
      { day: 3, title: 'Tabo to Kaza & Dhankar', description: 'Hike to Dhankar cliffside monastery and lake.' },
      { day: 4, title: 'Key Monastery & Kibber Village', description: 'Visit the world’s highest post office at Hikkim and high suspension bridge at Chicham.' },
      { day: 5, title: 'Kaza to Chandratal Lake', description: 'Camp near the mystical moon lake under billions of stars.' },
      { day: 6, title: 'Chandratal to Manali via Atal Tunnel', description: 'Cross Rohtang / Kunzum Pass into Manali.' },
      { day: 7, title: 'Departure', description: 'Bid farewell to new travel buddies.' }
    ],
    inclusions: ['4x4 SUV transportation throughout', 'Homestay & alpine tent accommodation', 'All meals included in Spiti'],
    exclusions: ['Personal medications', 'Entry permits if applicable'],
    reviews: [
      { id: 301, userName: 'Tanya Sengupta', rating: 5, date: 'May 2024', comment: 'Camping at Chandratal with SoloTrip was a dream come true.' }
    ]
  },
  {
    id: 4,
    name: 'Kasol & Tosh, Parvati Valley',
    location: 'Kasol, India',
    country: 'India',
    city: 'Kasol',
    state: 'Himachal Pradesh',
    address: 'Parvati Valley, Kullu District, Himachal Pradesh 175105',
    latitude: 32.0100,
    longitude: 77.3150,
    category: 'Mountains',
    tags: ['Trekking', 'Riverside', 'Cafe Culture'],
    rating: 4.6,
    reviewsCount: 75,
    price: 5499,
    duration: '3 Days / 2 Nights',
    days: 3,
    nights: 2,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
    ],
    about: 'Nestled along the rapid Parvati River, Kasol is the backpacking hub of the Himalayas with scenic trails, pine forests, and Israeli bakeries.',
    bestTime: 'Mar - Jun, Sep - Nov',
    tripType: 'Trek, Chill',
    difficulty: 'Easy',
    groupSize: '1 - 16 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Delhi',
      departurePoint: 'Vidhan Sabha Metro Station, Delhi & Chandigarh',
      groupName: 'Delhi Cafe & Mountain Wanderers Group',
      groupType: 'Weekend Backpackers & Solo Explorers',
      ageGroup: '19 - 32 yrs',
      totalSeats: 16,
      bookedSeats: 12,
      nextBatchDate: 'Every Thursday Evening',
      upcomingBatches: ['11 Sep 2026', '18 Sep 2026', '25 Sep 2026'],
      tripCaptain: 'Aanchal Verma (Community Host)',
      genderRatio: '55% Female / 45% Male'
    },
    itinerary: [
      { day: 1, title: 'Arrival & Riverside Walk', description: 'Explore Kasol market and riverside Israeli cafes.' },
      { day: 2, title: 'Trek to Tosh / Chalal', description: 'Scenic day trek through cedar woods to remote mountain village.' },
      { day: 3, title: 'Manikaran Hot Springs & Departure', description: 'Visit natural sulfur springs in Manikaran.' }
    ],
    inclusions: ['2 Nights hostel/homestay stay', 'Guided walk to Chalal village', 'Daily breakfast'],
    exclusions: ['Personal expenses'],
    reviews: [
      { id: 401, userName: 'Vivek Joshi', rating: 5, date: '1 week ago', comment: 'Perfect weekend escape for solo travelers from Delhi/Chandigarh.' }
    ]
  },
  {
    id: 5,
    name: 'Kyoto, Japan',
    location: 'Kyoto, Japan',
    country: 'Japan',
    city: 'Kyoto',
    state: 'Kansai',
    address: 'Gion & Arashiyama, Kyoto, Kyoto Prefecture, Japan',
    latitude: 35.0116,
    longitude: 135.7681,
    category: 'Culture',
    tags: ['Culture', 'Temples', 'Heritage'],
    rating: 4.9,
    reviewsCount: 64,
    price: 45999,
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    about: 'The former imperial capital of Japan, famed for thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
    bestTime: 'Mar - May, Oct - Nov',
    tripType: 'Heritage, Photography',
    difficulty: 'Easy',
    groupSize: '1 - 8 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'All-India',
      departurePoint: 'Kansai International Airport (KIX), Osaka/Kyoto',
      groupName: 'Japan Heritage Explorer Group',
      groupType: 'Culture & Photography Enthusiasts',
      ageGroup: '22 - 45 yrs',
      totalSeats: 8,
      bookedSeats: 5,
      nextBatchDate: '10 Oct 2026',
      upcomingBatches: ['10 Oct 2026', '24 Oct 2026', '14 Nov 2026'],
      tripCaptain: 'Kenji Sato (Kyoto Resident Host)',
      genderRatio: '50% Female / 50% Male'
    },
    itinerary: [
      { day: 1, title: 'Gion District & Traditional Tea Ceremony', description: 'Walk the historic geisha district of Gion.' },
      { day: 2, title: 'Fushimi Inari-taisha & 10,000 Torii Gates', description: 'Early morning hike through sacred orange torii gates.' },
      { day: 3, title: 'Arashiyama Bamboo Grove & Monkey Park', description: 'Stroll through towering green bamboo stalks.' },
      { day: 4, title: 'Kinkaku-ji (Golden Pavilion) & Zen Meditation', description: 'Visit the shimmering gold pavilion.' },
      { day: 5, title: 'Sayonara Kyoto', description: 'Bullet train to Tokyo or Kansai Airport.' }
    ],
    inclusions: ['4 Nights traditional Ryokan/Hostel accommodation', 'Unlimited Kyoto Metro Pass', 'Tea Ceremony Experience'],
    exclusions: ['International airfare', 'JR rail pass'],
    reviews: [
      { id: 501, userName: 'Elena Petrova', rating: 5, date: 'April 2024', comment: 'Japan is paradise for solo travelers. Safe, clean, and poetic.' }
    ]
  },
  {
    id: 6,
    name: 'Goa Beach Escape',
    location: 'Goa, India',
    country: 'India',
    city: 'North & South Goa',
    state: 'Goa',
    address: 'Anjuna & Palolem Beach, Goa 403509, India',
    latitude: 15.2993,
    longitude: 74.1240,
    category: 'Beach',
    tags: ['Beaches', 'Party', 'Watersports'],
    rating: 4.5,
    reviewsCount: 110,
    price: 8999,
    duration: '5 Days / 4 Nights',
    days: 5,
    nights: 4,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ],
    about: 'Sun-kissed Arabian sea beaches, Portuguese heritage architecture, beach shacks, sunset cruises, and lively night markets in Arambol & Palolem.',
    bestTime: 'Nov - Feb',
    tripType: 'Beach, Party, Leisure',
    difficulty: 'Easy',
    groupSize: '1 - 16 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Mumbai',
      departurePoint: 'Dadar TT Circle, Mumbai & Wakad, Pune (AC Sleeper Bus)',
      groupName: 'Mumbai-Pune Coastal Explorers Group',
      groupType: 'Young Professionals & Beach Lovers (21-36 yrs)',
      ageGroup: '21 - 36 yrs',
      totalSeats: 16,
      bookedSeats: 13,
      nextBatchDate: '18 Sep 2026',
      upcomingBatches: ['18 Sep 2026', '25 Sep 2026', '02 Oct 2026'],
      tripCaptain: 'Siddharth Rao (Goa Community Host)',
      genderRatio: '50% Female / 50% Male'
    },
    itinerary: [
      { day: 1, title: 'North Goa Check-in & Sunset at Vagator', description: 'Meet the crew at Anjuna beach hostel.' },
      { day: 2, title: 'Kayaking & Hidden Beach Hopping', description: 'Kayaking along the backwaters and Morjim beach.' },
      { day: 3, title: 'Fontainhas Latin Quarter & Spice Plantation', description: 'Heritage photo-walk in colorful Panjim.' },
      { day: 4, title: 'South Goa Palolem & Silent Noise Club', description: 'Relax at Palolem crescent bay.' },
      { day: 5, title: 'Beach Brunch & Farewell', description: 'Departure.' }
    ],
    inclusions: ['4 Nights beachfront boutique hostel', 'Daily breakfast', 'Sunset cruise ticket'],
    exclusions: ['Scooter rental fuel', 'Alcohol'],
    reviews: [
      { id: 601, userName: 'Kunal Singhania', rating: 5, date: '2 months ago', comment: 'Best Goa trip ever. Met amazing solo folks from 5 different countries!' }
    ]
  },
  {
    id: 7,
    name: 'Trek to Triund',
    location: 'Dharamshala, Himachal Pradesh',
    country: 'India',
    city: 'Dharamshala',
    state: 'Himachal Pradesh',
    address: 'Triund Ridge, McLeod Ganj, Dharamshala, Himachal Pradesh 176219',
    latitude: 32.2570,
    longitude: 76.3533,
    category: 'Adventure',
    tags: ['Adventure', 'Mountains', 'Camping'],
    rating: 4.8,
    reviewsCount: 98,
    price: 6999,
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
    ],
    about: 'Triund is the crown jewel of Dharamshala, situated in the lap of Dhauladhar ranges with panoramic views of Kangra Valley.',
    bestTime: 'Mar - Jun, Sep - Dec',
    tripType: 'Trek, Camping',
    difficulty: 'Moderate',
    groupSize: '1 - 14 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Delhi',
      departurePoint: 'Majnu Ka Tilla, Delhi & Sector 43, Chandigarh',
      groupName: 'Delhi Dhauladhar Trekking Batch',
      groupType: 'Beginner Trekkers & Nature Photographers',
      ageGroup: '20 - 35 yrs',
      totalSeats: 14,
      bookedSeats: 9,
      nextBatchDate: '12 Sep 2026',
      upcomingBatches: ['12 Sep 2026', '19 Sep 2026', '26 Sep 2026'],
      tripCaptain: 'Capt. Aman (Certified Mountain Guide)',
      genderRatio: '50% Female / 50% Male'
    },
    itinerary: [
      { day: 1, title: 'Arrive McLeodganj & Dalai Lama Temple', description: 'Explore Little Lhasa and Tibetan monastery.' },
      { day: 2, title: 'Trek to Triund Top & Sunset Camp', description: '4-5 hour picturesque trek to Triund ridge with stargazing.' },
      { day: 3, title: 'Sunrise over Dhauladhar & Descent to Bhagsu', description: 'Descend to Bhagsu waterfall and cafes.' },
      { day: 4, title: 'Departure', description: 'Farewell Dharamshala.' }
    ],
    inclusions: ['Dome tent camping with sleeping bags', 'Guides and porter support', 'All meals during trek'],
    exclusions: ['Personal porter fees'],
    reviews: [
      { id: 701, userName: 'Simran Walia', rating: 5, date: '3 weeks ago', comment: 'The view of snow peaks from Triund ridge is magical.' }
    ]
  },
  {
    id: 8,
    name: 'Rishikesh Adventure',
    location: 'Rishikesh, Uttarakhand',
    country: 'India',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    address: 'Tapovan & Shivpuri, Rishikesh, Uttarakhand 249192, India',
    latitude: 30.0869,
    longitude: 78.2676,
    category: 'Adventure',
    tags: ['Adventure', 'Rafting', 'Yoga'],
    rating: 4.5,
    reviewsCount: 87,
    price: 5499,
    duration: '3 Days / 2 Nights',
    days: 3,
    nights: 2,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80'
    ],
    about: 'Yoga capital of the world and thrill-seeker hotspot along the emerald Ganges, featuring white water rafting, cliff jumps, and Ganga Aarti.',
    bestTime: 'Sep - May',
    tripType: 'Adventure, Spiritual',
    difficulty: 'Easy',
    groupSize: '1 - 18 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Delhi',
      departurePoint: 'Akshardham Metro Station & Anand Vihar, Delhi',
      groupName: 'Delhi Adrenaline & River Rafting Batch',
      groupType: 'Adventure Seekers & Campers (20-34 yrs)',
      ageGroup: '20 - 34 yrs',
      totalSeats: 18,
      bookedSeats: 15,
      nextBatchDate: 'Every Weekend (Friday Night)',
      upcomingBatches: ['12 Sep 2026', '19 Sep 2026', '26 Sep 2026'],
      tripCaptain: 'Devendra Rawat (Certified River Guide)',
      genderRatio: '45% Female / 55% Male'
    },
    itinerary: [
      { day: 1, title: 'Riverside Camp Check-in & Triveni Ghat Aarti', description: 'Evening spiritual chants by the holy river.' },
      { day: 2, title: '16KM White Water Rafting & Cliff Jumping', description: 'Conquer the Roller Coaster and Golf Course rapids.' },
      { day: 3, title: 'Morning Yoga & Beatles Ashram Visit', description: 'Departure.' }
    ],
    inclusions: ['2 Nights riverside Swiss tent stay', '16km Ganga rafting with safety gear', 'Buffet meals'],
    exclusions: ['Bungee jumping ticket'],
    reviews: [
      { id: 801, userName: 'Deepak Joshi', rating: 4.8, date: 'May 2024', comment: 'Rafting was exhilarating! Felt totally safe with the instructor.' }
    ]
  },
  {
    id: 9,
    name: 'Jaipur Cultural Tour',
    location: 'Jaipur, Rajasthan',
    country: 'India',
    city: 'Jaipur',
    state: 'Rajasthan',
    address: 'Amer & Hawa Mahal, Jaipur, Rajasthan 302002, India',
    latitude: 26.9124,
    longitude: 75.7873,
    category: 'Culture',
    tags: ['Culture', 'Heritage', 'Palaces'],
    rating: 4.7,
    reviewsCount: 72,
    price: 9999,
    duration: '4 Days / 3 Nights',
    days: 4,
    nights: 3,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
    ],
    about: 'The Pink City of royalty, ancient hilltop fortresses, ornate palaces, colorful street bazaars, and delectable Rajasthani gastronomy.',
    bestTime: 'Oct - Mar',
    tripType: 'Heritage, Food Walk',
    difficulty: 'Easy',
    groupSize: '1 - 12 People',
    travelType: 'Both',
    groupInfo: {
      originCity: 'Delhi',
      departurePoint: 'Dhaula Kuan & IFFCO Chowk Gurgaon, Delhi-NCR',
      groupName: 'Delhi Heritage Walk & Forts Group',
      groupType: 'History, Foodies & Photography Enthusiasts',
      ageGroup: '21 - 42 yrs',
      totalSeats: 12,
      bookedSeats: 8,
      nextBatchDate: '19 Sep 2026',
      upcomingBatches: ['19 Sep 2026', '26 Sep 2026', '03 Oct 2026'],
      tripCaptain: 'Meera Rajput (Rajasthan Heritage Specialist)',
      genderRatio: '50% Female / 50% Male'
    },
    itinerary: [
      { day: 1, title: 'Hawa Mahal & City Palace Walk', description: 'Explore iconic honeycomb facade and royal museum.' },
      { day: 2, title: 'Amer Fort & Nahargarh Sunset', description: 'Panoramic sunset view over the pink city from Nahargarh fort.' },
      { day: 3, title: 'Jaipur Street Food & Block Printing Workshop', description: 'Taste authentic Dal Baati and make your own souvenir.' },
      { day: 4, title: 'Souvenir Shopping & Departure', description: 'Departure.' }
    ],
    inclusions: ['3 Nights heritage Haveli stay', 'Fort entry tickets & guide', 'Authentic Rajasthani thali dinner'],
    exclusions: ['Personal shopping'],
    reviews: [
      { id: 901, userName: 'Meera Rajput', rating: 5, date: '1 month ago', comment: 'Staying in an authentic Haveli and exploring the forts was magical.' }
    ]
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 1,
    title: 'My First Solo Trip to Spiti Valley',
    excerpt: 'How one spontaneous decision to pack a 40L backpack and head into the high-altitude trans-Himalayas cured my burnout.',
    content: 'Standing at the edge of Key Monastery in Spiti, hearing the distant chime of prayer bells echoing across the dry, rugged river valley, I felt a kind of quiet I hadn’t experienced in years. Travelling solo was terrifying for the first three hours at the bus stand, but by day two, I realized the world is filled with kindness. Local homestay families offered warm butter tea and stories around wood-burning stoves that no five-star resort could ever replicate.',
    coverImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    category: 'Adventure',
    author: {
      name: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Solo Backpacker'
    },
    date: 'May 12, 2024',
    readTime: '6 min read',
    likes: 142
  },
  {
    id: 2,
    title: '10 Life Lessons I Learned While Traveling Solo',
    excerpt: 'From overcoming fear of eating alone at restaurants to managing budgets on the road — the real transformations.',
    content: '1. You are far more capable than your anxious thoughts suggest. 2. Eating alone in a bustling restaurant is actually a superpower, not an embarrassment. 3. Google Maps will fail you in remote villages, but smiling and asking a local never does. 4. Less luggage equals more freedom. 5. You learn who your true friends are by who checks in when you’re across the world.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    category: 'Solo Life',
    author: {
      name: 'Rohit Verma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      role: 'Travel Writer'
    },
    date: 'April 28, 2024',
    readTime: '5 min read',
    likes: 210
  },
  {
    id: 3,
    title: 'Why Solo Travel is the Best Therapy',
    excerpt: 'Stepping out of your comfort zone creates space for genuine introspection and self-discovery.',
    content: 'When you take away the noise of everyday routines, social expectations, and constant notifications, your mind finally gets the room to reset. Solo travel isn’t about running away from problems — it’s about giving yourself the dedicated space to view life through an entirely fresh lens.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    category: 'Experiences',
    author: {
      name: 'Sneha Iyer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      role: 'Mindfulness Coach'
    },
    date: 'April 15, 2024',
    readTime: '4 min read',
    likes: 184
  },
  {
    id: 4,
    title: 'How to Stay Safe as a Solo Traveler in India',
    excerpt: 'Practical, battle-tested safety tips for train rides, homestays, emergency apps, and cultural etiquette.',
    content: 'Solo travel is empowering when paired with smart situational awareness. Always keep emergency offline maps downloaded, share your live trip location with trusted family, choose verified hostels or homestays with strong solo reviews, and keep physical copies of emergency numbers in your backpack.',
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    category: 'Tips',
    author: {
      name: 'Kabir Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Safety Advocate'
    },
    date: 'May 2, 2024',
    readTime: '7 min read',
    likes: 95
  }
];

export interface GalleryPhoto {
  id: string | number;
  imageUrl: string;
  caption: string;
  travelerName: string;
  travelerAvatar?: string;
  location: string;
  category: 'Mountains' | 'Beach' | 'Culture' | 'Adventure' | 'Group Fun' | 'Solo Moments';
  tripMode: 'Solo' | 'Group';
  date: string;
  likesCount: number;
  isLiked?: boolean;
}

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sunset laughter with our 12-member group batch at Anjuna Beach!',
    travelerName: 'Pooja Hegde & Mumbai Batch',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    location: 'Goa Beach Escape',
    category: 'Group Fun',
    tripMode: 'Group',
    date: 'Aug 2026',
    likesCount: 148
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Solo reflection at Key Monastery, Spiti. Pure silence and peace.',
    travelerName: 'Aarav Sharma',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location: 'Spiti Valley Road Trip',
    category: 'Mountains',
    tripMode: 'Solo',
    date: 'Jul 2026',
    likesCount: 230
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    caption: 'Delhi Wanderers Crew crossing the wooden bridge in Kasol valley.',
    travelerName: 'Capt. Vikram & Delhi Crew',
    travelerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    location: 'Kasol & Tosh, Parvati Valley',
    category: 'Group Fun',
    tripMode: 'Group',
    date: 'Aug 2026',
    likesCount: 95
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Conquered Triund summit at 2,875m! Snow-clad Dhauladhar peaks.',
    travelerName: 'Simran Walia',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Trek to Triund',
    category: 'Adventure',
    tripMode: 'Solo',
    date: 'Jun 2026',
    likesCount: 182
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Morning rice terrace walk in Ubud, Bali with fellow solo backpackers.',
    travelerName: 'Rohan Mehra',
    travelerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    location: 'Ubud, Bali',
    category: 'Culture',
    tripMode: 'Group',
    date: 'Jul 2026',
    likesCount: 310
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rafting down the mighty Ganges in Rishikesh! Best adrenaline rush ever.',
    travelerName: 'Delhi Adrenaline Batch',
    travelerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    location: 'Rishikesh Adventure',
    category: 'Adventure',
    tripMode: 'Group',
    date: 'Aug 2026',
    likesCount: 204
  }
];

export const INITIAL_DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    title: 'Best places for solo trip in June?',
    content: 'I have 10 days off in June and want to escape the summer heat. Looking for high mountain passes, moderate treks, and good hostel vibes. Would Spiti or Ladakh be better for a solo traveler?',
    category: 'Tips',
    author: { name: 'Wanderer_23' },
    timeAgo: '2h ago',
    repliesCount: 15,
    likesCount: 6,
    replies: [
      { id: 11, author: 'Himalayan_Soul', timeAgo: '1h ago', content: 'June is ideal for Spiti Valley as Rohtang and Kunzum pass open up! You will find plenty of solo backpackers in Kaza.' },
      { id: 12, author: 'NehaTravels', timeAgo: '45m ago', content: 'Ladakh via Manali-Leh highway is also magnificent in late June. Stay in Zostel Leh to easily join day trips.' }
    ]
  },
  {
    id: 2,
    title: 'How to stay safe while traveling solo?',
    content: 'Planning my first solo trip to South India. Any essential tips regarding transport, night arrivals, and staying connected?',
    category: 'Safety',
    author: { name: 'TravelWithNeha' },
    timeAgo: '5h ago',
    repliesCount: 23,
    likesCount: 8,
    replies: [
      { id: 21, author: 'SoloPriya', timeAgo: '3h ago', content: 'Always book trains/buses that arrive during daylight hours. Keep an Airtel/Jio SIM with backup powerbank at all times.' },
      { id: 22, author: 'Raj_Roads', timeAgo: '2h ago', content: 'Use the SoloTrip community to connect with other travelers heading in the same direction!' }
    ]
  },
  {
    id: 3,
    title: 'Looking for a travel buddy for Spiti trip',
    content: 'Hey everyone! I am doing a 7-day Spiti road trip starting from Manali on July 10th. Looking to share SUV cab costs and photography spots. Anyone interested in joining?',
    category: 'Buddy Finder',
    author: { name: 'BackpackerAnuj' },
    timeAgo: '1d ago',
    repliesCount: 12,
    likesCount: 5,
    replies: [
      { id: 31, author: 'Tanmay_K', timeAgo: '18h ago', content: 'I am planning Spiti around those dates! DMing you my contact details.' }
    ]
  },
  {
    id: 4,
    title: 'Hostel vs Homestay for first-time solo traveler?',
    content: 'Which one is better to start with? I want to meet people, but also value a quiet night of sleep.',
    category: 'General',
    author: { name: 'ExplorerSam' },
    timeAgo: '2d ago',
    repliesCount: 9,
    likesCount: 4,
    replies: [
      { id: 41, author: 'Arjun_V', timeAgo: '1d ago', content: 'Hostels are unmatched for meeting friends and joining group treks. You can always book a private room in a hostel for privacy!' }
    ]
  }
];

// Helper functions that provide dynamic CRUD operations with persistent storage
export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    const saved = localStorage.getItem('solotrip_destinations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Could not parse saved destinations:', err);
  }
  return INITIAL_DESTINATIONS;
};

export const fetchDestinationById = async (id: string | number): Promise<Destination | undefined> => {
  const all = await fetchDestinations();
  return all.find((d) => String(d.id) === String(id)) || INITIAL_DESTINATIONS.find((d) => String(d.id) === String(id)) || INITIAL_DESTINATIONS[0];
};

export const saveDestination = async (dest: Destination): Promise<Destination[]> => {
  const all = await fetchDestinations();
  const existingIdx = all.findIndex((d) => String(d.id) === String(dest.id));
  let updated: Destination[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = dest;
  } else {
    updated = [dest, ...all];
  }
  localStorage.setItem('solotrip_destinations', JSON.stringify(updated));
  return updated;
};

export const deleteDestination = async (id: string | number): Promise<Destination[]> => {
  const all = await fetchDestinations();
  const filtered = all.filter((d) => String(d.id) !== String(id));
  localStorage.setItem('solotrip_destinations', JSON.stringify(filtered));
  return filtered;
};

// Gallery Management Functions
export const fetchGalleryPhotos = async (): Promise<GalleryPhoto[]> => {
  try {
    const saved = localStorage.getItem('solotrip_gallery');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Could not parse saved gallery photos:', err);
  }
  return INITIAL_GALLERY_PHOTOS;
};

export const saveGalleryPhoto = async (photo: GalleryPhoto): Promise<GalleryPhoto[]> => {
  const all = await fetchGalleryPhotos();
  const existingIdx = all.findIndex((p) => String(p.id) === String(photo.id));
  let updated: GalleryPhoto[];
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = photo;
  } else {
    updated = [photo, ...all];
  }
  localStorage.setItem('solotrip_gallery', JSON.stringify(updated));
  return updated;
};

export const deleteGalleryPhoto = async (id: string | number): Promise<GalleryPhoto[]> => {
  const all = await fetchGalleryPhotos();
  const filtered = all.filter((p) => String(p.id) !== String(id));
  localStorage.setItem('solotrip_gallery', JSON.stringify(filtered));
  return filtered;
};

export const likeGalleryPhoto = async (id: string | number): Promise<GalleryPhoto[]> => {
  const all = await fetchGalleryPhotos();
  const updated = all.map((p) => {
    if (String(p.id) === String(id)) {
      const isLiked = !p.isLiked;
      return {
        ...p,
        isLiked,
        likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
      };
    }
    return p;
  });
  localStorage.setItem('solotrip_gallery', JSON.stringify(updated));
  return updated;
};

// Bookings Management Functions
export const fetchAllBookings = async (): Promise<Booking[]> => {
  try {
    const saved = localStorage.getItem('solotrip_bookings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Could not parse saved bookings:', err);
  }
  return [
    {
      id: 'BK-1049',
      destinationId: 1,
      destinationName: 'Manali, Himachal Pradesh',
      destinationImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      date: '2026-09-12',
      travelers: 1,
      totalPrice: 6999,
      status: 'Confirmed',
      bookedAt: '2026-08-27',
      userName: 'Aarav Sharma',
      userEmail: 'aarav.sharma@example.com'
    },
    {
      id: 'BK-1050',
      destinationId: 3,
      destinationName: 'Spiti Valley Road Trip',
      destinationImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      date: '2026-09-15',
      travelers: 2,
      totalPrice: 37998,
      status: 'Confirmed',
      bookedAt: '2026-08-28',
      userName: 'Pooja Hegde',
      userEmail: 'pooja.h@example.com'
    },
    {
      id: 'BK-1051',
      destinationId: 6,
      destinationName: 'Goa Beach Escape',
      destinationImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      date: '2026-09-18',
      travelers: 1,
      totalPrice: 8999,
      status: 'Pending',
      bookedAt: '2026-08-28',
      userName: 'Kunal Singhania',
      userEmail: 'kunal.s@example.com'
    }
  ];
};

export const updateBookingStatus = async (id: string, status: 'Confirmed' | 'Pending' | 'Completed'): Promise<Booking[]> => {
  const all = await fetchAllBookings();
  const updated = all.map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem('solotrip_bookings', JSON.stringify(updated));
  return updated;
};

export default api;

