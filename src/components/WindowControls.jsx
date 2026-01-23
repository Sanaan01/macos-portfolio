import useWindowStore from "#store/window.js";
import { ChevronLeft } from "lucide-react";

const WindowControls = ({ target }) => {
    const { closeWindow, toggleFullscreen } = useWindowStore();
    return (
        <>
            {/* Desktop Controls */}
            <div id="window-controls" className="max-sm:hidden">
                <div className="close" onClick={() => closeWindow(target)} />
                <div className="minimize" onClick={() => closeWindow(target)} />
                <div className="maximize" onClick={() => toggleFullscreen(target)} />
            </div>

            {/* Mobile Back Button */}
            <button
                onClick={() => closeWindow(target)}
                className="hidden max-sm:flex items-center gap-1 text-blue-500 font-medium focus:outline-none"
            >
                <ChevronLeft size={24} />
                <span>Back</span>
            </button>
        </>
    );
};
export default WindowControls;
