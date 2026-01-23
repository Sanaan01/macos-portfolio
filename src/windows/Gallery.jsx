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

      <div className="flex flex-col sm:flex-row w-full h-full overflow-y-auto sm:overflow-hidden">
        <div className="sidebar w-full sm:w-3/12 overflow-y-auto">
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

        <div className="gallery">
          <ul>
            {filteredGallery.map(({ id, img}) => (
              <li
                key={id}
                onClick={() =>
                  openWindow('imgfile', {
                    id,
                    name: "Gallery Image",
                    icon: "/images/image.png",
                    kind: "file",
                    filetype: "img",
                    imageUrl: img,
                })
                }
              >
                <img src={img} alt={`Gallery Image ${id}`}/>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  )
}





const GalleryWindow = WindowWrapper(Gallery, "gallery")
export default GalleryWindow
