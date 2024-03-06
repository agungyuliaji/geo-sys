import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MapView from '../MapView';
import '@testing-library/jest-dom';

jest.mock('react-leaflet', () => ({
  Map: jest.fn(),
  TileLayer: jest.fn(),
  MapContainer: jest.fn(),
  GeoJSON: jest.fn(),
  useMap: jest.fn(),
}));

const mockOnReset = jest.fn();

const sampleGeoJsonData: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Location A" },
      geometry: {
        type: "Point",
        coordinates: [102.0, 0.5],
      },
    },
  ],
}

describe('MapView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<MapView geoJsonData={sampleGeoJsonData} onReset={mockOnReset} />);
    expect(screen.getByText('Close Map')).toBeInTheDocument();
  });

  it('calls "onReset" when the Close Map button is clicked', () => {
    render(<MapView geoJsonData={sampleGeoJsonData} onReset={mockOnReset} />);

    const closeButton = screen.getByText('Close Map');
    fireEvent.click(closeButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
