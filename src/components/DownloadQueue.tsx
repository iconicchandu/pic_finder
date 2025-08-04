import React from 'react';
import { Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { DownloadItem } from '../types';

interface DownloadQueueProps {
  downloads: DownloadItem[];
  onClearCompleted: () => void;
}

const DownloadQueue: React.FC<DownloadQueueProps> = ({ downloads, onClearCompleted }) => {
  if (downloads.length === 0) return null;

  const getStatusIcon = (status: DownloadItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'downloading':
        return <Download className="w-4 h-4 text-blue-500 animate-bounce" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const completedCount = downloads.filter(d => d.status === 'completed').length;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white">
            Downloads ({downloads.length})
          </h3>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {downloads.map((download) => (
          <div key={download.id} className="p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div className="flex items-center space-x-3">
              {getStatusIcon(download.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {download.name}
                </p>
                {download.status === 'downloading' && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${download.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{download.progress}%</p>
                  </div>
                )}
                {download.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">Download failed</p>
                )}
                {download.status === 'completed' && (
                  <p className="text-xs text-green-500 mt-1">Download completed</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadQueue;