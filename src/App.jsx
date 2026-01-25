import gsap from "gsap"
import { Draggable } from "gsap/Draggable"

import {Dock, Home, Navbar, MobileNavbar, Welcome, NotFound} from "#components"
import {Contact, Finder, Gallery, Image, Resume, Safari, Terminal, Text, ControlCenter} from "#windows"


gsap.registerPlugin(Draggable);
const App = () => {
  const isNotFound = window.location.pathname !== "/";

  if (isNotFound) {
    return (
      <main>
        <NotFound />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <MobileNavbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume/>
      <Finder/>
      <Text/>
      <Image/>
      <Contact/>
      <Home/>
      <Gallery/>
      <ControlCenter/>
    </main>
  )
}
export default App
