import useWindowStore from "#store/window.js";
import {useLayoutEffect, useRef} from "react";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";
import {Draggable} from "gsap/Draggable";
const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore()
    const { isOpen, zIndex, isFullscreen} = windows[windowKey]
    const ref = useRef(null);
    const isFirstMount = useRef(true);
    const posBeforeFullscreen = useRef({ x: 0, y: 0, width: 0, height: 0 });

    useGSAP(() => {
      const el = ref.current;
      if(!el) return;

      if (isOpen) {
        el.style.display = "block"
        if (!isFullscreen) {
          gsap.fromTo(el, { scale:0.8, opacity: 0, y:40}, {scale: 1, opacity: 1, y: 0, duration: 0.2, ease: "power3.out" })
        }
      } else {
        if (isFirstMount.current) {
          el.style.display = "none";
        } else if (el.style.display !== "none") {
          gsap.to(el, {
            scale: 0.8,
            opacity: 0,
            y: 40,
            duration: 0.2,
            ease: "power3.in",
            onComplete: () => {
              el.style.display = "none"
              // Clear window data from store after animation
              useWindowStore.setState((state) => {
                state.windows[windowKey].data = null;
              })
            }
          })
        }
      }
      isFirstMount.current = false;
    }, [isOpen]);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      if (isFullscreen) {
        // Store current position and size
        posBeforeFullscreen.current = {
          top: el.offsetTop,
          left: el.offsetLeft,
          width: el.offsetWidth,
          height: el.offsetHeight,
          transform: gsap.getProperty(el, "transform")
        };

        gsap.to(el, {
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          maxWidth: "none",
          maxHeight: "none",
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power3.inOut",
          clearProps: "transform"
        });
      } else if (posBeforeFullscreen.current.width !== 0) {
        // Revert to original position and size
        const { top, left, width, height, transform } = posBeforeFullscreen.current;
        gsap.to(el, {
          top: top,
          left: left,
          width: width,
          height: height,
          transform: transform,
          duration: 0.3,
          ease: "power3.inOut",
          clearProps: "top,left,width,height,transform,maxWidth,maxHeight,x,y"
        });
      }
    }, [isFullscreen]);

    useGSAP(() => {
      const el = ref.current;
      if(!el) return;

      const [instance] = Draggable.create(el, { 
        onPress: () => focusWindow(windowKey),
        activeCursor: "grabbing",
      })

      if (isFullscreen) {
        instance.disable();
      } else {
        instance.enable();
      }

      return () => instance.kill()
    }, [isFullscreen])



    return <section
      id={windowKey}
      ref={ref}
      style={{ zIndex }}
      className="absolute">
      <Component {...props} />
    </section>
  }

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`

  return Wrapped
}
export default WindowWrapper
