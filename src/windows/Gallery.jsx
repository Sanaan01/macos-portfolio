import { useState, useMemo } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {WindowControls} from "#components/index.js";
import {Mail, Search} from "lucide-react";
import useWindowStore from "#store/window.js";
import {gallery, galleryLinks} from "#constants/index.js";

const Gallery = () => {
  const { openWindow } = useWindowStore();
  const [activeCategory, setActiveCategory] = useState("Library");

  const filteredGallery = useMemo(() => {
    return gallery.filter((item) => item.categories.includes(activeCategory));
  }, [activeCategory]);

  return (
    <>
      <div id="window-header">
        <WindowControls target="gallery"/>
        <div className="w-full flex justify-end items-center gap-3 text-gray-500">
          <Mail className="icon"/>
          <Search className="icon"/>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full h-[calc(100%-40px)] bg-white dark:bg-[#1e1e1e] overflow-hidden">
        <div className="sidebar w-full sm:w-3/12 overflow-y-auto h-full">
          <h2>Gallery</h2>

          <ul>
            {galleryLinks.map(({ id, icon, title } ) => (
              <li
                key={id}
                onClick={() => setActiveCategory(title)}
                className={activeCategory === title ? "active" : "not-active"}
              >
                <img src={icon} alt={title}/>
                <p>{title}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="gallery h-full overflow-y-auto flex-1">
          <ul className="h-fit">
            {filteredGallery.map(({ id, img, name}) => {
              const thumbnail = img.replace("/images/", "/images/thumbnails/").replace(/\.[^/.]+$/, ".webp");
              
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
        </div>

      </div>
    </>
  )
}





const GalleryWindow = WindowWrapper(Gallery, "gallery")
export default GalleryWindow
