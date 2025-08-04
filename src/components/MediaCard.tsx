import React, { useState } from 'react';
import { Download, Eye, Clock, User, Tag, Image as ImageIcon, Video } from 'lucide-react';
import { MediaItem } from '../types';
import toast from 'react-hot-toast';

interface MediaCardProps {
  item: MediaItem;
  onDownload: (item: MediaItem) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onDownload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await onDownload(item);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Download failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Fallback image URL
  const fallbackImage = `https://via.placeholder.com/400x225/e5e7eb/9ca3af?text=${encodeURIComponent(item.type === 'video' ? 'Video' : 'Image')}`;
  return (
    <>
      <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
        <div className="relative aspect-video overflow-hidden">
          {/* Loading placeholder */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 text-gray-400">
                {item.type === 'video' ? (
                  <Video className="w-full h-full" />
                ) : (
                  <ImageIcon className="w-full h-full" />
                )}
              </div>
            </div>
          )}
          
          <img
            src={imageError ? fallbackImage : item.thumbnail}
            alt={item.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          {/* Type indicator */}
          <div className="absolute top-3 left-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 rounded-lg text-white text-xs">
              {item.type === 'video' ? (
                <Video className="w-3 h-3" />
              ) : (
                <ImageIcon className="w-3 h-3" />
              )}
              <span className="capitalize">{item.type}</span>
            </div>
          </div>

          {/* Duration for videos */}
          {item.type === 'video' && item.duration && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center space-x-1 px-2 py-1 bg-black/50 rounded-lg text-white text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatDuration(item.duration)}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPreview(true)}
                className="p-2 bg-white/90 hover:bg-white rounded-lg transition-colors backdrop-blur-sm"
                title="Preview"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 backdrop-blur-sm"
                title="Download"
              >
                <Download className={`w-4 h-4 ${isLoading ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
            {item.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{item.photographer}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs capitalize">
                {item.source}
              </span>
            </div>
          </div>

          {item.size && (
            <div className="mt-2 text-xs text-gray-400">
              {item.size.width} × {item.size.height}
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex items-center space-x-1">
              <Tag className="w-3 h-3 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-gray-400">+{item.tags.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm"
            >
              <span className="text-xl">×</span>
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              {item.type === 'video' ? (
                <video
                  src={item.downloadUrl}
                  controls
                  className="max-w-full max-h-[80vh]"
                  autoPlay
                  onError={(e) => {
                    console.error('Video preview error:', e);
                    toast.error('Unable to preview this video');
                  }}
                />
              ) : (
                <img
                  src={item.downloadUrl}
                  alt={item.title}
                  className="max-w-full max-h-[80vh] object-contain"
                  onError={(e) => {
                    console.error('Image preview error:', e);
                    toast.error('Unable to preview this image');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaCard;