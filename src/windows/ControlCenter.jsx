import useWindowStore from "#store/window.js";
import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sun, Moon, Laptop } from "lucide-react";

const ControlCenter = () => {
  const { windows, closeWindow } = useWindowStore();
  const { isOpen, zIndex, data } = windows.controlcenter;
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const containerRef = useRef(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isOpen) {
      el.style.display = "block";
      gsap.fromTo(
        el,
        { scale: 0.95, opacity: 0, y: -10 },
        { scale: 1, opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }
      );
    } else {
      if (isFirstMount.current) {
        el.style.display = "none";
      } else {
        gsap.to(el, {
          scale: 0.95,
          opacity: 0,
          y: -10,
          duration: 0.15,
          ease: "power3.in",
          onComplete: () => {
            el.style.display = "none";
          },
        });
      }
    }
    isFirstMount.current = false;
  }, [isOpen]);

  const themes = [
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
    { id: "system", name: "System", icon: Laptop },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed w-[140px] bg-white/70 dark:bg-[#1e1e1e]/70 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden select-none border border-white/20 dark:border-white/10"
      style={{ 
        zIndex: 3100,
        top: data?.bottom ? `${data.bottom + 8}px` : "48px",
        left: data?.centerX ? `${data.centerX - 70}px` : undefined,
        right: data?.centerX ? "auto" : (data?.right ? `${data.right}px` : "16px"),
        display: "none"
      }}
    >
      <div className="p-2 space-y-0">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={clsx(
              "w-full flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 group",
              theme === t.id
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200"
            )}
          >
            <t.icon size={16} strokeWidth={2} />
            <span className="text-sm font-medium">{t.name}</span>
            {theme === t.id && (
              <span className="ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Invisible overlay to close when clicking outside if needed, 
          but usually Control Center stays until toggled or specifically closed.
          For now, just the window as requested. */}
    </div>
  );
};

export default ControlCenter;
