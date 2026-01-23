import { useState, useEffect } from "react";
import {WindowControls} from "#components/index.js";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useWindowStore from "#store/window.js";

const ImageFile = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loaded state when a new image is opened
  useEffect(() => {
    setIsLoaded(false);
  }, [data?.imageUrl]);

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
          src={imageUrl} 
          alt={name}
          onLoad={() => setIsLoaded(true)}
          decoding="async"
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </>
  );
};

const ImageFileWindow = WindowWrapper(ImageFile, "imgfile");

export default ImageFileWindow;
