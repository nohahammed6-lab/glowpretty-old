import React, { useState, useEffect } from 'react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackIcon?: string;
  onClick?: () => void;
}

/**
 * SmartImage Component
 * Prevents old image flashing/lag by preloading new image sources in background
 * and smoothly fading in the newly loaded image over a clean luxury skeleton placeholder.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackIcon = 'photo_camera',
  onClick,
}) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Preload image in background
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setLoadedSrc(src);
      setIsLoading(false);
      setHasError(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      {/* Luxury Skeleton Loading Shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800 animate-pulse flex items-center justify-center z-10">
          <span className="material-symbols-outlined text-amber-500/50 text-2xl animate-spin">
            sync
          </span>
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="w-full h-full bg-[#FAF6ED] dark:bg-stone-800 border border-[#D4AF37]/30 flex flex-col items-center justify-center text-[#D4AF37] p-3 text-center">
          <span className="material-symbols-outlined text-3xl mb-1 opacity-70">
            {fallbackIcon}
          </span>
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 truncate max-w-full">
            {alt || 'صورة غير متاحة'}
          </span>
        </div>
      ) : (
        /* Rendered Image with Smooth Fade-in */
        <img
          src={loadedSrc || src}
          alt={alt}
          className={`transition-opacity duration-500 ease-out ${
            isLoading ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
          } ${className}`}
        />
      )}
    </div>
  );
};
