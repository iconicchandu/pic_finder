import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MediaGrid from './components/MediaGrid';
import DownloadQueue from './components/DownloadQueue';
import { MediaItem, SearchFilters, DownloadItem } from './types';
import {
  searchPexelsImages,
  searchPexelsVideos,
  searchPixabayImages,
  searchPixabayVideos,
} from './services/api';
import toast from 'react-hot-toast';

function App() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const handleSearch = useCallback(async (query: string, filters: SearchFilters) => {
    setLoading(true);
    setMediaItems([]);

    try {
      const promises: Promise<MediaItem[]>[] = [];

      // Determine which APIs to call based on filters
      const shouldSearchPexels = filters.source === 'all' || filters.source === 'pexels';
      const shouldSearchPixabay = filters.source === 'all' || filters.source === 'pixabay';
      const shouldSearchImages = filters.type === 'all' || filters.type === 'images';
      const shouldSearchVideos = filters.type === 'all' || filters.type === 'videos';

      if (shouldSearchPexels) {
        if (shouldSearchImages) promises.push(searchPexelsImages(query));
        if (shouldSearchVideos) promises.push(searchPexelsVideos(query));
      }

      if (shouldSearchPixabay) {
        if (shouldSearchImages) promises.push(searchPixabayImages(query));
        if (shouldSearchVideos) promises.push(searchPixabayVideos(query));
      }

      const results = await Promise.all(promises);
      const allItems = results.flat();
      
      // Shuffle results for better variety
      const shuffledItems = allItems.sort(() => Math.random() - 0.5);
      
      setMediaItems(shuffledItems);
      
      if (shuffledItems.length === 0) {
        toast.error('No results found. Try different keywords or check your API keys.');
      } else {
        toast.success(`Found ${shuffledItems.length} items`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please check your API keys and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async (item: MediaItem) => {
    const downloadId = `download-${Date.now()}-${Math.random()}`;
    const downloadItem: DownloadItem = {
      id: downloadId,
      name: `${item.title}.${item.type === 'video' ? 'mp4' : 'jpg'}`,
      url: item.downloadUrl,
      progress: 0,
      status: 'downloading',
    };

    setDownloads(prev => [...prev, downloadItem]);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDownloads(prev =>
          prev.map(d =>
            d.id === downloadId && d.progress < 90
              ? { ...d, progress: d.progress + 10 }
              : d
          )
        );
      }, 200);

      // Fetch the file with better error handling
      const response = await fetch(item.downloadUrl, {
        mode: 'cors',
        headers: {
          'Accept': item.type === 'video' ? 'video/*' : 'image/*',
        },
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Validate blob
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadItem.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      // Update download status
      setDownloads(prev =>
        prev.map(d =>
          d.id === downloadId
            ? { ...d, status: 'completed', progress: 100 }
            : d
        )
      );

      toast.success('Download completed!');
    } catch (error) {
      console.error('Download error:', error);
      
      // Try alternative download method for CORS issues
      try {
        const link = document.createElement('a');
        link.href = item.downloadUrl;
        link.download = downloadItem.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloads(prev =>
          prev.map(d =>
            d.id === downloadId
              ? { ...d, status: 'completed', progress: 100 }
              : d
          )
        );
        
        toast.success('Download initiated! Check your downloads folder.');
      } catch (fallbackError) {
        console.error('Fallback download error:', fallbackError);
        setDownloads(prev =>
          prev.map(d =>
            d.id === downloadId
              ? { ...d, status: 'error' }
              : d
          )
        );
        toast.error('Download failed. The file may not be accessible or the server may be blocking downloads.');
      }
    }
  }, []);

  const handleClearCompleted = useCallback(() => {
    setDownloads(prev => prev.filter(d => d.status !== 'completed'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Download Royalty-Free Media
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover and download high-quality images and videos from Pexels and Pixabay.
            All content is completely free to use for personal and commercial projects.
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        <MediaGrid
          items={mediaItems}
          loading={loading}
          onDownload={handleDownload}
        />

        {mediaItems.length > 0 && !loading && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All content is provided by{' '}
              <a
                href="https://www.pexels.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                Pexels
              </a>{' '}
              and{' '}
              <a
                href="https://pixabay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                Pixabay
              </a>
              . Please respect the original creators and consider giving attribution when possible.
            </p>
          </div>
        )}
      </main>

      <DownloadQueue
        downloads={downloads}
        onClearCompleted={handleClearCompleted}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
          },
        }}
      />

      <style>{`
        :root {
          --toast-bg: #ffffff;
          --toast-color: #374151;
          --toast-border: #e5e7eb;
        }
        
        .dark {
          --toast-bg: #1f2937;
          --toast-color: #f9fafb;
          --toast-border: #374151;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;