import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import FileUploader from '../FileUploader';
import '@testing-library/jest-dom';

// Mocks untuk fungsi baru yang ditambahkan pada refactor
jest.mock('geojsonjs', () => ({
  getFeatureCollection: jest.fn().mockImplementation((json) => json),
  validate: jest.fn().mockReturnValue({ valid: true }),
}));

const mockOnFileUpload = jest.fn();
const mockData = (files: any[]) => {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  }
}

describe('FileUploader Component', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FileUploader onFileUpload={mockOnFileUpload} />);
    expect(screen.getByTestId('drop-input')).toBeInTheDocument();
  });

  it('calls "onFileUpload" with correct data when a valid GeoJSON file is dropped', async () => {
    const validGeoJson = { type: 'FeatureCollection', features: [] };
    const file = new File([JSON.stringify(validGeoJson)], 'test.geojson', {type: 'application/geo+json'});
    const data = mockData([file]);
  
    await act(async () => {
      render(<FileUploader onFileUpload={mockOnFileUpload} />);
    });
    
    const inputEl = screen.getByTestId('drop-input');
    fireEvent.drop(inputEl, data);
    
    await waitFor(() => expect(mockOnFileUpload).toHaveBeenCalledWith(validGeoJson));
  });

  it('does not call "onFileUpload" when a non-GeoJSON file extension is dropped', async () => {
    const file = new File(['some content'], 'not-a-geojson.txt', {type: 'text/plain'});
    const data = mockData([file]);
  
    await act(async () => {
      render(<FileUploader onFileUpload={mockOnFileUpload} />);
    });
  
    const inputEl = screen.getByTestId('drop-input');
    fireEvent.drop(inputEl, data);
  
    await waitFor(() => expect(mockOnFileUpload).not.toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith('Only GeoJSON files are allowed');
  });
  
  it('alerts the user when a GeoJSON file with incorrect format is dropped', async () => {
    // Mock `validate` to return invalid result for this specific test
    require('geojsonjs').validate.mockReturnValueOnce({ valid: false, error: 'Invalid format' });
  
    const invalidGeoJson = { type: 'InvalidType' }; // Simulating incorrect format
    const file = new File([JSON.stringify(invalidGeoJson)], 'invalid.geojson', {type: 'application/geo+json'});
    const data = mockData([file]);
  
    await act(async () => {
      render(<FileUploader onFileUpload={mockOnFileUpload} />);
    });
  
    const inputEl = screen.getByTestId('drop-input');
    fireEvent.drop(inputEl, data);
  
    await waitFor(() => expect(mockOnFileUpload).not.toHaveBeenCalled());
    expect(window.alert).toHaveBeenCalledWith('invalid geojson format: Invalid format');
  });
});
