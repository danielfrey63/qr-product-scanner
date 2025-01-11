'use client';

import { useState } from "react";
import QRScannerInterface from './components/QRScannerInterface';

export default function Home() {
  const [lastScan, setLastScan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              QR Scanner
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Scan QR codes using your camera or upload an image
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <QRScannerInterface
              onResult={(result) => {
                setLastScan(result);
              }}
              onError={(error) => {
                console.error(error);
              }}
            />
          </div>

          {lastScan && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Last Scan Result
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 break-all font-mono">
                  {lastScan}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
