import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { navIcons, navLinks } from "#constants/index.js";
import useWindowStore from "#store/window.js";
const Navbar = () => {
  const { openWindow, closeWindow, windows } = useWindowStore()
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleIconClick = (id, img, event) => {
    if (id === 4) { // Control Center icon
      if (windows.controlcenter.isOpen) {
        closeWindow("controlcenter");
      } else {
        const rect = event.currentTarget.getBoundingClientRect();
        openWindow("controlcenter", {
          centerX: rect.left + rect.width / 2,
          bottom: rect.bottom
        });
      }
    } else if (id === 5) { // Music icon
      if (windows.music.isOpen) {
        closeWindow("music");
      } else {
        const rect = event.currentTarget.getBoundingClientRect();
        openWindow("music", {
          centerX: rect.left + rect.width / 2,
          bottom: rect.bottom
        });
      }
    } else if (id === 3) { // Contact icon
      openWindow("contact");
    } else if (id === 2) { // Search icon
      openWindow("finder");
    }
  }

  return (
    <nav className="max-sm:hidden">
      <div>
        <img
          src="/images/logo.svg"
          className="p-1 dark:invert rounded cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          alt="logo"
          onClick={() => {
            if (windows.about.isOpen) {
              closeWindow("about");
            } else {
              openWindow("about");
            }
          }}
        />
        <p className="font-bold"> Sanaan's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => openWindow(type)}>
              <p>{name}</p>

            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id} onClick={(e) => handleIconClick(id, img, e)}>
              <img src={img} className="icon" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>
        <time>{currentTime.format("ddd MMM D h:mm A")}</time>
      </div>
    </nav>
  )
}
export default Navbar;
