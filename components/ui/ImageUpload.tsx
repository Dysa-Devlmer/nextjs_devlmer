'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { Button } from './Button';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  endpoint: 'productImage' | 'ticketAttachment';
  label?: string;
}

export function ImageUpload({ value, onChange, endpoint, label = 'Imagen' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].url);
        setUploading(false);
        setError('');
      }
    },
    onUploadError: (error: Error) => {
      setError(error.message);
      setUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      await startUpload(Array.from(files));
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative">
          <div className="aspect-square max-w-xs bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
          <input
            type="file"
            id={`upload-${endpoint}`}
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor={`upload-${endpoint}`}
            className="cursor-pointer flex flex-col items-center"
          >
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-3" />
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Haz clic para subir una imagen
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG hasta 4MB
                </p>
              </>
            )}
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Opción alternativa: URL manual */}
      {!value && !uploading && (
        <div className="text-center">
          <span className="text-xs text-gray-500">O ingresa una URL directamente:</span>
          <input
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}
    </div>
  );
}
