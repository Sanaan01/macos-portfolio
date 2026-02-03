import { locations } from "#constants";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";
import { ClockWidget } from "./index.js";


const projects = locations.work?.children ?? [];

const mobileApps = [
  {
    id: "resume",
    name: "Resume",
    icon: "adobeacrobat.png",
  },
  {
    id: "terminal",
    name: "Skills",
    icon: "terminalmobile.png",
  },
  {
    id: "mobilemusic",
    name: "Music",
    icon: "applemusic.png",
  }
];

const Home = () => {
  const setActiveLocation = useLocationStore((state) => state.setActiveLocation);
  const openWindow = useWindowStore((state) => state.openWindow);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 150);
    };

    setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow("finder")
  };

  useGSAP(() => {
    if (!isMobile) {
      Draggable.create(".folder")
      Draggable.create(".widget", {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: "main",
      })
    }
  }, [isMobile])

  return (
    <section id="home">
      {/* Desktop Home Icons */}
      <div className="max-sm:hidden">
        <div className="widget absolute top-60 right-10 z-0">
          <ClockWidget />
        </div>

        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              className={clsx("group folder", project.windowPosition)}
              onClick={() => handleOpenProjectFinder(project)}
            >
              <img src="/images/folder.png" alt={project.name} />
              <p>{project.name}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile UI */}
      <div className="hidden max-sm:block w-full h-full relative">
        {/* --- MOBILE CLOCK POSITIONING --- */}
        <div className="absolute top-18 right-6 z-0 flex flex-col items-center gap-2">
          <ClockWidget scale={1.05} />
          <p className="text-white text-xs font-medium text-center drop-shadow-md">Clock</p>
        </div>

        <div className="absolute top-18 left-6 grid grid-cols-2 gap-y-2 gap-x-6 z-10 pointer-events-none w-fit">
          {mobileApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 transition-opacity pointer-events-auto"
              onClick={() => openWindow(app.id)}
            >
              <img src={`/images/${app.icon}`} alt={app.name} className="size-19 object-contain drop-shadow-lg" />
              <p className="text-white text-xs font-medium text-center drop-shadow-md">{app.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Home
