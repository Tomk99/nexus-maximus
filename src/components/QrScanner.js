"use client";

import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useRouter } from 'next/router';

export function QrScanner({ onScanSuccess, onScanError }) {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
        facingMode: { exact: "environment" }
      },
      false
    );

    const handleSuccess = (decodedText) => {
      console.log(`QR kód beolvasva: ${decodedText}`);
      const match = decodedText.match(/box\/(\d+)$/);
      if (match && match[1]) {
        const boxId = match[1];
        scanner.clear();
        onScanSuccess();
        router.push(`/inventory/box/${boxId}`);
      } else {
        onScanError("A beolvasott QR kód nem a várt formátumú.");
      }
    };

    const handleError = (error) => {
    };

    scanner.render(handleSuccess, handleError);

    return () => {
      if (scanner && scanner.getState() === 2) {
         scanner.clear().catch(error => {
            console.error("Nem sikerült leállítani a scannert.", error);
         });
      }
    };
  }, [router, onScanSuccess, onScanError]);

  return <div id="qr-reader" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}></div>;
}