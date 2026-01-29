import { useEffect, useState } from "react";

const StartupScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const exitDelay = prefersReducedMotion ? 600 : 2600;
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, exitDelay);
    const completeTimer = window.setTimeout(() => {
      onComplete?.();
    }, exitDelay + 600);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`startup-screen${isExiting ? " startup-screen--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Starting up"
    >
      <img
        src="/images/logo.svg"
        alt="Apple logo"
        className="startup-logo"
      />
      <div className="startup-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
};

export default StartupScreen;
