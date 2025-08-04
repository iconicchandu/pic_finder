import axios from 'axios';
import { MediaItem } from '../types';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

// Pexels API
const pexelsApi = axios.create({
  baseURL: 'https://api.pexels.com/v1',
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

// Pixabay API
const pixabayApi = axios.create({
  baseURL: 'https://pixabay.com/api',
});

export const searchPexelsImages = async (query: string, page = 1): Promise<MediaItem[]> => {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'your_pexels_api_key_here') {
    return [];
  }

  try {
    const response = await pexelsApi.get('/search', {
      params: {
        query,
        page,
        per_page: 20,
        orientation: 'all',
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data.photos.map((photo: any): MediaItem => ({
      id: `pexels-img-${photo.id}`,
      type: 'image',
      title: photo.alt || `Photo by ${photo.photographer}`,
      thumbnail: photo.src.medium || photo.src.small || photo.src.tiny,
      downloadUrl: photo.src.original || photo.src.large2x || photo.src.large,
      source: 'pexels',
      photographer: photo.photographer,
      size: {
        width: photo.width,
        height: photo.height,
      },
    }));
  } catch (error) {
    console.error('Error fetching Pexels images:', error);
    return [];
  }
};

export const searchPexelsVideos = async (query: string, page = 1): Promise<MediaItem[]> => {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'your_pexels_api_key_here') {
    return [];
  }

  try {
    const response = await pexelsApi.get('/videos/search', {
      params: {
        query,
        page,
        per_page: 20,
        orientation: 'all',
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data.videos.filter((video: any) => video.video_files && video.video_files.length > 0).map((video: any): MediaItem => {
      // Find the best quality video file
      const videoFile = video.video_files.find((file: any) => file.quality === 'hd') || 
                       video.video_files.find((file: any) => file.quality === 'sd') || 
                       video.video_files[0];
      
      return {
      id: `pexels-vid-${video.id}`,
      type: 'video',
      title: `Video by ${video.user.name}`,
      thumbnail: video.image,
      downloadUrl: videoFile?.link || '',
      source: 'pexels',
      photographer: video.user.name,
      duration: video.duration,
      size: {
        width: video.width,
        height: video.height,
      },
      };
    });
  } catch (error) {
    console.error('Error fetching Pexels videos:', error);
    return [];
  }
};

export const searchPixabayImages = async (query: string, page = 1): Promise<MediaItem[]> => {
  if (!PIXABAY_API_KEY || PIXABAY_API_KEY === 'your_pixabay_api_key_here') {
    return [];
  }

  try {
    const response = await pixabayApi.get('/', {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        image_type: 'photo',
        page,
        per_page: 20,
        safesearch: 'true',
        min_width: 640,
        min_height: 480,
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data.hits.map((image: any): MediaItem => ({
      id: `pixabay-img-${image.id}`,
      type: 'image',
      title: image.tags,
      thumbnail: image.webformatURL,
      downloadUrl: image.largeImageURL,
      source: 'pixabay',
      photographer: image.user,
      tags: image.tags.split(', '),
      size: {
        width: image.imageWidth,
        height: image.imageHeight,
      },
    }));
  } catch (error) {
    console.error('Error fetching Pixabay images:', error);
    return [];
  }
};

export const searchPixabayVideos = async (query: string, page = 1): Promise<MediaItem[]> => {
  if (!PIXABAY_API_KEY || PIXABAY_API_KEY === 'your_pixabay_api_key_here') {
    return [];
  }

  try {
    const response = await pixabayApi.get('/videos/', {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        page,
        per_page: 20,
        safesearch: 'true',
        min_width: 640,
        min_height: 480,
      },
      timeout: 10000, // 10 second timeout
    });

    return response.data.hits.filter((video: any) => video.videos && Object.keys(video.videos).length > 0).map((video: any): MediaItem => {
      // Get the best available video quality
      const videoUrl = video.videos.large?.url || video.videos.medium?.url || video.videos.small?.url || video.videos.tiny?.url;
      const videoWidth = video.videos.large?.width || video.videos.medium?.width || video.videos.small?.width || 640;
      const videoHeight = video.videos.large?.height || video.videos.medium?.height || video.videos.small?.height || 480;
      
      return {
      id: `pixabay-vid-${video.id}`,
      type: 'video',
      title: video.tags,
      thumbnail: video.userImageURL || `https://cdn.pixabay.com/video/2023/01/01/0-${video.picture_id}_640x360.jpg`,
      downloadUrl: videoUrl,
      source: 'pixabay',
      photographer: video.user,
      tags: video.tags.split(', '),
      duration: video.duration,
      size: {
        width: videoWidth,
        height: videoHeight,
      },
      };
    });
  } catch (error) {
    console.error('Error fetching Pixabay videos:', error);
    return [];
  }
};