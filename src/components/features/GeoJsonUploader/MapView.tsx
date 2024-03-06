import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Button } from '@/components/common';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapViewProps {
  geoJsonData: GeoJSON.FeatureCollection;
  onReset: () => void;
}

// Function to create popup based on GeoJSON feature
const renderPopup = (feature: GeoJSON.Feature<GeoJSON.Geometry>) => {
  let popupContent = '<div>';
  if (feature.properties) {
    // Looping through each property to display it in the popup
    Object.entries(feature.properties).forEach(([key, value]) => {
      const formattedKey = key.replace(/(^|\s)\S/g, l => l.toUpperCase());
      popupContent += `<strong>${formattedKey}:</strong> ${value}<br/>`;
    });
  }
  popupContent += '</div>';
  return popupContent;
};

// Component to set map view based on GeoJSON data
const SetViewToGeoJSON = ({ data }: { data: GeoJSON.FeatureCollection }) => {
  const map = useMap();
  useEffect(() => {
    const geoJsonLayer = L.geoJSON(data);
    map.fitBounds(geoJsonLayer.getBounds());
  }, [data, map]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ geoJsonData, onReset }) => {
  const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry>, layer: L.Layer) => {
    if (feature.properties) {
      layer.bindPopup(renderPopup(feature));
    }
  };

  return (
    <>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100vh', width: '100%' }}
        key={JSON.stringify(geoJsonData)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoJsonData} onEachFeature={onEachFeature} />
        <SetViewToGeoJSON data={geoJsonData} />
      </MapContainer>

      <Button
        onClick={onReset}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000
        }}
      >
        Close Map
      </Button>
    </>
  );
};

export default MapView;
