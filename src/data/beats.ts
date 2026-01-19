export interface Producer {
  id: string;
  username: string; // URL-safe username
  name: string;
  avatar?: string;
  bio: string;
  location?: string;
  verified: boolean;
}

// License tier types
export type LicenseTierType = 'mp3' | 'wav' | 'stems' | 'exclusive';

export interface LicenseTier {
  type: LicenseTierType;
  name: string;
  price: number;
  includedFiles: string[];
  description: string;
  isExclusive?: boolean; // If true, beat becomes unavailable after purchase
}

export interface Beat {
  id: string;
  title: string;
  producer: string; // Display name (keep for backward compatibility)
  producerId: string; // Reference to Producer ID
  bpm: number;
  key: string;
  price: number; // Base price (lowest tier) - kept for backward compatibility
  cover: string;
  tags: string[];
  audio: string;
  duration: string; // e.g., "3:45"
  description: string;
  includedFiles: string[]; // e.g., ["MP3 + WAV Files", "Trackout Stems"] - kept for backward compatibility
  plays: number; // Number of plays/streams
  licenseTiers?: LicenseTier[]; // Optional: Multiple pricing tiers
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  count: number;
  color: string;
}

export const featuredBeats: Beat[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    producer: "CloudNine",
    producerId: "prod-1",
    bpm: 140,
    key: "Am",
    price: 29.99,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    tags: ["Trap", "Dark", "Melodic"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:24",
    description: "A captivating trap beat with dark, melodic elements and hard-hitting 808s. Perfect for artists looking to create powerful tracks that resonate with listeners. Features carefully crafted sound design and professional mixing.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 481000,
    licenseTiers: [
      {
        type: 'mp3',
        name: 'MP3 Lease',
        price: 29.99,
        includedFiles: ['Tagged MP3 File'],
        description: 'Basic license for non-profit use. Includes tagged MP3 file.'
      },
      {
        type: 'wav',
        name: 'WAV Lease',
        price: 49.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File'],
        description: 'Standard lease with untagged MP3 and high-quality WAV files.'
      },
      {
        type: 'stems',
        name: 'Trackout',
        price: 99.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File', 'Trackout Stems (ZIP)'],
        description: 'Full trackout package with individual stems for mixing.'
      },
      {
        type: 'exclusive',
        name: 'Exclusive Rights',
        price: 499.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File', 'Trackout Stems (ZIP)', 'Project Files'],
        description: 'Full ownership transfer. Beat will be removed from store after purchase.',
        isExclusive: true
      }
    ]
  },
  {
    id: "2",
    title: "Neon Horizon",
    producer: "SynthWave Pro",
    producerId: "prod-2",
    bpm: 128,
    key: "Cm",
    price: 34.99,
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
    tags: ["Synthwave", "Retro", "Upbeat"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "4:12",
    description: "An energetic synthwave track with retro, upbeat vibes reminiscent of the 80s. Rich analog synths and driving basslines create a nostalgic yet modern sound perfect for any creative project.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 156000,
    licenseTiers: [
      {
        type: 'mp3',
        name: 'MP3 Lease',
        price: 34.99,
        includedFiles: ['Tagged MP3 File'],
        description: 'Basic license for non-profit use. Includes tagged MP3 file.'
      },
      {
        type: 'wav',
        name: 'WAV Lease',
        price: 59.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File'],
        description: 'Standard lease with untagged MP3 and high-quality WAV files.'
      },
      {
        type: 'stems',
        name: 'Trackout',
        price: 129.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File', 'Trackout Stems (ZIP)'],
        description: 'Full trackout package with individual stems for mixing.'
      }
    ]
  },
  {
    id: "3",
    title: "Urban Legend",
    producer: "CloudNine",
    producerId: "prod-1",
    bpm: 95,
    key: "Gm",
    price: 24.99,
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80",
    tags: ["Hip Hop", "Boom Bap", "Gritty"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "3:45",
    description: "Classic boom bap hip hop with gritty drums and soulful samples. This beat captures the essence of golden era hip hop while maintaining modern production quality. Perfect for conscious rap and storytelling.",
    includedFiles: ["MP3 File", "Tagged WAV"],
    plays: 89000,
  },
];

export const trendingBeats: Beat[] = [
  {
    id: "4",
    title: "Electric Soul",
    producer: "VibeMaster",
    producerId: "prod-4",
    bpm: 128,
    key: "Cm",
    price: 39.99,
    cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&q=80",
    tags: ["Electronic", "Soul", "Future"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "3:58",
    description: "Futuristic electronic production meets soulful melodies in this unique blend. Lush synth pads, smooth bass, and intricate percussion create an atmosphere that's both modern and emotional.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"],
    plays: 228000,
    licenseTiers: [
      {
        type: 'mp3',
        name: 'MP3 Lease',
        price: 39.99,
        includedFiles: ['Tagged MP3 File'],
        description: 'Basic license for non-profit use. Includes tagged MP3 file.'
      },
      {
        type: 'wav',
        name: 'WAV Lease',
        price: 69.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File'],
        description: 'Standard lease with untagged MP3 and high-quality WAV files.'
      },
      {
        type: 'stems',
        name: 'Premium Trackout',
        price: 149.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File', 'Trackout Stems (ZIP)', 'MIDI Files'],
        description: 'Full trackout package with stems and MIDI files.'
      },
      {
        type: 'exclusive',
        name: 'Exclusive Rights',
        price: 799.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File', 'Trackout Stems (ZIP)', 'MIDI Files', 'Project Files'],
        description: 'Full ownership transfer. Beat will be removed from store.',
        isExclusive: true
      }
    ]
  },
  {
    id: "5",
    title: "Golden Hour",
    producer: "UrbanFlow",
    producerId: "prod-3",
    bpm: 110,
    key: "Gm",
    price: 34.99,
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
    tags: ["RnB", "Chill", "Smooth"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "4:20",
    description: "Smooth R&B instrumental with warm keys and silky drum patterns. The chill, laid-back vibe makes it perfect for late-night sessions or heartfelt lyrics. Features live instrumentation and polished production.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 81000,
    licenseTiers: [
      {
        type: 'mp3',
        name: 'MP3 Lease',
        price: 34.99,
        includedFiles: ['Tagged MP3 File'],
        description: 'Basic license for non-profit use.'
      },
      {
        type: 'wav',
        name: 'WAV Lease',
        price: 54.99,
        includedFiles: ['Untagged MP3 File', 'High-Quality WAV File'],
        description: 'Standard lease with high-quality WAV file.'
      }
    ]
  },
  {
    id: "6",
    title: "Neon Lights",
    producer: "SynthWave Pro",
    producerId: "prod-2",
    bpm: 150,
    key: "Fm",
    price: 44.99,
    cover: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&q=80",
    tags: ["Cyberpunk", "Industrial", "Heavy"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: "3:36",
    description: "Intense cyberpunk beat with industrial elements and heavy bass. Dystopian soundscapes meet aggressive percussion in this high-energy production. Perfect for creating dark, futuristic atmospheres.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 107000,
  },
  {
    id: "7",
    title: "Chill Vibes",
    producer: "CloudNine",
    producerId: "prod-1",
    bpm: 85,
    key: "Em",
    price: 24.99,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tags: ["LoFi", "Study", "Relaxing"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: "2:48",
    description: "Relaxing lo-fi hip hop beat perfect for studying, working, or unwinding. Features dusty vinyl textures, jazzy chord progressions, and mellow drum loops that create a calming atmosphere.",
    includedFiles: ["MP3 File"],
    plays: 253000,
  },
  {
    id: "8",
    title: "Street Dreams",
    producer: "UrbanFlow",
    producerId: "prod-3",
    bpm: 88,
    key: "Bbm",
    price: 54.99,
    cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    tags: ["Rap", "Piano", "Emotional"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: "4:05",
    description: "Emotional rap instrumental featuring beautiful piano melodies over crisp drums. This beat tells a story of struggle and triumph, perfect for deep, personal lyrics and introspective content.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"],
    plays: 74000,
  },
  {
    id: "9",
    title: "Dark Matter",
    producer: "ShadowProd",
    producerId: "prod-5",
    bpm: 145,
    key: "Ebm",
    price: 39.99,
    cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    tags: ["Drill", "Dark", "Hard"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    duration: "3:18",
    description: "Hard-hitting drill beat with menacing 808 slides and dark atmospheric elements. Aggressive percussion and eerie melodies create an intense, street-ready sound perfect for authentic drill music.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 457000,
  },
  {
    id: "10",
    title: "Sunset Boulevard",
    producer: "VibeMaster",
    producerId: "prod-4",
    bpm: 92,
    key: "Dm",
    price: 29.99,
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    tags: ["RnB", "Smooth", "Summer"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    duration: "3:52",
    description: "Smooth summer R&B vibes with warm synths and laid-back drums. Perfect for creating feel-good tracks with a nostalgic California sunset feel.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 198000,
  },
  {
    id: "11",
    title: "Tokyo Nights",
    producer: "SynthWave Pro",
    producerId: "prod-2",
    bpm: 118,
    key: "Am",
    price: 44.99,
    cover: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
    tags: ["Synthwave", "Cyberpunk", "Neon"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    duration: "4:15",
    description: "Neon-drenched synthwave journey through futuristic cityscapes. Pulsing arpeggios and powerful bass create an immersive cyberpunk atmosphere.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"],
    plays: 312000,
  },
  {
    id: "12",
    title: "Crown Royal",
    producer: "UrbanFlow",
    producerId: "prod-3",
    bpm: 78,
    key: "Cm",
    price: 49.99,
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    tags: ["Hip Hop", "Luxury", "Smooth"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    duration: "3:42",
    description: "Luxurious hip hop instrumental with sophisticated piano chords and crisp drums. A premium sound for artists who want that champagne lifestyle feel.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 245000,
  },
  {
    id: "13",
    title: "Phantom",
    producer: "ShadowProd",
    producerId: "prod-5",
    bpm: 140,
    key: "Fm",
    price: 34.99,
    cover: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=800&q=80",
    tags: ["Trap", "Dark", "Aggressive"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    duration: "3:28",
    description: "Aggressive trap beat with haunting melodies and thunderous 808s. The phantom-like atmosphere creates a mysterious, powerful energy.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 389000,
  },
  {
    id: "14",
    title: "Cloud Walker",
    producer: "CloudNine",
    producerId: "prod-1",
    bpm: 130,
    key: "Gb",
    price: 39.99,
    cover: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80",
    tags: ["Melodic", "Trap", "Ethereal"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    duration: "3:55",
    description: "Ethereal melodic trap with heavenly pads floating over punchy drums. Walk through the clouds with this dreamy yet hard-hitting production.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"],
    plays: 521000,
  },
  {
    id: "15",
    title: "Vintage Soul",
    producer: "VibeMaster",
    producerId: "prod-4",
    bpm: 98,
    key: "Bb",
    price: 34.99,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    tags: ["Soul", "Vintage", "Warm"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    duration: "4:08",
    description: "Warm vintage soul production with authentic analog textures. Classic Rhodes keys and vinyl crackle create timeless golden-era vibes.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 167000,
  },
  {
    id: "16",
    title: "Neon Dreams",
    producer: "SynthWave Pro",
    producerId: "prod-2",
    bpm: 125,
    key: "Dm",
    price: 39.99,
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    tags: ["Electronic", "Future", "Upbeat"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    duration: "3:38",
    description: "Futuristic electronic beat with glittering synths and driving rhythms. Perfect for creating energetic, forward-thinking tracks.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 283000,
  },
  {
    id: "17",
    title: "Brooklyn Bridge",
    producer: "UrbanFlow",
    producerId: "prod-3",
    bpm: 90,
    key: "Em",
    price: 29.99,
    cover: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80",
    tags: ["Boom Bap", "Classic", "New York"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:22",
    description: "Classic New York boom bap with hard-hitting drums and soulful samples. Bringing that authentic East Coast energy to your productions.",
    includedFiles: ["MP3 + WAV Files"],
    plays: 134000,
  },
  {
    id: "18",
    title: "Moonlight",
    producer: "CloudNine",
    producerId: "prod-1",
    bpm: 75,
    key: "Ab",
    price: 24.99,
    cover: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&q=80",
    tags: ["LoFi", "Chill", "Night"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "2:55",
    description: "Peaceful lo-fi beat for late-night sessions. Gentle piano melodies and mellow drums create the perfect atmosphere for reflection.",
    includedFiles: ["MP3 File"],
    plays: 178000,
  },
  {
    id: "19",
    title: "Savage Mode",
    producer: "ShadowProd",
    producerId: "prod-5",
    bpm: 155,
    key: "Gm",
    price: 54.99,
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tags: ["Drill", "UK", "Hard"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "3:12",
    description: "Ruthless UK drill instrumental with sliding 808s and menacing hi-hats. Built for artists who want that authentic street sound.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
    plays: 612000,
  },
  {
    id: "20",
    title: "Paradise",
    producer: "VibeMaster",
    producerId: "prod-4",
    bpm: 105,
    key: "C",
    price: 44.99,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    tags: ["Tropical", "Pop", "Summer"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: "3:45",
    description: "Tropical pop production with sunny melodies and bouncy rhythms. Transport your listeners to a beach paradise with this uplifting beat.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"],
    plays: 345000,
  },
  {
    id: "21",
    title: "Interstellar",
    producer: "SynthWave Pro",
    producerId: "prod-2",
    bpm: 135,
    key: "Fm",
    price: 49.99,
    cover: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    tags: ["Cinematic", "Epic", "Space"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: "4:30",
    description: "Epic cinematic production that takes you on a journey through the cosmos. Massive synths and powerful drums create an otherworldly experience.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"],
    plays: 267000,
  },
];

export const producers: Producer[] = [
  {
    id: "prod-1",
    username: "cloudnine",
    name: "CloudNine",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
    bio: "Multi-platinum producer specializing in dark trap and melodic beats. Known for atmospheric soundscapes and hard-hitting 808s.",
    location: "Atlanta, GA",
    verified: true
  },
  {
    id: "prod-2",
    username: "synthwave",
    name: "SynthWave Pro",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
    bio: "Retro-futuristic producer bringing the 80s back with modern production techniques. Specializes in synthwave and electronic music.",
    location: "Los Angeles, CA",
    verified: true
  },
  {
    id: "prod-3",
    username: "urbanflow",
    name: "UrbanFlow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Golden era hip hop meets modern production. Creating timeless beats with soul and authenticity.",
    location: "Brooklyn, NY",
    verified: true
  },
  {
    id: "prod-4",
    username: "vibemaster",
    name: "VibeMaster",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    bio: "Experimental producer blending electronic, soul, and R&B. Pushing boundaries with innovative sound design.",
    location: "London, UK",
    verified: true
  },
  {
    id: "prod-5",
    username: "shadow",
    name: "ShadowProd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Dark, aggressive production for drill and trap. Working with top artists in the UK drill scene.",
    location: "London, UK",
    verified: true
  }
];

export const genres: Genre[] = [
  { id: "1", name: "Trap", slug: "trap", count: 1250, color: "bg-orange-700/80 hover:bg-orange-600/80" },
  { id: "2", name: "Hip Hop", slug: "hip-hop", count: 2100, color: "bg-purple-700/80 hover:bg-purple-600/80" },
  { id: "3", name: "R&B", slug: "rnb", count: 890, color: "bg-blue-700/80 hover:bg-blue-600/80" },
  { id: "4", name: "Electronic", slug: "electronic", count: 1560, color: "bg-emerald-700/80 hover:bg-emerald-600/80" },
  { id: "5", name: "Lo-Fi", slug: "lofi", count: 720, color: "bg-yellow-700/80 hover:bg-yellow-600/80" },
  { id: "6", name: "Pop", slug: "pop", count: 980, color: "bg-pink-700/80 hover:bg-pink-600/80" },
];

// Helper functions
export const getProducerById = (id: string): Producer | undefined => {
  return producers.find(p => p.id === id);
};

export const getBeatsByProducerId = (producerId: string): Beat[] => {
  return [...featuredBeats, ...trendingBeats].filter(beat => beat.producerId === producerId);
};

// User Profile Interface
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  role: string;
  location: string;
  joinedDate: string;
  website: string;
  stats: {
    beats: number;
    totalPlays: number;
    sales: number;
    earnings: number;
  };
}

// Current user data (mock - in a real app, this would come from auth/API)
export const currentUser: UserProfile = {
  id: "user-1",
  name: "Alex Producer",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80",
  role: "Beatmaker",
  location: "Los Angeles, CA",
  joinedDate: "June 2023",
  website: "beatdrop.com/alexproducer",
  stats: {
    beats: 24,
    totalPlays: 156000,
    sales: 89,
    earnings: 4520
  }
};
