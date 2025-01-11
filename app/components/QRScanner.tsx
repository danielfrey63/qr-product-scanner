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
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        onResult(decodedText);
        setIsScanning(false);
      },
      (errorMessage) => {
        if (onError) {
          onError(errorMessage);
        }
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onResult, onError]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="qr-reader" className="rounded-lg overflow-hidden" />
      <div id="qr-reader-results" />
    </div>
  );
};

export default QRScanner;
