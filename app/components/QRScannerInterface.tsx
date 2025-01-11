'use client';

import { useState } from 'react';
import QRScanner from './QRScanner';

interface QRScannerInterfaceProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
}

export default function QRScannerInterface({ onResult, onError }: QRScannerInterfaceProps) {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      {showScanner ? (
        <QRScanner onResult={onResult} onError={onError} />
      ) : (
        <div className="flex gap-4 justify-center items-stretch">
          <div className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm">Drag & Drop QR Code</p>
              <p className="text-xs mt-1">or click to upload</p>
            </div>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="flex flex-col items-center justify-center px-6 py-4 bg-blue-50 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <svg
              className="w-8 h-8 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-xs mt-2 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              Use Camera
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
