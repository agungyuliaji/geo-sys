import React, { useState } from 'react';
import FileUploader from './FileUploader';
import MapView from './MapView';

const GeoJsonUploader = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const handleFileUpload = (geoJson: any) => {
    setGeoJsonData(geoJson);
  };
  const resetGeoJsonData = () => {
    setGeoJsonData(null);
  };

  return (
    <>
      {!geoJsonData && <FileUploader onFileUpload={handleFileUpload} />}
      {geoJsonData && <MapView geoJsonData={geoJsonData} onReset={resetGeoJsonData} />}
    </>
  );
};

export default GeoJsonUploader;
