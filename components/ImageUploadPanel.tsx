
import React, { useCallback } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { UploadCloud, Loader2 } from 'lucide-react';

interface ImageUploadPanelProps {
  onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  isLoading: boolean;
}

export const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({ onDrop, isLoading }) => {
  const onDropCallback = useCallback(onDrop, [onDrop]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop: onDropCallback,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': []
    },
    multiple: false,
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  return (
    <div
      {...getRootProps()}
      className={`relative p-8 border-4 border-dashed rounded-2xl cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-brand-secondary bg-indigo-500/10' : 'border-slate-300 dark:border-slate-600'}
        bg-light-card dark:bg-dark-card backdrop-blur-sm shadow-lg animate-border-pulse
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {isLoading ? (
          <>
            <Loader2 className="h-16 w-16 text-brand-primary animate-spin" />
            <p className="text-lg font-semibold">Analyzing Image...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">The AI is thinking. Please wait a moment.</p>
          </>
        ) : (
          <>
            <UploadCloud className={`h-16 w-16 transition-transform duration-300 ${isDragActive ? 'scale-110 text-brand-secondary' : 'text-brand-primary'}`} />
            <p className="text-lg font-semibold">
              {isDragActive ? "Drop the image here!" : "Drag & drop an image, or click to select"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Let’s explore the scan together. Supports JPEG, PNG, WEBP.</p>
          </>
        )}
      </div>
    </div>
  );
};
