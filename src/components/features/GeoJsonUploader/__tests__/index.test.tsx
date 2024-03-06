import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import GeoJsonUploader from '../index';
import '@testing-library/jest-dom';

// eslint-disable-next-line react/display-name
jest.mock('../FileUploader', () => (props: { onFileUpload: (data?: any) => void }) => (
  <div data-testid="file-uploader-mock" onClick={() => props.onFileUpload({dummy: 'geojson'})}>
    FileUploader Mock
  </div>
));

// eslint-disable-next-line react/display-name
jest.mock('../MapView', () => ({ onReset }: { onReset: () => void }) => (
  <div data-testid="map-view-mock">
    <div>MapView Mock</div>
    <button onClick={onReset} data-testid="reset-button">Reset</button>
  </div>
));

describe('GeoJsonUploader Component', () => {
  it('renders FileUploader again after click reset button', () => {
    // Render the GeoJsonUploader component
    render(<GeoJsonUploader />);
    
    // Simulate file upload to change state, which should render MapView
    fireEvent.click(screen.getByTestId('file-uploader-mock'));
  
    // After the file upload, MapView should be present and FileUploader should not
    expect(screen.getByTestId('map-view-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('file-uploader-mock')).not.toBeInTheDocument();
  
    fireEvent.click(screen.getByTestId('reset-button'));
  
    // After reset, FileUploader should be rendered again. And MapView should not be present
    expect(screen.getByTestId('file-uploader-mock')).toBeInTheDocument();
    expect(screen.queryByTestId('map-view-mock')).not.toBeInTheDocument();
  });
});

