export interface Producer {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  location?: string;
  verified: boolean;
}

export interface Beat {
  id: string;
  title: string;
  producer: string; // Display name (keep for backward compatibility)
  producerId: string; // Reference to Producer ID
  bpm: number;
  key: string;
  price: number;
  cover: string;
  tags: string[];
  audio: string;
  duration: string; // e.g., "3:45"
  description: string;
  includedFiles: string[]; // e.g., ["MP3 + WAV Files", "Trackout Stems"]
}

export interface Genre {
  id: string;
  name: string;
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
    cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80",
    tags: ["Trap", "Dark", "Melodic"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:24",
    description: "A captivating trap beat with dark, melodic elements and hard-hitting 808s. Perfect for artists looking to create powerful tracks that resonate with listeners. Features carefully crafted sound design and professional mixing.",
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"],
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
    includedFiles: ["MP3 File", "Tagged WAV"]
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
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"]
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
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"]
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
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"]
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
    includedFiles: ["MP3 File"]
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
    includedFiles: ["MP3 + WAV Files", "Trackout Stems", "MIDI Files"]
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
    includedFiles: ["MP3 + WAV Files", "Trackout Stems"]
  },
];

export const producers: Producer[] = [
  {
    id: "prod-1",
    name: "CloudNine",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
    bio: "Multi-platinum producer specializing in dark trap and melodic beats. Known for atmospheric soundscapes and hard-hitting 808s.",
    location: "Atlanta, GA",
    verified: true
  },
  {
    id: "prod-2",
    name: "SynthWave Pro",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
    bio: "Retro-futuristic producer bringing the 80s back with modern production techniques. Specializes in synthwave and electronic music.",
    location: "Los Angeles, CA",
    verified: true
  },
  {
    id: "prod-3",
    name: "UrbanFlow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Golden era hip hop meets modern production. Creating timeless beats with soul and authenticity.",
    location: "Brooklyn, NY",
    verified: true
  },
  {
    id: "prod-4",
    name: "VibeMaster",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    bio: "Experimental producer blending electronic, soul, and R&B. Pushing boundaries with innovative sound design.",
    location: "London, UK",
    verified: true
  },
  {
    id: "prod-5",
    name: "ShadowProd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Dark, aggressive production for drill and trap. Working with top artists in the UK drill scene.",
    location: "London, UK",
    verified: true
  }
];

export const genres: Genre[] = [
  { id: "1", name: "Trap", count: 1250, color: "bg-orange-700/80 hover:bg-orange-600/80" },
  { id: "2", name: "Hip Hop", count: 2100, color: "bg-purple-700/80 hover:bg-purple-600/80" },
  { id: "3", name: "R&B", count: 890, color: "bg-blue-700/80 hover:bg-blue-600/80" },
  { id: "4", name: "Electronic", count: 1560, color: "bg-emerald-700/80 hover:bg-emerald-600/80" },
  { id: "5", name: "Lo-Fi", count: 720, color: "bg-yellow-700/80 hover:bg-yellow-600/80" },
  { id: "6", name: "Pop", count: 980, color: "bg-pink-700/80 hover:bg-pink-600/80" },
];
