import type { UploadFormData, UploadLicenseTiers as LicenseTiers } from '@/types';

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
