const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const adminMiddleware = require('./Middleware/adminmiddleware');
const authMiddleware = require('./Middleware/authmiddleware');

require('dotenv').config();
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Models/User');
const Destination = require('./Models/Destination');
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });


/* =====================================================
   HOME
===================================================== */

app.get('/', (req, res) => {
  res.json({
    message: 'SafeTravel Backend is running!'
  });
});


/* =====================================================
   INDIAN STATES + UNION TERRITORIES
===================================================== */

const indianLocations = {

  'andhra pradesh': {
    name: 'Andhra Pradesh',
    country: 'India',
    latitude: 15.9129,
    longitude: 79.7400
  },

  'arunachal pradesh': {
    name: 'Arunachal Pradesh',
    country: 'India',
    latitude: 28.2180,
    longitude: 94.7278
  },

  'assam': {
    name: 'Assam',
    country: 'India',
    latitude: 26.2006,
    longitude: 92.9376
  },

  'bihar': {
    name: 'Bihar',
    country: 'India',
    latitude: 25.0961,
    longitude: 85.3131
  },

  'chhattisgarh': {
    name: 'Chhattisgarh',
    country: 'India',
    latitude: 21.2787,
    longitude: 81.8661
  },

  'goa': {
    name: 'Goa',
    country: 'India',
    latitude: 15.2993,
    longitude: 74.1240
  },

  'gujarat': {
    name: 'Gujarat',
    country: 'India',
    latitude: 22.2587,
    longitude: 71.1924
  },

  'haryana': {
    name: 'Haryana',
    country: 'India',
    latitude: 29.0588,
    longitude: 76.0856
  },

  'himachal pradesh': {
    name: 'Himachal Pradesh',
    country: 'India',
    latitude: 31.1048,
    longitude: 77.1734
  },

  'jharkhand': {
    name: 'Jharkhand',
    country: 'India',
    latitude: 23.6102,
    longitude: 85.2799
  },

  'karnataka': {
    name: 'Karnataka',
    country: 'India',
    latitude: 15.3173,
    longitude: 75.7139
  },

  'kerala': {
    name: 'Kerala',
    country: 'India',
    latitude: 10.8505,
    longitude: 76.2711
  },

  'madhya pradesh': {
    name: 'Madhya Pradesh',
    country: 'India',
    latitude: 22.9734,
    longitude: 78.6569
  },

  'maharashtra': {
    name: 'Maharashtra',
    country: 'India',
    latitude: 19.7515,
    longitude: 75.7139
  },

  'manipur': {
    name: 'Manipur',
    country: 'India',
    latitude: 24.6637,
    longitude: 93.9063
  },

  'meghalaya': {
    name: 'Meghalaya',
    country: 'India',
    latitude: 25.4670,
    longitude: 91.3662
  },

  'mizoram': {
    name: 'Mizoram',
    country: 'India',
    latitude: 23.1645,
    longitude: 92.9376
  },

  'nagaland': {
    name: 'Nagaland',
    country: 'India',
    latitude: 26.1584,
    longitude: 94.5624
  },

  'odisha': {
    name: 'Odisha',
    country: 'India',
    latitude: 20.9517,
    longitude: 85.0985
  },

  'orissa': {
    name: 'Odisha',
    country: 'India',
    latitude: 20.9517,
    longitude: 85.0985
  },

  'punjab': {
    name: 'Punjab',
    country: 'India',
    latitude: 31.1471,
    longitude: 75.3412
  },

  'rajasthan': {
    name: 'Rajasthan',
    country: 'India',
    latitude: 27.0238,
    longitude: 74.2179
  },

  'sikkim': {
    name: 'Sikkim',
    country: 'India',
    latitude: 27.5330,
    longitude: 88.5122
  },

  'tamil nadu': {
    name: 'Tamil Nadu',
    country: 'India',
    latitude: 11.1271,
    longitude: 78.6569
  },

  'telangana': {
    name: 'Telangana',
    country: 'India',
    latitude: 18.1124,
    longitude: 79.0193
  },

  'tripura': {
    name: 'Tripura',
    country: 'India',
    latitude: 23.9408,
    longitude: 91.9882
  },

  'uttar pradesh': {
    name: 'Uttar Pradesh',
    country: 'India',
    latitude: 26.8467,
    longitude: 80.9462
  },

  'uttarakhand': {
    name: 'Uttarakhand',
    country: 'India',
    latitude: 30.0668,
    longitude: 79.0193
  },

  'west bengal': {
    name: 'West Bengal',
    country: 'India',
    latitude: 22.9868,
    longitude: 87.8550
  },


  /* ===================================================
     UNION TERRITORIES
  =================================================== */

  'andaman and nicobar islands': {
    name: 'Andaman and Nicobar Islands',
    country: 'India',
    latitude: 11.7401,
    longitude: 92.6586
  },

  'chandigarh': {
    name: 'Chandigarh',
    country: 'India',
    latitude: 30.7333,
    longitude: 76.7794
  },

  'dadra and nagar haveli and daman and diu': {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    country: 'India',
    latitude: 20.3974,
    longitude: 72.8328
  },

  'delhi': {
    name: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090
  },

  'jammu and kashmir': {
    name: 'Jammu and Kashmir',
    country: 'India',
    latitude: 33.7782,
    longitude: 76.5762
  },

  'ladakh': {
    name: 'Ladakh',
    country: 'India',
    latitude: 34.1526,
    longitude: 77.5771
  },

  'lakshadweep': {
    name: 'Lakshadweep',
    country: 'India',
    latitude: 10.5667,
    longitude: 72.6417
  },

  'puducherry': {
    name: 'Puducherry',
    country: 'India',
    latitude: 11.9416,
    longitude: 79.8083
  },

  'pondicherry': {
    name: 'Puducherry',
    country: 'India',
    latitude: 11.9416,
    longitude: 79.8083
  }

};


/* =====================================================
   FAMOUS TOURIST PLACES
   28 STATES + 8 UNION TERRITORIES
===================================================== */

const indianTouristPlaces = {

  'andhra pradesh': [
    'Tirupati',
    'Araku Valley',
    'Visakhapatnam',
    'Vijayawada',
    'Amaravati'
  ],

  'arunachal pradesh': [
    'Tawang',
    'Ziro Valley',
    'Bomdila',
    'Itanagar',
    'Sela Pass'
  ],

  'assam': [
    'Kaziranga National Park',
    'Guwahati',
    'Majuli',
    'Sivasagar',
    'Manas National Park'
  ],

  'bihar': [
    'Bodh Gaya',
    'Nalanda',
    'Rajgir',
    'Patna',
    'Vaishali'
  ],

  'chhattisgarh': [
    'Chitrakote Falls',
    'Tirathgarh Falls',
    'Bastar',
    'Mainpat',
    'Barnawapara Wildlife Sanctuary'
  ],

  'goa': [
    'Baga Beach',
    'Calangute Beach',
    'Fort Aguada',
    'Dudhsagar Falls',
    'Basilica of Bom Jesus'
  ],

  'gujarat': [
    'Statue of Unity',
    'Rann of Kutch',
    'Gir National Park',
    'Somnath',
    'Dwarka'
  ],

  'haryana': [
    'Kurukshetra',
    'Sultanpur National Park',
    'Pinjore Gardens',
    'Morni Hills',
    'Panipat'
  ],

  'himachal pradesh': [
    'Shimla',
    'Manali',
    'Dharamshala',
    'Kasol',
    'Spiti Valley'
  ],

  'jharkhand': [
    'Deoghar',
    'Netarhat',
    'Hundru Falls',
    'Betla National Park',
    'Dassam Falls'
  ],

  'karnataka': [
    'Mysore Palace',
    'Hampi',
    'Coorg',
    'Gokarna',
    'Jog Falls'
  ],

  'kerala': [
    'Munnar',
    'Alappuzha',
    'Wayanad',
    'Thekkady',
    'Kovalam'
  ],

  'madhya pradesh': [
    'Khajuraho',
    'Bandhavgarh National Park',
    'Kanha National Park',
    'Sanchi',
    'Pachmarhi'
  ],

  'maharashtra': [
    'Gateway of India',
    'Ajanta Caves',
    'Ellora Caves',
    'Mahabaleshwar',
    'Lonavala'
  ],

  'manipur': [
    'Loktak Lake',
    'Keibul Lamjao National Park',
    'Imphal',
    'Kangla Fort',
    'Shirui Hills'
  ],

  'meghalaya': [
    'Shillong',
    'Cherrapunji',
    'Mawlynnong',
    'Dawki',
    'Nohkalikai Falls'
  ],

  'mizoram': [
    'Aizawl',
    'Reiek',
    'Vantawng Falls',
    'Phawngpui National Park',
    'Tam Dil'
  ],

  'nagaland': [
    'Kohima',
    'Dzukou Valley',
    'Khonoma',
    'Mokokchung',
    'Naga Heritage Village'
  ],

  'odisha': [
    'Puri',
    'Konark Sun Temple',
    'Bhubaneswar',
    'Chilika Lake',
    'Simlipal National Park'
  ],

  'punjab': [
    'Golden Temple',
    'Jallianwala Bagh',
    'Wagah Border',
    'Patiala',
    'Anandpur Sahib'
  ],

  'rajasthan': [
    'Jaipur',
    'Udaipur',
    'Jaisalmer',
    'Jodhpur',
    'Mount Abu'
  ],

  'sikkim': [
    'Gangtok',
    'Tsomgo Lake',
    'Nathula Pass',
    'Pelling',
    'Yuksom'
  ],

  'tamil nadu': [
    'Ooty',
    'Kodaikanal',
    'Chennai',
    'Madurai',
    'Rameswaram'
  ],

  'telangana': [
    'Hyderabad',
    'Charminar',
    'Golconda Fort',
    'Warangal',
    'Hussain Sagar Lake'
  ],

  'tripura': [
    'Agartala',
    'Ujjayanta Palace',
    'Neermahal',
    'Unakoti',
    'Sepahijala Wildlife Sanctuary'
  ],

  'uttar pradesh': [
    'Taj Mahal',
    'Varanasi',
    'Agra Fort',
    'Lucknow',
    'Ayodhya'
  ],

  'uttarakhand': [
    'Rishikesh',
    'Nainital',
    'Mussoorie',
    'Kedarnath',
    'Valley of Flowers'
  ],

  'west bengal': [
    'Darjeeling',
    'Victoria Memorial',
    'Sundarbans',
    'Kolkata',
    'Digha'
  ],


  /* ===================================================
     UNION TERRITORIES
  =================================================== */

  'andaman and nicobar islands': [
    'Port Blair',
    'Havelock Island',
    'Radhanagar Beach',
    'Neil Island',
    'Cellular Jail'
  ],

  'chandigarh': [
    'Rock Garden',
    'Sukhna Lake',
    'Rose Garden',
    'Capitol Complex',
    'Terraced Garden'
  ],

  'dadra and nagar haveli and daman and diu': [
    'Daman',
    'Diu',
    'Devka Beach',
    'Naida Caves',
    'Silvassa'
  ],

  'delhi': [
    'India Gate',
    'Red Fort',
    'Qutub Minar',
    'Lotus Temple',
    'Humayun’s Tomb'
  ],

  'jammu and kashmir': [
    'Srinagar',
    'Gulmarg',
    'Pahalgam',
    'Sonamarg',
    'Dal Lake'
  ],

  'ladakh': [
    'Leh',
    'Pangong Lake',
    'Nubra Valley',
    'Khardung La',
    'Magnetic Hill'
  ],

  'lakshadweep': [
    'Agatti Island',
    'Bangaram Island',
    'Kavaratti',
    'Minicoy Island',
    'Kalpeni Island'
  ],

  'puducherry': [
    'Promenade Beach',
    'Auroville',
    'Sri Aurobindo Ashram',
    'Paradise Beach',
    'French Quarter'
  ]

};


/* =====================================================
   COUNTRY TOURIST PLACES
===================================================== */

const countryTouristPlaces = {

  'india': [
    'Taj Mahal',
    'Kerala Backwaters',
    'Jaipur',
    'Goa',
    'Varanasi'
  ],

  'united states': [
    'Statue of Liberty',
    'Grand Canyon',
    'Yellowstone National Park',
    'Times Square',
    'Golden Gate Bridge'
  ],

  'usa': [
    'Statue of Liberty',
    'Grand Canyon',
    'Yellowstone National Park',
    'Times Square',
    'Golden Gate Bridge'
  ],

  'united kingdom': [
    'Big Ben',
    'Tower of London',
    'Stonehenge',
    'Edinburgh Castle',
    'Buckingham Palace'
  ],

  'uk': [
    'Big Ben',
    'Tower of London',
    'Stonehenge',
    'Edinburgh Castle',
    'Buckingham Palace'
  ],

  'france': [
    'Eiffel Tower',
    'Louvre Museum',
    'Palace of Versailles',
    'Mont-Saint-Michel',
    'French Riviera'
  ],

  'italy': [
    'Colosseum',
    'Venice',
    'Leaning Tower of Pisa',
    'Amalfi Coast',
    'Vatican City'
  ],

  'spain': [
    'Sagrada Familia',
    'Alhambra',
    'Park Güell',
    'Seville Cathedral',
    'Ibiza'
  ],

  'germany': [
    'Brandenburg Gate',
    'Neuschwanstein Castle',
    'Berlin Wall',
    'Cologne Cathedral',
    'Black Forest'
  ],

  'switzerland': [
    'Matterhorn',
    'Jungfraujoch',
    'Lake Geneva',
    'Interlaken',
    'Lucerne'
  ],

  'japan': [
    'Mount Fuji',
    'Tokyo Skytree',
    'Fushimi Inari Shrine',
    'Kiyomizu-dera',
    'Osaka Castle'
  ],

  'china': [
    'Great Wall of China',
    'Forbidden City',
    'Terracotta Army',
    'Zhangjiajie',
    'The Bund'
  ],

  'thailand': [
    'Grand Palace',
    'Phi Phi Islands',
    'Railay Beach',
    'Wat Arun',
    'Chiang Mai'
  ],

  'singapore': [
    'Marina Bay Sands',
    'Gardens by the Bay',
    'Sentosa Island',
    'Merlion Park',
    'Singapore Zoo'
  ],

  'malaysia': [
    'Petronas Twin Towers',
    'Langkawi',
    'George Town',
    'Batu Caves',
    'Mount Kinabalu'
  ],

  'indonesia': [
    'Bali',
    'Borobudur Temple',
    'Komodo National Park',
    'Mount Bromo',
    'Jakarta'
  ],

  'australia': [
    'Sydney Opera House',
    'Great Barrier Reef',
    'Uluru',
    'Great Ocean Road',
    'Bondi Beach'
  ],

  'new zealand': [
    'Milford Sound',
    'Hobbiton',
    'Queenstown',
    'Mount Cook',
    'Rotorua'
  ],

  'uae': [
    'Burj Khalifa',
    'Sheikh Zayed Grand Mosque',
    'Palm Jumeirah',
    'Dubai Marina',
    'Dubai Mall'
  ],

  'united arab emirates': [
    'Burj Khalifa',
    'Sheikh Zayed Grand Mosque',
    'Palm Jumeirah',
    'Dubai Marina',
    'Dubai Mall'
  ],

  'canada': [
    'Niagara Falls',
    'Banff National Park',
    'CN Tower',
    'Jasper National Park',
    'Vancouver'
  ],

  'brazil': [
    'Christ the Redeemer',
    'Copacabana Beach',
    'Iguazu Falls',
    'Sugarloaf Mountain',
    'Amazon Rainforest'
  ],

  'south africa': [
    'Table Mountain',
    'Kruger National Park',
    'Cape of Good Hope',
    'Boulders Beach',
    'Garden Route'
  ],

  'egypt': [
    'Pyramids of Giza',
    'Valley of the Kings',
    'Abu Simbel',
    'Karnak Temple',
    'Nile River'
  ],

  'turkey': [
    'Hagia Sophia',
    'Cappadocia',
    'Blue Mosque',
    'Pamukkale',
    'Ephesus'
  ],

  'nepal': [
    'Mount Everest',
    'Kathmandu Durbar Square',
    'Pokhara',
    'Chitwan National Park',
    'Pashupatinath Temple'
  ],

  'bhutan': [
    'Tiger’s Nest',
    'Punakha Dzong',
    'Thimphu',
    'Dochula Pass',
    'Phobjikha Valley'
  ],

  'sri lanka': [
    'Sigiriya',
    'Temple of the Tooth',
    'Ella',
    'Galle Fort',
    'Yala National Park'
  ],

  'maldives': [
    'Malé',
    'Maafushi',
    'Hulhumale',
    'Ari Atoll',
    'Baa Atoll'
  ],

  'greece': [
    'Acropolis of Athens',
    'Santorini',
    'Mykonos',
    'Meteora',
    'Crete'
  ],

  'portugal': [
    'Lisbon',
    'Porto',
    'Sintra',
    'Algarve',
    'Madeira'
  ],

  'netherlands': [
    'Amsterdam Canals',
    'Rijksmuseum',
    'Keukenhof',
    'Kinderdijk',
    'Van Gogh Museum'
  ],

  'south korea': [
    'Gyeongbokgung Palace',
    'N Seoul Tower',
    'Jeju Island',
    'Bukchon Hanok Village',
    'Busan'
  ],

  'vietnam': [
    'Ha Long Bay',
    'Hoi An',
    'Ho Chi Minh City',
    'Hanoi',
    'Phong Nha Caves'
  ],

  'philippines': [
    'Boracay',
    'Palawan',
    'Chocolate Hills',
    'Cebu',
    'Manila'
  ],

  'mexico': [
    'Chichen Itza',
    'Cancun',
    'Tulum',
    'Mexico City',
    'Copper Canyon'
  ]

};


/* =====================================================
   DESTINATION ALIASES
===================================================== */

const destinationAliases = {

  'malapuram': 'malappuram',
  'pondicherry': 'puducherry',
  'trivandrum': 'thiruvananthapuram',
  'bangalore': 'bengaluru',
  'new delhi': 'delhi',
  'orissa': 'odisha',
  'usa': 'united states',
  'uk': 'united kingdom',
  'uae': 'united arab emirates'

};


/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalizeText(value) {

  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

}


/* =====================================================
   GET TOURIST PLACES
===================================================== */

function getTouristPlaces(destination, country) {

  const destinationKey =
    normalizeText(destination);

  const countryKey =
    normalizeText(country);


  /* Indian state / UT */

  if (indianTouristPlaces[destinationKey]) {

    return indianTouristPlaces[destinationKey];

  }


  /* Country */

  if (countryTouristPlaces[countryKey]) {

    return countryTouristPlaces[countryKey];

  }


  /* Country alias */

  const countryAlias =
    destinationAliases[countryKey];

  if (
    countryAlias &&
    countryTouristPlaces[countryAlias]
  ) {

    return countryTouristPlaces[countryAlias];

  }


  /* If a specific tourist place was searched,
     return that place only */

  if (destination) {

    return [destination];

  }


  return [];


  function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

}

async function getDestinationImage(destination) {
  const place = normalizeText(destination);

  // Existing curated tourism photographs.
  const tourismImages = {
    kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85',
    munnar: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1400&q=85',
    malappuram: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=85',
    thiruvananthapuram: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85',
    trivandrum: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85',
    goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85',
    'baga beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
    sikkim: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    gangtok: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',
    manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85',
    shimla: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85',
    paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=85',
    afghanistan: 'https://images.pexels.com/photos/11855445/pexels-photo-11855445.jpeg',
    london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=85',
    dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
    tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=85',
    singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1400&q=85',
    switzerland: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1400&q=85',
    'taj mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
    jaipur: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1400&q=85',
    agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
    maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=85',
    bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85',
    'new york': 'https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=1400&q=85',
    rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=85',
    colosseum: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=85',
    sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=85'
  };

  const aliases = {
    malapuram: 'malappuram',
    trivandrum: 'thiruvananthapuram',
    pondicherry: 'puducherry',
    'new delhi': 'delhi',
    bangalore: 'bengaluru'
  };

  const key = aliases[place] || place;

  // 1. Use a curated image when one exists.
  if (tourismImages[key]) {
    return tourismImages[key];
  }

  // 2. Otherwise, search destinations saved by the admin.
  try {
    const savedDestination = await Destination.findOne({
      $or: [
        { name: { $regex: `^${escapeRegExp(destination.trim())}$`, $options: 'i' } },
        { name: { $regex: `^${escapeRegExp(place)}$`, $options: 'i' } }
      ]
    }).lean();

    if (savedDestination?.image) {
      console.log(`Using saved destination image for: ${savedDestination.name}`);
      return savedDestination.image;
    }
  } catch (error) {
    console.error('Saved destination image lookup failed:', error.message);
  }

  console.log(`No curated tourism image configured for: ${destination}`);
  return '';
}




/* =====================================================
   SAFETY API
===================================================== */

app.get('/api/safety/:destination',authMiddleware, async (req, res) => {

  const destination =
    decodeURIComponent(
      req.params.destination
    ).trim();


  try {

    /* =================================================
       1. FIND DESTINATION
    ================================================= */

    const searchPlace =
      normalizeText(destination);


    let location;


    /* =================================================
       INDIAN STATES / UNION TERRITORIES
    ================================================= */

    if (indianLocations[searchPlace]) {

      location =
        indianLocations[searchPlace];

      console.log(
        `Indian location found directly: ${location.name}`
      );

    }


    /* =================================================
       OTHER DESTINATIONS
    ================================================= */

    else {

      const geoResponse =
        await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=5&language=en&format=json`,
          {
            signal:
              AbortSignal.timeout(10000)
          }
        );


      if (!geoResponse.ok) {

        throw new Error(
          `Geocoding API error: ${geoResponse.status}`
        );

      }


      const geoData =
        await geoResponse.json();


      if (
        !geoData.results ||
        geoData.results.length === 0
      ) {

        return res.status(404).json({

          message:
            `Could not find destination: ${destination}`

        });

      }


      /* Prefer India when available */

      const indiaResult =
        geoData.results.find(
          item =>
            normalizeText(item.country)
            === 'india'
        );


      location =
        indiaResult ||
        geoData.results[0];

    }


    /* =================================================
       DESTINATION DETAILS
    ================================================= */

    const detectedDestination =
      location.name ||
      destination;


    const country =
      location.country ||
      destination;


    console.log(
      'Destination:',
      detectedDestination
    );


    console.log(
      'Country:',
      country
    );


    /* =================================================
       TOURIST PLACES
    ================================================= */

    const touristPlaces =
      getTouristPlaces(
        searchPlace,
        country
      );


    console.log(
      'Tourist places:',
      touristPlaces
    );


    /* =================================================
       2. WEATHER
    ================================================= */

    const weatherResponse =
      await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`,
        {
          signal:
            AbortSignal.timeout(10000)
        }
      );


    if (!weatherResponse.ok) {

      throw new Error(
        `Weather API error: ${weatherResponse.status}`
      );

    }


    const weatherData =
      await weatherResponse.json();


    if (!weatherData.current) {

      throw new Error(
        'Weather data unavailable'
      );

    }


    const current =
      weatherData.current;


    /* =================================================
       3. WEATHER RISK
    ================================================= */

    let weatherRisk =
      'Low Risk';


    let weatherMessage =
      'Weather conditions are favorable.';


    const temperature =
      current.temperature_2m;


    const precipitation =
      current.precipitation;


    const windSpeed =
      current.wind_speed_10m;


    if (
      precipitation > 10 ||
      windSpeed > 50 ||
      temperature > 45 ||
      temperature < 0
    ) {

      weatherRisk =
        'High Risk';


      weatherMessage =
        'Severe weather conditions require caution.';

    }

    else if (
      precipitation > 2 ||
      windSpeed > 30 ||
      temperature > 40 ||
      temperature < 10
    ) {

      weatherRisk =
        'Moderate';


      weatherMessage =
        'Some weather conditions require attention.';

    }


    /* =================================================
       4. HEALTH
    ================================================= */

    const healthData =
      getHealthRisk(country);


    /* =================================================
       5. POLITICAL
    ================================================= */

    const politicalData =
      getPoliticalRisk(country);


    /* =================================================
       6. NATURAL DISASTERS
    ================================================= */

    const naturalData = {

      risk:
        'Low Risk',

      message:
        'No major active disaster alerts.'

    };


    /* =================================================
       7. OVERALL RISK
    ================================================= */

    const overallRisk =
      calculateOverallRisk(
        weatherRisk,
        healthData.risk,
        politicalData.risk,
        naturalData.risk
      );


    /* =================================================
       8. IMAGE
    ================================================= */

    let imageSearchName =
      detectedDestination;


    /*
       If a state/UT was searched,
       use its first famous tourist place
       for the image instead of a generic
       state image.
    */
if (
  touristPlaces.length > 0 &&
  indianTouristPlaces[searchPlace]
) {
  if (searchPlace === 'kerala' || searchPlace === 'goa') {
    imageSearchName = searchPlace;
  } else {
    imageSearchName = touristPlaces[0];
  }
}

    const destinationImage =
      await getDestinationImage(
        imageSearchName
      );


    /* =================================================
       9. RESPONSE
    ================================================= */

    res.json({

      destination:
        detectedDestination,

      country:
        country,

      touristPlaces:
        touristPlaces,

      destinationImage:
        destinationImage,

      overallRisk:
        overallRisk,


      weather: {

        risk:
          weatherRisk,

        message:
          weatherMessage,

        temperature:
          current.temperature_2m,

        humidity:
          current.relative_humidity_2m,

        precipitation:
          current.precipitation,

        windSpeed:
          current.wind_speed_10m

      },


      health: {

        ...healthData,

        source:
          'CDC / WHO travel health information'

      },


      political:
        politicalData,


      naturalDisasters:
        naturalData

    });

  }


  catch (error) {

    console.error(
      'Safety API error:',
      error
    );


    res.status(500).json({

      message:
        'Could not fetch safety information.'

    });

  }

});


/* =====================================================
   HEALTH RISK
===================================================== */

function getHealthRisk(country) {

  const place =
    normalizeText(country);


  const highRiskCountries = [

    'afghanistan',
    'syria',
    'yemen'

  ];


  const moderateRiskCountries = [

    'india'

  ];


  if (
    highRiskCountries.includes(place)
  ) {

    return {

      risk:
        'High Risk',

      message:
        'Significant health precautions may be required. Check current travel health advisories.',

      level:
        3

    };

  }


  if (
    moderateRiskCountries.includes(place)
  ) {

    return {

      risk:
        'Moderate',

      message:
        'Some health precautions may be required. Check current travel health advisories.',

      level:
        2

    };

  }


  return {

    risk:
      'Low Risk',

    message:
      'No specific health warning configured for this destination.',

    level:
      1

  };

}


/* =====================================================
   POLITICAL RISK
===================================================== */

function getPoliticalRisk(country) {

  const place =
    normalizeText(country);


  const highRiskCountries = [

    'afghanistan',
    'syria',
    'yemen'

  ];


  const moderateRiskCountries = [

    'pakistan',
    'iraq',
    'lebanon'

  ];


  if (
    highRiskCountries.includes(place)
  ) {

    return {

      risk:
        'High Risk',

      message:
        'Political and security conditions may require serious caution.'

    };

  }


  if (
    moderateRiskCountries.includes(place)
  ) {

    return {

      risk:
        'Moderate',

      message:
        'Some political or security precautions may be required.'

    };

  }


  return {

    risk:
      'Low Risk',

    message:
      'No major political warnings configured for this destination.'

  };

}


/* =====================================================
   OVERALL RISK
===================================================== */

function calculateOverallRisk(
  weatherRisk,
  healthRisk,
  politicalRisk,
  naturalRisk
) {

  const risks = [

    weatherRisk,
    healthRisk,
    politicalRisk,
    naturalRisk

  ];


  if (
    risks.includes('High Risk')
  ) {

    return 'High Risk';

  }


  if (
    risks.includes('Moderate')
  ) {

    return 'Moderate';

  }


  return 'Low Risk';

}


/* =====================================================
   START SERVER
===================================================== */

const PORT = 3000;

// ================= AUTHENTICATION ROUTES =================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Name, email, and password are required.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || cleanName.length > 100) {
      return res.status(400).json({
        message: 'Please enter a valid name.'
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return res.status(400).json({
        message: 'Please enter a valid email address.'
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        message: 'Password must be between 8 and 128 characters.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'JWT_SECRET is missing from .env.'
      });
    }

    const existingUser = await User.findOne({
      email: cleanEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Never accept a role from public registration requests.
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email is already registered.'
      });
    }
console.error('Registration error:', error);

    return res.status(500).json({
      message: 'Registration failed.'
    });
  }
});


// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || cleanEmail.length > 254 ||
        password.length > 128) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    const user = await User.findOne({
      email: cleanEmail
    }).select('+password');

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'JWT_SECRET is missing from .env.'
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);

    return res.status(500).json({
      message: 'Login failed.'
    });
  }
});
// ========================================
// PUBLIC: GET ALL DESTINATIONS
// ========================================
app.get('/api/destinations', async (req, res) => {
try {
const destinations = await Destination.find()
.sort({ createdAt: -1 })
.lean();

return res.status(200).json(destinations);

} catch (error) {
console.error('Public destinations error:', error);

return res.status(500).json({
  success: false,
  message: 'Failed to retrieve destinations.'
});

}
});






// ========================================
// ADMIN: GET ALL DESTINATIONS
// ========================================
app.get(
  '/api/admin/destinations',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const destinations = await Destination.find()
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        count: destinations.length,
        destinations
      });
    } catch (error) {
      console.error('Get destinations error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve destinations.'
      });
    }
  }
);


// ========================================
// ADMIN: ADD DESTINATION
// ========================================
app.post(
  '/api/admin/destinations',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, country, description, image, category } = req.body;

      if (
        typeof name !== 'string' ||
        typeof country !== 'string' ||
        typeof description !== 'string' ||
        typeof image !== 'string' ||
        !name.trim() ||
        !country.trim() ||
        !description.trim() ||
        !image.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Name, country, description, and image are required.'
        });
      }

      if (
        name.trim().length > 100 ||
        country.trim().length > 100 ||
        description.trim().length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message: 'One or more fields exceed the allowed length.'
        });
      }

      let imageUrl;

      try {
        imageUrl = new URL(image.trim());
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid image URL.'
        });
      }

      if (!['https:', 'http:'].includes(imageUrl.protocol)) {
        return res.status(400).json({
          success: false,
          message: 'Image URL must use HTTP or HTTPS.'
        });
      }

      const destination = await Destination.create({
        name: name.trim(),
        country: country.trim(),
        description: description.trim(),
        image: imageUrl.href,
        category:
          typeof category === 'string' && category.trim()
            ? category.trim().slice(0, 60)
            : 'General'
      });

      return res.status(201).json({
        success: true,
        message: 'Destination added successfully!',
        destination
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'This destination already exists for that country.'
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination details.'
        });
      }

      console.error('Add destination error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to add destination.'
      });
    }
  }
);


// ========================================
// ADMIN: UPDATE DESTINATION
// ========================================
app.put(
  '/api/admin/destinations/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, country, description, image, category } = req.body;

      if (
        typeof name !== 'string' ||
        typeof country !== 'string' ||
        typeof description !== 'string' ||
        typeof image !== 'string' ||
        !name.trim() ||
        !country.trim() ||
        !description.trim() ||
        !image.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: 'Name, country, description, and image are required.'
        });
      }

      if (
        name.trim().length > 100 ||
        country.trim().length > 100 ||
        description.trim().length > 1000
      ) {
        return res.status(400).json({
          success: false,
          message: 'One or more fields exceed the allowed length.'
        });
      }

      let imageUrl;

      try {
        imageUrl = new URL(image.trim());
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid image URL.'
        });
      }

      if (!['https:', 'http:'].includes(imageUrl.protocol)) {
        return res.status(400).json({
          success: false,
          message: 'Image URL must use HTTP or HTTPS.'
        });
      }

      const updatedDestination = await Destination.findByIdAndUpdate(
        req.params.id,
        {
          name: name.trim(),
          country: country.trim(),
          description: description.trim(),
          image: imageUrl.href,
          category:
            typeof category === 'string' && category.trim()
              ? category.trim().slice(0, 60)
              : 'General'
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!updatedDestination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Destination updated successfully!',
        destination: updatedDestination
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'A destination with that name already exists for this country.'
        });
      }

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination details.'
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination ID.'
        });
      }

      console.error('Update destination error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to update destination.'
      });
    }
  }
);


// ========================================
// ADMIN: DELETE DESTINATION
// ========================================
app.delete(
  '/api/admin/destinations/:id',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const destination = await Destination.findByIdAndDelete(
        req.params.id
      );

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: 'Destination not found.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Destination deleted successfully!'
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination ID.'
        });
      }

      console.error('Delete destination error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to delete destination.'
      });
    }
  }
);
// ========================================
// ADMIN: GET ALL REGISTERED USERS
// ========================================
app.get(
  '/api/admin/users',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find()
        .select('name email role createdAt')
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      console.error('Admin user-list error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users.'
      });
    }
  }
);

app.listen(
  PORT,
  () => {

    console.log(
      `SafeTravel server running on http://localhost:${PORT}`
    );

  }
);