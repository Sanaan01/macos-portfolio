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
    <div>
      <h3>{name}</h3>

    <ul>
      {items.map((item) => (
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
      ))}
    </ul>
  </div>
);

  return (
    <>
      <div id="window-header">
        <WindowControls target="finder"/>
        <Search className="icon"/>
      </div>

      <div className="bg-white dark:bg-[#1e1e1e] flex h-[calc(100%-40px)] max-sm:flex-col">
        <div className="sidebar max-sm:w-full max-sm:h-auto max-sm:flex-none max-sm:border-r-0 max-sm:border-b max-sm:p-2">
          <div className="max-sm:flex max-sm:overflow-x-auto max-sm:gap-2">
            {Object.values(locations).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveLocation(item)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap",
                  item.id === activeLocation.id ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                )}
              >
                <img src={item.icon} className="w-4" alt={item.name} />
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
        <ul className="content max-sm:p-4 max-sm:grid max-sm:grid-cols-3 max-sm:gap-4 max-sm:h-full max-sm:overflow-y-auto">
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
