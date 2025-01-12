'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import QRScanner from './QRScanner';
import { isMobileDevice } from '../utils/deviceDetection';
import ProductRegistration from './ProductRegistration';

interface QRScannerInterfaceProps {
  onResult: (code: string, amount: number) => void;
  onError?: (error: string) => void;
}

export default function QRScannerInterface({ onResult, onError }: QRScannerInterfaceProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [tempQrReader, setTempQrReader] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    if (!dropZoneRef.current || isMobile) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const file = e.dataTransfer?.files[0];
      if (file) {
        await handleQRFile(file);
      }
    };

    const element = dropZoneRef.current;
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('drop', handleDrop);
    };
  }, [isMobile]);

  const handleQRFile = async (file: File) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.id = 'temp-qr-reader';
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);

      const html5QrCode = new Html5Qrcode("temp-qr-reader");
      setTempQrReader(html5QrCode);

      const result = await html5QrCode.scanFile(file, true);
      handleScanResult(result);
    } catch (error) {
      if (onError && error instanceof Error) {
        onError(error.message);
      }
    } finally {
      if (tempQrReader) {
        await tempQrReader.clear();
        setTempQrReader(null);
      }
      const tempDiv = document.getElementById('temp-qr-reader');
      if (tempDiv) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleQRFile(file);
    }
  };

  const handleScanResult = (result: string) => {
    const productCodeMatch = result.match(/[A-Z]{4}-\d{6}-[A-Z]$/);
    if (productCodeMatch) {
      setShowScanner(false);
      setScannedCode(productCodeMatch[0]);
    } else if (onError) {
      onError('Invalid QR code format');
    }
  };

  const handleRegistrationComplete = (amount: number) => {
    if (scannedCode) {
      onResult(scannedCode, amount);
      setScannedCode(null);
    }
  };

  if (scannedCode) {
    return (
      <ProductRegistration
        productCode={scannedCode}
        onCancel={() => setScannedCode(null)}
        onComplete={handleRegistrationComplete}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {showScanner ? (
        <div>
          <div className="mb-4">
            <button
              onClick={() => setShowScanner(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>
          <QRScanner onResult={handleScanResult} onError={onError} />
        </div>
      ) : (
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          {!isMobile && (
            <div
              ref={dropZoneRef}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group cursor-pointer"
            >
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                <svg
                  className="w-10 h-10 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-base font-medium">Drop an image</p>
              </div>
            </div>
          )}

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              <svg
                className="w-10 h-10 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-base font-medium">Upload an image</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div
            onClick={() => setShowScanner(true)}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
              <svg
                className="w-10 h-10 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              <p className="text-base font-medium">Scan using camera</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
