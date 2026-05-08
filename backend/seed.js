const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Trip = require('./models/Trip');
const Blog = require('./models/Blog');

const trips = [
  {
    name: "Tawang Monastery Circuit",
    slug: "tawang-monastery-circuit",
    state: "Arunachal Pradesh",
    location: "Guwahati → Tezpur → Bomdila → Dirang → Tawang",
    duration: 8,
    price: 18500,
    difficulty: "Hard",
    vehicleType: ["Bike", "Car"],
    description: "Conquer the legendary Sela Pass at 13,700 ft and discover the world's second largest Buddhist monastery in the mystical Tawang valley. This route offers breathtaking high-altitude landscapes, frozen lakes, and the warmth of Monpa tribal culture.",
    highlights: ["Sela Pass (13,700 ft)", "Tawang Monastery", "Madhuri Lake", "Nuranang Falls", "Bumla Pass (Indo-China border)", "Tribal homestays"],
    itinerary: [
      { day: 1, title: "Guwahati to Tezpur", description: "Drive along the Brahmaputra plains, crossing the iconic Saraighat Bridge. Overnight stay at Tezpur.", distance: "180 km", stay: "Hotel in Tezpur" },
      { day: 2, title: "Tezpur to Bomdila", description: "Enter Arunachal via Bhalukpong, climbing through lush valleys and thick forests.", distance: "170 km", stay: "Hotel in Bomdila" },
      { day: 3, title: "Bomdila to Dirang", description: "Short drive through apple orchards and Dirang Dzong fortress. Acclimatize at 4,900 ft.", distance: "43 km", stay: "Homestay in Dirang" },
      { day: 4, title: "Dirang to Tawang via Sela Pass", description: "The crown jewel — Sela Pass at 13,700 ft with Paradise Lake. Descend to Tawang valley.", distance: "140 km", stay: "Hotel in Tawang" },
      { day: 5, title: "Tawang Monastery & Town", description: "Explore the 17th-century monastery, war memorial, and Tawang town markets.", distance: "30 km local", stay: "Hotel in Tawang" },
      { day: 6, title: "Bumla Pass & Madhuri Lake", description: "Day trip to Indo-China border at Bumla Pass and the stunning Madhuri Lake (permit required).", distance: "80 km round trip", stay: "Hotel in Tawang" },
      { day: 7, title: "Tawang to Bomdila", description: "Return journey through Sela Pass. Stop at Nuranang Waterfall.", distance: "175 km", stay: "Hotel in Bomdila" },
      { day: 8, title: "Bomdila to Guwahati", description: "Final leg back to Guwahati through the foothills.", distance: "250 km", stay: "Home/Departure" }
    ],
    images: [
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      "https://images.unsplash.com/photo-1623074716796-d12c50a67e2d?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200",
    maxGroupSize: 8,
    rating: 4.9,
    reviewCount: 47,
    featured: true
  },
  {
    name: "Meghalaya Living Roots Explorer",
    slug: "meghalaya-living-roots-explorer",
    state: "Meghalaya",
    location: "Guwahati → Shillong → Cherrapunji → Mawlynnong → Dawki",
    duration: 6,
    price: 12800,
    difficulty: "Easy",
    vehicleType: ["Bike", "Car"],
    description: "Journey through the Scotland of the East — Meghalaya's rolling clouds, cleanest village, living root bridges, and the crystal-clear Umngot River at Dawki. A perfect blend of natural wonders and Khasi culture.",
    highlights: ["Living Root Bridges of Cherrapunji", "Mawlynnong (Cleanest Village in Asia)", "Dawki River Border", "Nohkalikai Falls", "Elephant Falls", "Double Decker Root Bridge Trek"],
    itinerary: [
      { day: 1, title: "Guwahati to Shillong", description: "Drive up to Shillong via Barapani Lake. Explore Police Bazar and Ward's Lake.", distance: "100 km", stay: "Hotel in Shillong" },
      { day: 2, title: "Shillong to Cherrapunji", description: "Morning at Elephant Falls, then to Cherrapunji — the wettest place on earth. Visit Nohkalikai Falls.", distance: "55 km", stay: "Resort in Cherrapunji" },
      { day: 3, title: "Double Decker Root Bridge Trek", description: "Trek down 3,500 steps to the iconic living double-decker root bridge. Swimming at Rainbow Falls.", distance: "Trek 15 km", stay: "Homestay in Tyrna" },
      { day: 4, title: "Cherrapunji to Mawlynnong", description: "Drive to Asia's cleanest village. Climb the sky walk for views of Bangladesh plains.", distance: "90 km", stay: "Eco cottage in Mawlynnong" },
      { day: 5, title: "Dawki Border and Return to Shillong", description: "Boating on the crystal Umngot River. Border view. Return to Shillong via scenic route.", distance: "120 km", stay: "Hotel in Shillong" },
      { day: 6, title: "Shillong to Guwahati", description: "Morning at Don Bosco Museum, then return to Guwahati.", distance: "100 km", stay: "Departure" }
    ],
    images: [
      "https://images.unsplash.com/photo-1598887141942-ab41e7e87be3?w=800",
      "https://images.unsplash.com/photo-1607893378714-007fd47c8719?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1598887141942-ab41e7e87be3?w=1200",
    maxGroupSize: 12,
    rating: 4.7,
    reviewCount: 63,
    featured: true
  },
  {
    name: "Kaziranga Bikers Trail",
    slug: "kaziranga-bikers-trail",
    state: "Assam",
    location: "Guwahati → Kaziranga → Majuli → Jorhat → Sivsagar",
    duration: 5,
    price: 9500,
    difficulty: "Easy",
    vehicleType: ["Bike", "Car"],
    description: "Ride through the heartland of Assam — home of the great one-horned rhino, the world's largest river island Majuli, and ancient Ahom kingdoms. Experience Assamese culture, tea gardens, and wildlife in one epic route.",
    highlights: ["Kaziranga National Park Safari", "Majuli River Island (World's Largest)", "Sivsagar Ahom Monuments", "Assam Tea Garden Visit", "Brahmaputra River Ferry", "Mishing Tribe Culture"],
    itinerary: [
      { day: 1, title: "Guwahati to Kaziranga", description: "Drive through the lush Assam plains to Kaziranga. Evening jeep safari in the national park.", distance: "225 km", stay: "Jungle lodge near Kaziranga" },
      { day: 2, title: "Kaziranga Safari & Onwards to Majuli", description: "Early morning elephant/jeep safari. Then drive to Nimati Ghat and take ferry to Majuli island.", distance: "140 km + ferry", stay: "Bamboo cottage in Majuli" },
      { day: 3, title: "Majuli Island Exploration", description: "Cycle through the island, visit Satras (Vaishnavite monasteries), witness mask-making crafts.", distance: "40 km cycling", stay: "Majuli homestay" },
      { day: 4, title: "Majuli to Sivsagar", description: "Ferry back to mainland, drive to the ancient Ahom capital. Visit Rang Ghar, Kareng Ghar.", distance: "100 km", stay: "Hotel in Sivsagar" },
      { day: 5, title: "Sivsagar to Jorhat to Guwahati", description: "Visit Jorhat's famous Tocklai Tea Research Institute, then return.", distance: "350 km", stay: "Departure" }
    ],
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200",
    maxGroupSize: 15,
    rating: 4.6,
    reviewCount: 38,
    featured: true
  },
  {
    name: "Mizoram Mizo Highland Ride",
    slug: "mizoram-mizo-highland-ride",
    state: "Mizoram",
    location: "Silchar → Aizawl → Champhai → Reiek → Lunglei",
    duration: 7,
    price: 16200,
    difficulty: "Moderate",
    vehicleType: ["Bike", "Car"],
    description: "Discover Mizoram's emerald hills, the friendly Mizo people, and the stunning border vistas near Myanmar. This lesser-known road trip rewards adventurers with pristine forests, terraced hillsides, and the magical blue poppy blooms.",
    highlights: ["Aizawl City Views", "Champhai Valley (near Myanmar border)", "Reiek Heritage Village", "Phawngpui Blue Mountain", "Tam Dil Lake", "Hmuifang Hill Station"],
    itinerary: [
      { day: 1, title: "Silchar to Aizawl", description: "Cross the border into Mizoram, winding roads up to Aizawl perched on steep ridges.", distance: "180 km", stay: "Hotel in Aizawl" },
      { day: 2, title: "Aizawl City", description: "Explore Mizoram State Museum, Solomon's Temple, and the iconic Bara Bazar.", distance: "Local", stay: "Hotel in Aizawl" },
      { day: 3, title: "Aizawl to Reiek", description: "Drive to Reiek Heritage Village — traditional Mizo village with stunning valley views.", distance: "30 km", stay: "Heritage homestay at Reiek" },
      { day: 4, title: "Reiek to Champhai", description: "Long but scenic ride to Champhai, gateway to Myanmar border.", distance: "200 km", stay: "Hotel in Champhai" },
      { day: 5, title: "Champhai Exploration", description: "Rih Dil Lake (considered the soul-resting lake by Mizo mythology), Myanmar border views.", distance: "60 km local", stay: "Hotel in Champhai" },
      { day: 6, title: "Champhai to Lunglei", description: "Drive south through deep river gorges to Lunglei — Mizoram's second city.", distance: "230 km", stay: "Hotel in Lunglei" },
      { day: 7, title: "Lunglei to Silchar", description: "Return journey through varied terrain back to Silchar.", distance: "250 km", stay: "Departure" }
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    maxGroupSize: 10,
    rating: 4.8,
    reviewCount: 22,
    featured: true
  },
  {
    name: "Ziro Valley Music & Culture Trail",
    slug: "ziro-valley-music-culture-trail",
    state: "Arunachal Pradesh",
    location: "Itanagar → Ziro → Daporijo → Along",
    duration: 9,
    price: 21000,
    difficulty: "Moderate",
    vehicleType: ["Bike", "Car"],
    description: "Home to the famous Ziro Music Festival and the ancient Apatani tribe known for face tattoos and nose plugs. Ride through Himalayan foothills, pine forests, and rice fields in this UNESCO tentative heritage site.",
    highlights: ["Ziro Music Festival (Sept)", "Apatani Tribal Villages", "Talley Valley Wildlife Sanctuary", "Pine forests", "Daporijo Suspension Bridge", "Subansiri River"],
    itinerary: [
      { day: 1, title: "Guwahati to Itanagar", description: "Drive to Arunachal Pradesh capital, visit Ita Fort and Buddhist monastery.", distance: "190 km", stay: "Hotel in Itanagar" },
      { day: 2, title: "Itanagar to Ziro", description: "Drive into the beautiful Ziro valley, passing through Hapoli.", distance: "115 km", stay: "Homestay in Ziro" },
      { day: 3, title: "Ziro Valley Exploration", description: "Visit Apatani tribal villages, rice paddies, and Pine Grove.", distance: "40 km local", stay: "Ziro homestay" },
      { day: 4, title: "Talley Valley Trek", description: "Day trek into Talley Valley Wildlife Sanctuary — biodiversity hotspot.", distance: "Trek 12 km", stay: "Ziro homestay" },
      { day: 5, title: "Ziro to Daporijo", description: "Challenging but beautiful mountain road to Daporijo on the Subansiri River.", distance: "175 km", stay: "Hotel in Daporijo" },
      { day: 6, title: "Daporijo & Tagin Tribe", description: "Explore Tagin tribal culture and the dramatic river valley landscapes.", distance: "Local", stay: "Daporijo" },
      { day: 7, title: "Daporijo to Along", description: "Drive south to Along (Aalo) on the Siang River.", distance: "200 km", stay: "Hotel in Along" },
      { day: 8, title: "Along to Pasighat", description: "Ride to Pasighat — Arunachal's oldest town on the Siang plain.", distance: "100 km", stay: "Hotel in Pasighat" },
      { day: 9, title: "Pasighat to Guwahati", description: "Final return through Jonai and North Lakhimpur.", distance: "350 km", stay: "Departure" }
    ],
    images: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200",
    maxGroupSize: 8,
    rating: 4.8,
    reviewCount: 19,
    featured: false
  },
  {
    name: "Garo Hills & Balpakram Adventure",
    slug: "garo-hills-balpakram-adventure",
    state: "Meghalaya",
    location: "Guwahati → Tura → Balpakram → Nokrek → Siju",
    duration: 5,
    price: 11000,
    difficulty: "Hard",
    vehicleType: ["Bike"],
    description: "The wild side of Meghalaya — deep gorge landscapes, the mysterious Balpakram National Park (land of perpetual winds), rare red panda territory, and the limestone caves of Siju. For hardcore adventure riders only.",
    highlights: ["Balpakram National Park", "Nokrek Biosphere Reserve", "Siju Cave (Bat Cave)", "Simsang River Rafting", "Tura Peak trek", "Garo tribal culture"],
    itinerary: [
      { day: 1, title: "Guwahati to Tura", description: "Long highway ride to Tura, the cultural capital of Garo Hills.", distance: "220 km", stay: "Hotel in Tura" },
      { day: 2, title: "Tura Peak & Nokrek", description: "Morning trek up Tura Peak, afternoon wildlife spotting in Nokrek Biosphere.", distance: "Trek + 40 km", stay: "Forest rest house" },
      { day: 3, title: "Balpakram National Park", description: "Full day exploration of the dramatic Balpakram gorge — land of spirits in Garo mythology.", distance: "60 km", stay: "Eco camp" },
      { day: 4, title: "Simsang River to Siju", description: "Rafting on Simsang River, then visit the famous Siju Bat Cave.", distance: "80 km", stay: "Guesthouse in Baghmara" },
      { day: 5, title: "Return to Guwahati", description: "Drive back north through the Assam-Meghalaya border.", distance: "300 km", stay: "Departure" }
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
    ],
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    maxGroupSize: 6,
    rating: 4.7,
    reviewCount: 14,
    featured: false
  }
];

const blogs = [
  {
    title: "Essential Bike Maintenance Tips Before Your Northeast India Trip",
    slug: "bike-maintenance-northeast-india",
    excerpt: "High altitude, monsoon roads, and remote areas demand your motorcycle be in perfect shape. Here's your pre-trip checklist.",
    content: `# Essential Bike Maintenance Tips\n\nNortheast India's roads can be brutal on unprepared motorcycles. Before you set off on any high-altitude Arunachal ride or the winding Meghalaya ghats, your bike must be road-ready.\n\n## 1. Chain & Sprocket Check\nReplace if worn more than 2mm. Carry extra chain links.\n\n## 2. Brakes\nFresh brake pads are non-negotiable for mountain descents.\n\n## 3. Tires\nUse dual-sport or knobby tires for off-road sections. Check pressure daily at altitude.\n\n## 4. Engine Oil\nChange before the trip. Carry 500ml extra.\n\n## 5. Air Filter\nClean for dusty highland roads.\n\nRemember: The nearest mechanic in Tawang is 140km from Sela Pass. Be prepared!`,
    tags: ["bike maintenance", "tips", "Northeast India", "Arunachal Pradesh"],
    category: "Bike Tips",
    published: true
  },
  {
    title: "Best Time to Visit Meghalaya: A Month-by-Month Guide",
    slug: "best-time-visit-meghalaya",
    excerpt: "Cherrapunji receives 12,000mm of rain annually. Timing your Meghalaya trip correctly makes all the difference.",
    content: `# Best Time to Visit Meghalaya\n\nMeghalaya, the 'abode of clouds', is beautiful year-round but each season offers a different experience.\n\n## October – February (Best Season)\nPost-monsoon clarity. Waterfalls at peak flow. Cool weather 10-20°C. Crystal clear Dawki River — perfect for boating.\n\n## March – May\nSpring flowers bloom. Moderate temperatures. Some waterfalls begin to dry.\n\n## June – September (Monsoon)\nMeghalaya's famous monsoon. Roads can be landslide-prone. But also — truly dramatic cloud scenes and the full power of Nohkalikai Falls.\n\nFor bikers: October-February is ideal. Roads are clear and the views are unforgettable.`,
    tags: ["Meghalaya", "travel tips", "weather", "best time"],
    category: "Destination Guide",
    published: true
  },
  {
    title: "The Inner Line Permit: Your Complete Guide for Arunachal Pradesh",
    slug: "inner-line-permit-arunachal",
    excerpt: "No visit to Arunachal Pradesh is possible without an Inner Line Permit. Here's everything you need to know.",
    content: `# Inner Line Permit for Arunachal Pradesh\n\nArunachal Pradesh is a protected area state, and all non-residents of Arunachal Pradesh require an Inner Line Permit (ILP).\n\n## Who Needs It?\nAll Indian citizens who are not permanent residents of Arunachal Pradesh.\n\n## How to Get It\n1. **Online**: Apply at eilt.nic.in\n2. **In Person**: Arunachal Pradesh House in Guwahati, Delhi, Kolkata, or Shillong\n\n## Required Documents\n- Aadhar Card / Passport\n- Passport-size photos (2)\n- Travel dates and entry point\n\n## Special Permits\nFor Tawang specifically, you also need a Protected Area Permit (PAP) — apply through the Arunachal Pradesh government.\n\n## Cost\nTypically ₹100 for 30 days, extendable.\n\nAlways carry physical copies on the road — check posts are frequent.`,
    tags: ["ILP", "permit", "Arunachal Pradesh", "travel documents"],
    category: "Travel Tips",
    published: true
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fukre-travels');
    console.log('Connected to MongoDB');

    await Trip.deleteMany({});
    await Blog.deleteMany({});

    // Create admin user
    let admin = await User.findOne({ email: 'admin@fukretravel.com' });
    if (!admin) {
      admin = await User.create({ name: 'Fukre Admin', email: 'admin@fukretravel.com', password: 'admin123', role: 'admin' });
      console.log('✅ Admin user created: admin@fukretravel.com / admin123');
    }

    const createdTrips = await Trip.insertMany(trips);
    console.log(`✅ ${createdTrips.length} trips seeded`);

    const blogData = blogs.map(b => ({ ...b, author: admin._id }));
    const createdBlogs = await Blog.insertMany(blogData);
    console.log(`✅ ${createdBlogs.length} blogs seeded`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
