import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { useEffect } from "react"

import { Dock, Home, Navbar, MobileNavbar, Welcome, NotFound } from "#components"
import { Contact, Finder, Gallery, Image, Resume, Safari, Terminal, Text, ControlCenter, MusicPlayer, MobileMusic, AboutOverview, MobileAboutWindow } from "#windows"
import useThemeStore from "#store/theme.js"


gsap.registerPlugin(Draggable);
const App = () => {
  const isNotFound = window.location.pathname !== "/";
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  return (
    <main>
      <Navbar />
      <MobileNavbar />

      {isNotFound ? (
        <NotFound />
      ) : (
        <>
          <Welcome />
          <Dock />

          <Terminal />
          <Safari />
          <Resume />
          <Finder />
          <Text />
          <Image />
          <Contact />
          <Home />
          <Gallery />
          <MusicPlayer />
          <MobileMusic />
          <AboutOverview />
          <MobileAboutWindow />
        </>
      )}
      <ControlCenter />
    </main>
  )
}
export default App
