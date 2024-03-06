import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getFeatureCollection, validate } from 'geojsonjs';
import { Button } from '@/components/common';

interface FileUploaderProps {
  onFileUpload: (geoJson: GeoJSON.FeatureCollection) => void;
}

const readFileAsJson = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target!.result as string);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const processGeoJsonFile = async (file: File, onFileUpload: (geoJson: GeoJSON.FeatureCollection) => void) => {
  try {
    const json = await readFileAsJson(file);
    const featureCollection = getFeatureCollection(json);
    const result = validate(featureCollection);
    if (result.valid) {
      onFileUpload(json);
    } else {
      alert(`invalid geojson format: ${result.error}`);
    }
  } catch (error) {
    const typedError = error as Error;
    alert(`Error parsing file: ${typedError.message}`);
  }
};

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      if (file.name.endsWith('.geojson')) {
        processGeoJsonFile(file, onFileUpload);
      } else {
        alert('Only GeoJSON files are allowed');
      }
    });
  }, [onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div data-testid="drop-input" {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <div className="dropzone-wrapper border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
          <p className="mb-2 text-sm text-gray-500">Drag and drop some files here, or click to select files</p>
          <Button>Choose a file</Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
