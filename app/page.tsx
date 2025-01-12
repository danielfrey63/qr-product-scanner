'use client';

import Image from 'next/image';
import QRScannerInterface from './components/QRScannerInterface';
import { useState } from 'react';

interface RegisteredProduct {
  code: string;
  amount: number;
}

export default function Home() {
  const [registeredProducts, setRegisteredProducts] = useState<RegisteredProduct[]>([]);

  const handleProductRegistered = (code: string, amount: number) => {
    setRegisteredProducts(prev => [...prev, { code, amount }]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Image
              src="/fci.svg"
              alt="FCI Logo"
              width={40}
              height={40}
              priority
              className="dark:invert"
            />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Scanner
            </h1>
          </div>
        </div>

        <div className="mb-8">
          <QRScannerInterface
            onResult={handleProductRegistered}
            onError={(error) => console.error(error)}
          />
        </div>

        {registeredProducts.length > 0 ? (
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Registered Products
              </h2>
              <div className="space-y-3">
                {registeredProducts.map((product, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                      {product.code}
                    </code>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Quantity: {product.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
