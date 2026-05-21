'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#0f172a', // slate-900
          light: '#ffffff',
        },
      }, (error) => {
        if (error) console.error('QR Code error:', error);
      });
    }
  }, [url, size]);

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'business-qr-code.png';
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="rounded-xl shadow-sm border border-slate-100" />
      <button 
        onClick={downloadQR}
        className="mt-6 text-sm font-bold text-amber-600 hover:text-amber-700 underline"
      >
        Download High-Res QR Code
      </button>
    </div>
  );
}
