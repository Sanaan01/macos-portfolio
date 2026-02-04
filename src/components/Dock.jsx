import { useRef, useState, useEffect, useCallback } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";
import { dockApps } from "#constants/index.js";
import { useGSAP } from "@gsap/react";
import useWindowStore from "#store/window.js";

const Dock = () => {
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const dockRef = useRef(null);
  const iconPositionsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  // --- ICON SIZE CONFIGURATION ---
  const DESKTOP_ICON_SIZE = "size-14 3xl:size-20";
  const MOBILE_ICON_SIZE = "max-sm:!size-22";

  // Animation intensity constant (extracted magic number)
  const DOCK_ANIMATION_FALLOFF = 20000;

  // Cache icon positions to avoid layout thrashing on every mousemove
  const cacheIconPositions = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const icons = dock.querySelectorAll(".dock-icon");
    const dockRect = dock.getBoundingClientRect();

    iconPositionsRef.current = Array.from(icons).map(icon => {
      const rect = icon.getBoundingClientRect();
      return {
        element: icon,
        center: rect.left - dockRect.left + rect.width / 2
      };
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      cacheIconPositions();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cacheIconPositions]);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return;

    // Initial cache after GSAP is ready
    cacheIconPositions();

    const animateIcons = (mouseX) => {
      iconPositionsRef.current.forEach(({ element, center }) => {
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5 / DOCK_ANIMATION_FALLOFF));
        gsap.to(element, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      animateIcons(e.clientX - left);
    };

    const handleTouchMove = (e) => {
      const { left } = dock.getBoundingClientRect();
      const touch = e.touches[0];
      animateIcons(touch.clientX - left);
    };

    const resetIcons = () =>
      iconPositionsRef.current.forEach(({ element }) =>
        gsap.to(element, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        }),
      );

    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', resetIcons);
    dock.addEventListener('touchmove', handleTouchMove, { passive: true });
    dock.addEventListener('touchend', resetIcons);

    return () => {
      dock.removeEventListener('mousemove', handleMouseMove);
      dock.removeEventListener('mouseleave', resetIcons);
      dock.removeEventListener('touchmove', handleTouchMove);
      dock.removeEventListener('touchend', resetIcons);
    };
  }, [isMobile, cacheIconPositions]);

  const toggleApp = (app) => {
    if (!app.canOpen) return
    const { windows } = useWindowStore.getState();
    const window = windows[app.id];

    if (window.isOpen) {
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
          .map(({ id, name, icon, canOpen }) => (
            <div key={id} className="relative flex justify-center">
              <button
                type="button"
                className={`dock-icon ${DESKTOP_ICON_SIZE} ${MOBILE_ICON_SIZE}`}
                aria-label={name}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={name}
                data-tooltip-delay-show={150}
                disabled={!canOpen}
                onClick={() => toggleApp({ id, canOpen })}
              >
                <img
                  src={`/images/${icon}`}
                  alt={name}
                  className={canOpen ? "" : "opacity-60"}
                />
              </button>
            </div>
          ))}
        <Tooltip id="dock-tooltip" place="top" className="tooltip max-sm:hidden" />
      </div>
    </section>
  );
}
export default Dock
