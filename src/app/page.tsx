"use client"

import dynamic from 'next/dynamic';
import React from 'react';

const GeoJsonUploader = dynamic(() => import('@/components/features/GeoJsonUploader'), {
  ssr: false
});

const UploadPage = () => {
  return (
    <div>
      <GeoJsonUploader />
    </div>
  );
};

export default UploadPage;
