'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
}

const QRScanner = ({ onResult, onError }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Wait for the DOM to be ready
    const initializeScanner = () => {
      try {
        if (!document.getElementById('qr-reader')) {
          console.error('QR reader element not found');
          return;
        }

        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
          },
          false
        );

        scannerRef.current.render(
          (decodedText) => {
            if (scannerRef.current) {
              scannerRef.current.clear();
            }
            onResult(decodedText);
          },
          (errorMessage) => {
            if (
              !errorMessage.includes('NotReadableError') &&
              !errorMessage.includes('NotFoundError') &&
              !errorMessage.includes('NotAllowedError')
            ) {
              if (onError) {
                onError(errorMessage);
              }
            }
          }
        );

        setIsScanning(true);
      } catch (error) {
        console.error('Error initializing scanner:', error);
        if (onError && error instanceof Error) {
          onError(error.message);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(initializeScanner, 100);

    return () => {
      clearTimeout(timeoutId);
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch(console.error);
        } catch (error) {
          console.error('Error clearing scanner:', error);
        }
      }
    };
  }, [onResult, onError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        id="qr-reader" 
        className="rounded-lg overflow-hidden bg-white dark:bg-gray-800"
        style={{ minHeight: '300px' }}
      />
      {!isScanning && (
        <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
          Initializing camera...
        </div>
      )}
    </div>
  );
};

export default QRScanner;
