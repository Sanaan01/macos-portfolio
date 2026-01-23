import gsap from "gsap"
import { Draggable } from "gsap/Draggable"

import {Dock, Home, Navbar, MobileNavbar, Welcome} from "#components"
import {Contact, Finder, Gallery, Image, Resume, Safari, Terminal, Text, ControlCenter} from "#windows"


gsap.registerPlugin(Draggable);
const App = () => {
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
