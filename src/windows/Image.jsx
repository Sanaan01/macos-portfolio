import { useState, useEffect, useRef, useCallback } from "react";
import { WindowControls } from "#components/index.js";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useWindowStore from "#store/window.js";

const ImageFile = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // Reset and check for cached image when imageUrl changes
  useEffect(() => {
    setIsLoaded(false);

    // Use requestAnimationFrame to check after the DOM has painted
    // This ensures the img element exists and has started loading
    const rafId = requestAnimationFrame(() => {
      if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
        setIsLoaded(true);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [data?.imageUrl]);

  // Handle onLoad event
  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Ref callback to check if image is already loaded when ref is attached
  const setImgRef = useCallback((node) => {
    imgRef.current = node;
    // Check immediately when ref is attached
    if (node?.complete && node?.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  if (!data) return null;

  const { name, imageUrl, thumbnail } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="imgfile" />
        <h2>{name}</h2>
      </div>

      <div className="relative p-5 bg-white dark:bg-[#1e1e1e] h-[calc(100%-40px)] flex items-center justify-center overflow-hidden">
        {/* Low-res placeholder (Thumbnail) */}
        {!isLoaded && thumbnail && (
          <img
            src={thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-contain blur-md opacity-50"
          />
        )}

        {/* High-res Image */}
        <img
          ref={setImgRef}
          src={imageUrl}
          alt={name}
          onLoad={handleImageLoad}
          decoding="async"
          style={{ transform: 'translateZ(0)' }}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>
    </>
  );
};

const ImageFileWindow = WindowWrapper(ImageFile, "imgfile");

export default ImageFileWindow;
