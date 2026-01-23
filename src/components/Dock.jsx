import {useRef, useState, useEffect} from "react";
import {Tooltip} from "react-tooltip";
import gsap from "gsap";
import {dockApps} from "#constants/index.js";
import {useGSAP} from "@gsap/react";
import useWindowStore from "#store/window.js";
const Dock = () => {
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const dockRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // --- ICON SIZE CONFIGURATION ---
  // Change these values to manually adjust the icon sizes
  const DESKTOP_ICON_SIZE = "size-14 3xl:size-20"; // Tailwind classes for desktop
  const MOBILE_ICON_SIZE = "max-sm:!size-22";     // Tailwind classes for mobile
  // -------------------------------

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    const dock = dockRef.current;
    if(!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");
    const animateIcons = (mouseX) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width} = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);

        const intensity = Math.exp(-(distance ** 2.5 / 20000));
        gsap.to( icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        })
      })
    }

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    }

    const handleTouchMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      const touch = e.touches[0];
      animateIcons(touch.clientX - left);
    }

    const resetIcons = () =>
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        }),
    )

    dock.addEventListener('mousemove', handleMouseMove)
    dock.addEventListener('mouseleave', resetIcons)
    dock.addEventListener('touchmove', handleTouchMove, { passive: true })
    dock.addEventListener('touchend', resetIcons)

    return () => {
      dock.removeEventListener('mousemove', handleMouseMove)
      dock.removeEventListener('mouseleave', resetIcons)
      dock.removeEventListener('touchmove', handleTouchMove)
      dock.removeEventListener('touchend', resetIcons)
    }
  }, [isMobile]);

  const toggleApp = (app) => {
    if (!app.canOpen) return
    const { windows } = useWindowStore.getState();
    const window = windows[app.id];

    if(window.isOpen) {
      closeWindow(app.id)
    } else {
      openWindow(app.id)
    }
  }

  const mobileAppIds = ["finder", "safari", "gallery", "contact"];

  return (
    <section id="dock" className="max-sm:!flex max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom))] max-sm:w-[95%] max-sm:max-w-[520px]">
    <div ref={dockRef} className="dock-container max-sm:w-full max-sm:justify-around max-sm:px-2 max-sm:py-2 max-sm:rounded-[24px] max-sm:bg-white/30">
      {dockApps
        .filter((app) => {
            if (isMobile) {
                return mobileAppIds.includes(app.id);
            }
            return true;
        })
        .map(({id, name, icon, canOpen}) => (
          <div key={id} className="relative flex justify-center">
            <button
              type="button"
              className={`dock-icon ${DESKTOP_ICON_SIZE} ${MOBILE_ICON_SIZE}`}
              aria-label={name}
              data-tooltip-id="dock-tooltip"
              data-tooltip-content={name}
              data-tooltip-delay-show={150}
              disabled={!canOpen}
              onClick={() => toggleApp({id, canOpen})}
            >
              <img
                src={`/images/${icon}`}
                alt={name}
                className={canOpen ? "" : "opacity-60"}
              />
            </button>
          </div>
          ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip max-sm:hidden"/>
      </div>
  </section>
  );
}
export default Dock
