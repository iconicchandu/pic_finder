import React, { useState } from 'react';
import { Key, ExternalLink, AlertCircle } from 'lucide-react';

const ApiKeySetup: React.FC = () => {
  const [showSetup, setShowSetup] = useState(true);

  if (!showSetup) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Key className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            API Keys Required
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            To start downloading royalty-free media, you'll need to add your API keys to the .env file.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Pexels API</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Free tier: 200 requests/hour</p>
              </div>
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <span className="text-sm">Get API Key</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Pixabay API</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Free tier: 5,000 requests/hour</p>
              </div>
              <a
                href="https://pixabay.com/api/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <span className="text-sm">Get API Key</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-700 dark:text-amber-300">
                <p className="font-medium mb-1">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Get your API keys from the links above</li>
                  <li>Add them to the .env file in your project root</li>
                  <li>Restart the development server</li>
                  <li>Start searching for amazing royalty-free content!</li>
                </ol>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSetup(false)}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Dismiss this message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;