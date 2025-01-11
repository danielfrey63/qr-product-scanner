'use client';

import dynamic from 'next/dynamic';

const QRScanner = dynamic(() => import('./QRScanner'), {
  ssr: false
});

interface QRScannerWrapperProps {
  onResult: (result: string) => void;
  onError?: (error: string) => void;
}

export default function QRScannerWrapper({ onResult, onError }: QRScannerWrapperProps) {
  return (
    <div className="w-full max-w-md">
      <QRScanner onResult={onResult} onError={onError} />
    </div>
  );
}
