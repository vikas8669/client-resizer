'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useEditorStore } from '@/store/useEditorStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function Dropzone() {
  const setOriginalFile = useEditorStore((state) => state.setOriginalFile);
  const [isDragging, setIsDragging] = useState(false);
  const MAX_FILE_SIZE = 20 * 1024 * 1024;

  const validateAndSetFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image is too large. Max size is 20MB.');
      return;
    }

    setOriginalFile(file);
  }, [setOriginalFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, [validateAndSetFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  }, [validateAndSetFile]);

  return (
    <motion.div 
      className={`relative flex flex-col items-center justify-center w-full h-[300px] sm:h-[400px] border-2 border-dashed rounded-3xl transition-all duration-300 overflow-hidden group ${
        isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02] shadow-[0_0_40px_rgba(34,98,199,0.15)]' 
          : 'border-zinc-300 dark:border-white/20 bg-white dark:bg-white/5 hover:border-primary/50 hover:bg-zinc-50 dark:hover:bg-white/10 hover:shadow-lg'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-transparent pointer-events-none" />

      <button
        type="button"
        onClick={() => document.getElementById('file-upload')?.click()}
        className="absolute inset-0 z-20 cursor-pointer focus:outline-none active:opacity-75"
        aria-label="Upload image file"
      />

      <motion.div 
        animate={{ y: isDragging ? -10 : 0, scale: isDragging ? 1.1 : 1 }}
        className="relative z-10 p-6 bg-white dark:bg-zinc-900 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-6 group-hover:shadow-[0_8px_30px_rgba(34,98,199,0.2)] transition-shadow duration-300 pointer-events-none"
      >
        <UploadCloud className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-zinc-400 group-hover:text-primary'}`} />
      </motion.div>

      <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-2 pointer-events-none">
        {isDragging ? 'Drop it here!' : 'Upload your image'}
      </h3>
      <p className="relative z-10 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 text-center max-w-sm px-4 pointer-events-none">
        {isDragging ? 'Release to upload' : 'Tap to upload, or drag files here'}
      </p>
      <p className="relative z-10 mt-2 text-xs text-zinc-400 dark:text-zinc-500 text-center px-4 pointer-events-none">
        Supports JPG, PNG, WebP up to 20MB
      </p>
      
      <input 
        id="file-upload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileInput}
      />
    </motion.div>
  );
}

