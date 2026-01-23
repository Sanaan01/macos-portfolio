import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import useWindowStore from "#store/window.js";

const MobileNavbar = () => {
    const { openWindow, closeWindow, windows } = useWindowStore();
    const [currentTime, setCurrentTime] = useState(dayjs());
    const hasOpenWindow = useMemo(
        () => Object.entries(windows).some(([key, window]) => key !== "controlcenter" && window.isOpen),
        [windows],
    );
    const iconClassName = hasOpenWindow
        ? "w-5 h-5 dark:invert"
        : "w-5 h-5 invert dark:invert";
    const timeClassName = hasOpenWindow
        ? "text-black dark:text-white font-semibold text-base"
        : "text-white dark:text-white font-semibold text-base";

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleControlCenterClick = (event) => {
        if (windows.controlcenter.isOpen) {
            closeWindow("controlcenter");
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            openWindow("controlcenter", {
                centerX: rect.left + rect.width / 2,
                bottom: rect.bottom
            });
        }
    }

    return (
        <nav className="sm:hidden fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-8 z-[3000] bg-transparent backdrop-blur-none pointer-events-none">
            {/* Left side: Time */}
            <div className="flex items-center pointer-events-auto">
                <time className={timeClassName}>
                    {currentTime.format("h:mm")}
                </time>
            </div>

            {/* Center: Notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-60 h-8 bg-black rounded-b-3xl pointer-events-auto"></div>

            {/* Right side: Icons */}
            <div className="flex items-center gap-3 pointer-events-auto">
                <img src="/icons/wifi.svg" className={iconClassName} alt="wifi" />
                <button onClick={handleControlCenterClick} className="focus:outline-none">
                    <img src="/icons/mode.svg" className={iconClassName} alt="control center" />
                </button>
            </div>
        </nav>
    );
};

export default MobileNavbar;
