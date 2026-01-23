import { locations } from "#constants";
import { useEffect, useState } from "react";
import clsx from "clsx";
import {useGSAP} from "@gsap/react";
import {Draggable} from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";


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
  }
];

const Home = () => {
  const setActiveLocation = useLocationStore((state) => state.setActiveLocation);
  const openWindow = useWindowStore((state) => state.openWindow);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow("finder")
  };

  useGSAP(() => {
    if (!isMobile) {
      Draggable.create(".folder")
    }
  }, [isMobile])

  return (
    <section id="home">
      {/* Desktop Home Icons */}
      <ul className="max-sm:hidden">
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

      {/* Mobile Home Icons */}
      <div className="hidden max-sm:grid grid-cols-4 mt-14 gap-6 p-6 justify-items-center items-start">
        {mobileApps.map((app) => (
          <div
            key={app.id}
            className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 transition-opacity"
            onClick={() => openWindow(app.id)}
          >
            <img src={`/images/${app.icon}`} alt={app.name} className="size-22 object-contain drop-shadow-lg" />
            <p className="text-white text-xs font-medium text-center drop-shadow-md">{app.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Home
