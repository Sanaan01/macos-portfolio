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

        // Combine R2 images with static images (R2 first, then static)
        const r2Images = data.images || [];
        setImages([...r2Images, ...staticGallery]);
      } catch (err) {
        console.error('Gallery fetch error:', err);
        setError(err.message);
        // Fallback to static images on error
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
            {galleryLinks.map(({ id, icon, title }) => (
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
            <ul className="h-fit grid grid-cols-2 sm:grid-cols-5 gap-2.5 grid-flow-dense">
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
