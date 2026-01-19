import { api } from './api';

export interface UploadResponse {
  success: boolean;
  data: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
    type: string;
    group: string;
    storage: string;
  };
  message: string;
}

export const uploadService = {
  /**
   * Upload a single file
   */
  async uploadSingle(file: File, group: 'avatar' | 'cover' | 'beat' | 'general' = 'general'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post<UploadResponse>(`/upload/single?group=${group}`, formData);
  },

  /**
   * Upload multiple files
   */
  async uploadMany(files: File[], group: 'general' = 'general'): Promise<UploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    return api.post<UploadResponse[]>(`/upload/many?group=${group}`, formData);
  }
};

export default uploadService;
