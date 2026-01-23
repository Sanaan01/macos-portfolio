import {WindowControls} from "#components/index.js";
import {Search} from "lucide-react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import {locations} from "#constants/index.js";
import useLocationStore from "#store/location.js";
import clsx from "clsx";
import useWindowStore from "#store/window.js";
const Finder = () => {
  const {openWindow} = useWindowStore();
  const {activeLocation, setActiveLocation} = useLocationStore();

  const openItem = (item) => {
    if(item.fileType === "pdf") return openWindow('resume')
    if(item.fileType === "txt") return openWindow('txtfile', item)
    if(item.fileType === "img") return openWindow('imgfile', item)
    if(item.kind === "folder") return setActiveLocation(item)
    if(['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, "_blank");

    openWindow(`${item.fileType}${item.kind}`, item)
  };

  const renderList = (name, items) => (
    items.map((item) => (
      <li
        key={item.id}
        onClick={() => setActiveLocation(item)}
        className={clsx(
          item.id === activeLocation.id ? "active" : "not-active",
        )}
      >
        <img src={item.icon} className="w-4" alt={item.name}
        />
        <p className="text-sm font-medium truncate">{item.name}</p>
      </li>
    ))
  );

  return (
    <>
      <div id="window-header">
        <WindowControls target="finder"/>
        <Search className="icon"/>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] flex h-[calc(100%-40px)] max-sm:flex-col">
        <div className="sidebar">
          <h3 className="tracking-wider">Favourites</h3>
          <ul>
            {renderList("Favourites", Object.values(locations))}
          </ul>
          <h3 className="tracking-wider">My Projects</h3>
          <ul>
            {renderList("My Projects", locations.work.children)}
          </ul>
        </div>
        <ul className="content max-sm:p-4 max-sm:grid max-sm:grid-cols-3 max-sm:gap-4 max-sm:h-full max-sm:overflow-y-auto max-sm:max-w-none">
          {activeLocation.children.map((item) => (
            <li
              key={item.id}
              className={clsx(item.position, "max-sm:static max-sm:flex max-sm:flex-col max-sm:items-center max-sm:gap-2")}
              onClick={() => openItem(item)}
            >
              <img src={item.icon} alt={item.name} className="max-sm:size-12" />
              <p className="max-sm:text-xs max-sm:w-full">{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
};

const FinderWindow = WindowWrapper(Finder, "finder")

export default FinderWindow
