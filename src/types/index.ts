export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  thumbnail: string;
  downloadUrl: string;
  source: 'pexels' | 'pixabay';
  photographer?: string;
  tags?: string[];
  size?: {
    width: number;
    height: number;
  };
  duration?: number;
  fileSize?: string;
}

export interface SearchFilters {
  type: 'all' | 'images' | 'videos';
  source: 'all' | 'pexels' | 'pixabay';
}

export interface DownloadItem {
  id: string;
  name: string;
  url: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
}