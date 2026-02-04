import { useState, useMemo, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/index.js";
import { Mail, Search, Loader2 } from "lucide-react";
import useWindowStore from "#store/window.js";
import { gallery as staticGallery, galleryLinks } from "#constants/index.js";

const Gallery = () => {
  const { openWindow } = useWindowStore();
  const [activeCategory, setActiveCategory] = useState("Library");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryCategories, setGalleryCategories] = useState(galleryLinks);

  // Fetch images from R2 API on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/gallery.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch gallery: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const r2Images = data.images || [];
        const savedOrder = data.order || null;

        // Convert static gallery to use keys matching the uploader format
        const staticWithKeys = staticGallery.map(img => ({
          ...img,
          key: `static/${img.name}`,
        }));

        // If we have a saved order, apply it to combine both sets
        if (savedOrder && savedOrder.length > 0) {
          // Create maps for quick lookup
          const r2Map = new Map(r2Images.map(img => [img.id, img]));
          const staticMap = new Map(staticWithKeys.map(img => [img.key, img]));

          const orderedImages = [];

          // Add images in saved order
          for (const key of savedOrder) {
            if (key.startsWith('static/')) {
              // Static image
              if (staticMap.has(key)) {
                orderedImages.push(staticMap.get(key));
                staticMap.delete(key);
              }
            } else {
              // R2 image
              if (r2Map.has(key)) {
                orderedImages.push(r2Map.get(key));
                r2Map.delete(key);
              }
            }
          }

          // Add any remaining images not in saved order (new uploads at start, then static)
          for (const img of r2Map.values()) {
            orderedImages.unshift(img);
          }
          for (const img of staticMap.values()) {
            orderedImages.push(img);
          }

          setImages(orderedImages);
        } else {
          // No saved order - default: R2 first (already ordered by date), then static
          setImages([...r2Images, ...staticWithKeys]);
        }

        // Use dynamic categories if available, otherwise fallback to static
        if (data.categories && data.categories.length > 0) {
          // Transform to match galleryLinks structure
          const dynamicCategories = data.categories.map((cat, idx) => ({
            id: idx + 1,
            icon: cat.icon || '/icons/folder.svg',
            title: cat.title,
          }));
          setGalleryCategories(dynamicCategories);
        }
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError(err.message);
        // Fallback to static images on error (default order from constants)
        setImages(staticGallery);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filter by category (same logic as before)
  const filteredGallery = useMemo(() => {
    const filtered = images.filter((item) => item.categories.includes(activeCategory));
    // De-duplicate by image path to ensure no repeats in the grid
    return Array.from(new Map(filtered.map(item => [item.img, item])).values());
  }, [activeCategory, images]);

  return (
    <>
      <div id="window-header">
        <WindowControls target="gallery" />
        <div className="w-full flex justify-end items-center gap-3 text-gray-500 dark:text-white">
          <Mail className="icon" />
          <Search className="icon" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full h-[calc(100%-40px)] bg-white dark:bg-[#1e1e1e] overflow-hidden">
        <div className="sidebar w-full sm:w-3/12 overflow-x-auto sm:overflow-y-auto h-auto sm:h-full flex-none">
          <h2 className="max-sm:hidden tracking-wider">Gallery</h2>

          <ul className="flex sm:flex-col p-2 gap-2">
            {galleryCategories.map(({ id, icon, title }) => (
              <li
                key={id}
                onClick={() => setActiveCategory(title)}
                className={activeCategory === title ? "active" : "not-active"}
              >
                <img src={icon} alt={title} className="w-5 h-5" />
                <p className="text-sm">{title}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="gallery h-full overflow-y-auto flex-1 max-sm:p-2">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}

          {/* Error State (shows but still displays fallback images) */}
          {error && !loading && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error} — Showing cached images
            </div>
          )}

          {/* Gallery Grid - PRESERVED EXACT LAYOUT */}
          {!loading && (
            <ul>
              {filteredGallery.map(({ id, img, name, thumbnail: customThumbnail }) => {
                // Use provided thumbnail, or fallback to local thumbnail path, or original
                const thumbnail = customThumbnail || img.replace("/images/", "/images/thumbnails/").replace(/\.[^/.]+$/, ".webp");

                const handlePreload = () => {
                  const imgObj = new Image();
                  imgObj.src = img;
                };

                return (
                  <li
                    key={id}
                    onMouseEnter={handlePreload}
                    onClick={() =>
                      openWindow('imgfile', {
                        id,
                        name: name || "Gallery Image",
                        icon: "/images/image.png",
                        kind: "file",
                        filetype: "img",
                        imageUrl: img,
                        thumbnail,
                      })
                    }
                  >
                    <img
                      src={thumbnail}
                      alt={name || `Gallery Image ${id}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = img;
                      }}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </div>
    </>
  )
}




const GalleryWindow = WindowWrapper(Gallery, "gallery")
export default GalleryWindow
