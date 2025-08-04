import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { MediaItem } from '../types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  items: MediaItem[];
  loading: boolean;
  onDownload: (item: MediaItem) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ items, loading, onDownload }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden"
          >
            <div className="aspect-video bg-gray-300 dark:bg-gray-600 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try searching with different keywords or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} onDownload={onDownload} />
      ))}
    </div>
  );
};

export default MediaGrid;