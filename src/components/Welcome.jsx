import {useRef, useState} from "react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
const FONT_WEIGHTS = {
  subtitle: { min:100, max:400, default: 100 },
  title: { min:400, max:900, default: 400 },
};
const renderText = (text, className, baseWeight = 400) =>
{
  return [...text].map((char, i) => (
    <span key={i}
          className={`${className} welcome-letter`}
          style={{fontVariationSettings: `'wght' ${baseWeight}`}}
          aria-hidden="true"
    >
            {char === " " ? "\u00A0" : char}
    </span>
  ));
}
const setupTextHover = (container, type) => {
  if (!container) return;

  const letters = container.querySelectorAll("span");
  const { min, max, default: base } = FONT_WEIGHTS[type];

  gsap.set(letters, {
    fontVariationSettings: `"wght" ${base}`,
  });

  const animateLetter =(letter, weight, duration = 0.25) => {
    return gsap.to(letter,
      {duration,
        ease: "power2.out", fontVariationSettings: `'wght' ${weight}`,
      });
  };
  const handleMouseMove = (e) => {
    const { left } = container.getBoundingClientRect();
    const mouseX = e.clientX - left;

    letters.forEach((letter) => {
      const { left: l, width: w } = letter.getBoundingClientRect();
      const distance = Math.abs(mouseX - (l - left + w / 2));
      const intensity = Math.exp(-(distance ** 2 / 20000));

      animateLetter(letter, min+(max-min) * intensity);

    })
  }
  const handleMouseLeave = () => letters.forEach((letter) => animateLetter(letter, base, 0.3));
  container.addEventListener("mousemove", handleMouseMove);
  container.addEventListener("mouseleave", handleMouseLeave);
  return () => {
    container.removeEventListener("mousemove", handleMouseMove);
    container.removeEventListener("mouseleave", handleMouseLeave);
  }
};
const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.3 },
      delay: 0.5,
      onComplete: () => setAnimationFinished(true)
    });

    if (subtitleRef.current && titleRef.current) {
      const subtitleSpans = subtitleRef.current.querySelectorAll("span");
      const titleSpans = titleRef.current.querySelectorAll("span");

      tl.to(subtitleSpans, {
        fontVariationSettings: `'wght' ${FONT_WEIGHTS.subtitle.max}`,
        stagger: 0.02,
      })
      .to(subtitleSpans, {
        fontVariationSettings: `'wght' ${FONT_WEIGHTS.subtitle.default}`,
        stagger: 0.02,
      }, "<0.3")
      .to(titleSpans, {
        fontVariationSettings: `'wght' ${FONT_WEIGHTS.title.max}`,
        stagger: 0.03,
      }, "-=0.55")
      .to(titleSpans, {
        fontVariationSettings: `'wght' ${FONT_WEIGHTS.title.default}`,
        stagger: 0.03,
      }, "<0.3");
    }
  }, []);

  useGSAP(() => {
    if (!animationFinished) return;

    const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");
    const titleCleanup = setupTextHover(titleRef.current, "title");

    return () => {
      subtitleCleanup?.();
      titleCleanup?.();
    }
  }, [animationFinished]);
  return (
    <section id="welcome">
    <p ref={subtitleRef} aria-label="Hey! I am Sanaan, Welcome to my">
      {renderText(
        "Hey! I am Sanaan, Welcome to my",
        "text-xl sm:text-3xl font-georama",
        100
      )}
    </p>
    <h1 ref={titleRef} className="mt-4 sm:mt-7" aria-label="portfolio.">
      {renderText("portfolio.", 'text-7xl sm:text-9xl italic font-georama')}
    </h1>

  </section>
  );
};
export default Welcome
