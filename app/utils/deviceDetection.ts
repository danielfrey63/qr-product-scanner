'use client';

export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};
