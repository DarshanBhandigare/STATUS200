import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  shape?: 'circle' | 'square' | 'banner';
  helperText?: string;
  bucketName?: string;
  className?: string;
  presets?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  shape = 'square',
  helperText,
  bucketName = 'portfolio-images',
  className = '',
  presets = [],
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image to optimized webp/jpeg data URL
  const compressImage = (file: File, maxWidth = 1200, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. If Supabase is configured, attempt upload to storage
      if (isSupabaseConfigured && supabase) {
        try {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { error: uploadErr } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true,
            });

          if (!uploadErr) {
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            if (data?.publicUrl) {
              onChange(data.publicUrl);
              setIsUploading(false);
              return;
            }
          }
        } catch {
          // If bucket doesn't exist, seamlessly fallback to optimized compressed data URL
        }
      }

      // 2. Client-side compressed base64 fallback (works 100% offline & in DB JSON)
      const compressedDataUrl = await compressImage(file, shape === 'circle' ? 400 : 1200);
      onChange(compressedDataUrl);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to process image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setUrlDraft('');
      setShowUrlInput(false);
    }
  };

  const shapeStyles = {
    circle: 'w-24 h-24 rounded-full',
    square: 'w-24 h-24 rounded-2xl',
    banner: 'w-full h-40 rounded-2xl',
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{label}</span>
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Upload file' : 'Paste URL'}</span>
          </button>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* URL Input Toggle Mode */}
      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlDraft || value || ''}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Apply
          </button>
        </div>
      ) : (
        /* Upload & Preview Area */
        <div className="space-y-2">
          {value ? (
            <div className="relative group inline-block w-full">
              <div
                className={`overflow-hidden border border-slate-700/80 bg-slate-900 relative ${shapeStyles[shape]} ${
                  shape === 'banner' ? 'w-full' : ''
                }`}
              >
                <img
                  src={value}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl bg-slate-800 text-white hover:bg-emerald-600 transition-colors shadow-lg"
                    title="Change Image"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="p-2 rounded-xl bg-red-950/80 text-red-300 hover:bg-red-600 hover:text-white transition-colors shadow-lg"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-emerald-500 bg-emerald-950/20 scale-[1.01]'
                  : 'border-slate-700/70 hover:border-slate-500 bg-slate-900/40 hover:bg-slate-900/80'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  <span className="text-xs text-slate-300 font-medium">Processing image...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-white">
                    <Upload className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200">Click to upload</span>
                    <span className="text-slate-400"> or drag and drop</span>
                  </div>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, GIF up to 10MB</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preset avatars if provided */}
      {presets.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400">Presets:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset)}
              className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                value === preset
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-110'
                  : 'border-slate-700 hover:border-slate-500 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={preset} alt="preset" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <span>{uploadError}</span>
        </p>
      )}

      {helperText && !uploadError && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};
