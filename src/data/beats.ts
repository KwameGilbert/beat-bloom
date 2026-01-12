export interface Beat {
  id: string;
  title: string;
  producer: string;
  bpm: number;
  key: string;
  price: number;
  cover: string;
  tags: string[];
  audio: string;
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
    bpm: 140,
    key: "Am",
    price: 29.99,
    cover: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80",
    tags: ["Trap", "Dark", "Melodic"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "Neon Horizon",
    producer: "SynthWave Pro",
    bpm: 128,
    key: "Cm",
    price: 34.99,
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
    tags: ["Synthwave", "Retro", "Upbeat"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "Urban Legend",
    producer: "StreetSound",
    bpm: 95,
    key: "Gm",
    price: 24.99,
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80",
    tags: ["Hip Hop", "Boom Bap", "Gritty"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export const trendingBeats: Beat[] = [
  {
    id: "4",
    title: "Electric Soul",
    producer: "VibeMaster",
    bpm: 128,
    key: "Cm",
    price: 39.99,
    cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=800&q=80",
    tags: ["Electronic", "Soul", "Future"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "5",
    title: "Golden Hour",
    producer: "SunsetBeats",
    bpm: 110,
    key: "Gm",
    price: 34.99,
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
    tags: ["RnB", "Chill", "Smooth"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "6",
    title: "Neon Lights",
    producer: "CyberProd",
    bpm: 150,
    key: "Fm",
    price: 44.99,
    cover: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&q=80",
    tags: ["Cyberpunk", "Industrial", "Heavy"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: "7",
    title: "Chill Vibes",
    producer: "LoFiKing",
    bpm: 85,
    key: "Em",
    price: 24.99,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tags: ["LoFi", "Study", "Relaxing"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: "8",
    title: "Street Dreams",
    producer: "UrbanFlow",
    bpm: 88,
    key: "Bbm",
    price: 54.99,
    cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    tags: ["Rap", "Piano", "Emotional"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
  {
    id: "9",
    title: "Dark Matter",
    producer: "ShadowProd",
    bpm: 145,
    key: "Ebm",
    price: 39.99,
    cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    tags: ["Drill", "Dark", "Hard"],
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  },
];

export const genres: Genre[] = [
  { id: "1", name: "Trap", count: 1250, color: "bg-orange-700/80 hover:bg-orange-600/80" },
  { id: "2", name: "Hip Hop", count: 2100, color: "bg-purple-700/80 hover:bg-purple-600/80" },
  { id: "3", name: "R&B", count: 890, color: "bg-blue-700/80 hover:bg-blue-600/80" },
  { id: "4", name: "Electronic", count: 1560, color: "bg-emerald-700/80 hover:bg-emerald-600/80" },
  { id: "5", name: "Lo-Fi", count: 720, color: "bg-yellow-700/80 hover:bg-yellow-600/80" },
  { id: "6", name: "Pop", count: 980, color: "bg-pink-700/80 hover:bg-pink-600/80" },
];
