export interface LicenseTier {
  enabled: boolean;
  price: string;
  file: File | null;
}

export interface LicenseTiers {
  mp3: LicenseTier;
  wav: LicenseTier;
  stems: LicenseTier;
  exclusive: LicenseTier;
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
  licenseTiers: LicenseTiers;
}

export const INITIAL_FORM_DATA: UploadFormData = {
  title: "",
  genre: "",
  bpm: "",
  key: "",
  description: "",
  tags: [],
  price: "29.99",
  duration: "0:00",
  durationSeconds: 0,
  previewFile: null,
  coverFile: null,
  coverPreview: "",
  licenseTiers: {
    mp3: { enabled: true, price: "29.99", file: null },
    wav: { enabled: true, price: "49.99", file: null },
    stems: { enabled: false, price: "99.99", file: null },
    exclusive: { enabled: false, price: "499.99", file: null }
  }
};
