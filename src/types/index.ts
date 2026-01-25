/**
 * Centralized Type Definitions for BeatBloom Frontend
 */

// --- Base API Types ---
export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Auth & User Types ---
export interface User {
  id: number | string;
  email: string;
  name: string;
  username?: string;
  role: 'producer' | 'artist' | 'admin' | string;
  status: 'active' | 'inactive' | 'suspended' | string;
  avatar?: string;
  coverImage?: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
  emailVerifiedAt?: string;
  mfaEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  publicProfile: boolean;
  theme: 'dark' | 'light';
  producer?: ProducerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface ProducerProfile {
  id: number | string;
  userId: number | string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  soundcloud?: string;
  spotify?: string;
  isVerified: boolean;
  commissionRate: number;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
    message?: string;
  };
  message: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'producer' | 'artist' | string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  bio?: string;
}

export interface UpdateSettingsData {
  theme?: "light" | "dark" | "system";
  emailNotifications?: boolean;
  marketingEmails?: boolean;
  twoFactorEnabled?: boolean;
}

export interface ChangePasswordData {
  currentPassword?: string;
  oldPassword?: string;
  newPassword?: string;
  password?: string;
}

// --- Marketplace Types ---

export interface LicenseTier {
  id: number | string;
  beatId?: number | string;
  tierType: 'mp3' | 'wav' | 'stems' | 'exclusive' | string;
  name: string;
  price: number | string;
  description: string;
  includedFiles: string[] | string;
  isExclusive?: boolean;
  isEnabled?: boolean;
  // Upload specific field
  file?: File | null;
  enabled?: boolean;
}

export interface Beat {
  id: number | string;
  producerId: number | string;
  genreId?: number | string;
  title: string;
  slug: string;
  description?: string;
  bpm: number | string;
  musicalKey: string;
  key?: string; // Alias for musicalKey
  duration?: string | number;
  durationSeconds?: number;
  coverImage?: string;
  cover?: string; // Alias for coverImage
  previewAudioUrl?: string;
  tags: string[] | string;
  playsCount: number;
  likesCount: number;
  isExclusiveSold: boolean;
  status: 'draft' | 'active' | 'archived' | 'soldExclusive' | string;
  isFeatured: boolean;
  producerName: string;
  producer?: string; // Alias for producerName
  producerUsername: string;
  producerAvatar?: string;
  producerBio?: string;
  producerLocation?: string;
  producerIsVerified?: boolean;
  isProducerVerified?: boolean; // Alias for producerIsVerified
  genreName?: string;
  licenseTiers?: LicenseTier[];
  price?: number | string;
  createdAt: string;
  [key: string]: any; // Catch-all for API props
}

export interface Producer extends ProducerProfile {
  beats?: Beat[];
}

export interface Genre {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  beatCount?: number;
  isActive: boolean;
}

// --- Page Specific Data Types ---

export interface Playlist {
  id: string | number;
  name: string;
  color: string;
  beats: Beat[];
  beatsCount?: number;
  description?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HomePageData {
  trendingBeats: Beat[];
  genres: Genre[];
  featuredProducers: Producer[];
}

export interface BeatDetailPageData {
  beat: Beat;
  producer: Producer;
  relatedBeats: Beat[];
}

export interface Purchase {
  id?: string | number;
  beat: Beat;
  purchasedAt: string;
  amount: number;
  transactionRef?: string;
  // License information
  licenseTierId?: number | string;
  tierName?: string;
  tierType?: string;
  licenseName?: string;
  isExclusive?: boolean;
  includedFiles?: string[];
}

export interface ProfilePageData {
  user: User;
  purchases: Purchase[];
  likes: (Beat | { beat: Beat; id: number | string })[];
  stats: {
    purchasesCount: number;
    likesCount: number;
  };
}

// --- Upload Types ---

export interface UploadLicenseTiers {
  mp3: { enabled: boolean; price: string; file: File | null };
  wav: { enabled: boolean; price: string; file: File | null };
  stems: { enabled: boolean; price: string; file: File | null };
  exclusive: { enabled: boolean; price: string; file: File | null };
}

export interface UploadFormData {
  title: string;
  genre: string;
  bpm: string;
  key: string;
  description: string;
  tags: string[];
  price: string;
  duration: string;
  durationSeconds: number;
  previewFile: File | null;
  coverFile: File | null;
  coverPreview: string;
  licenseTiers: UploadLicenseTiers;
}
