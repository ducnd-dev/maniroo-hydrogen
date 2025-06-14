import {useState} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *   images: Array<{id: string, url: string, altText?: string, width?: number, height?: number}>;
 *   selectedVariantImage?: {id: string, url: string, altText?: string, width?: number, height?: number};
 *   productTitle: string;
 * }}
 */
export function ProductImageCarousel({images = [], selectedVariantImage, productTitle}) {
  // If we have a selected variant image, make sure it's first in the array
  const allImages = selectedVariantImage 
    ? [selectedVariantImage, ...images.filter(img => img.id !== selectedVariantImage.id)]
    : images;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!allImages.length) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const currentImage = allImages[currentImageIndex];

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        {/* Main Image */}
        <div 
          className={`w-full h-full transition-transform duration-300 cursor-zoom-in ${
            isZoomed ? 'scale-150 cursor-zoom-out' : ''
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsZoomed(!isZoomed);
              e.preventDefault();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={isZoomed ? "Zoom out image" : "Zoom in image"}
        >
          <Image
            alt={currentImage.altText || productTitle}
            aspectRatio="1/1"
            data={currentImage}
            loading="eager"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Arrows - Only show if more than 1 image */}
        {allImages.length > 1 && (
          <>
            {/* Previous Arrow */}
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
              aria-label="Next image"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
            <span>Click to zoom</span>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 image */}
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                alt={image.altText || `${productTitle} ${index + 1}`}
                aspectRatio="1/1"
                data={image}
                loading="lazy"
                sizes="64px"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}      {/* Dots Indicator for mobile - Only show if more than 1 image */}
      {allImages.length > 1 && (
        <div className="flex justify-center space-x-2 md:hidden">
          {allImages.map((image, index) => (
            <button
              key={`dot-${image.id || index}`}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? 'bg-orange-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
