import useWindowStore from "#store/window.js";
import { ChevronLeft } from "lucide-react";

const BACK_BUTTON_CLASS = "hidden max-sm:flex items-center gap-1 text-blue-500 font-medium focus:outline-none";

const WindowControls = ({ target, disableMaximize = false }) => {
    const { closeWindow, toggleFullscreen } = useWindowStore();

    const handleClose = () => {
        if (target === "notfound") {
            window.location.href = "/";
        } else {
            closeWindow(target);
        }
    };

    return (
        <>
            {/* Desktop Controls */}
            <div id="window-controls" className="max-sm:hidden">
                <div className="close" onClick={handleClose} />
                <div className="minimize" onClick={handleClose} />
                <div
                    className={`maximize ${disableMaximize ? 'disabled' : ''}`}
                    onClick={disableMaximize ? undefined : () => toggleFullscreen(target)}
                    style={disableMaximize ? { backgroundColor: '#ccc', cursor: 'default' } : undefined}
                />
            </div>

            {/* Mobile Back Button */}
            {target === "notfound" ? (
                <a
                    href="/"
                    className={BACK_BUTTON_CLASS}
                >
                    <ChevronLeft size={24} />
                    <span>Back</span>
                </a>
            ) : (
                <button
                    onClick={handleClose}
                    className={BACK_BUTTON_CLASS}
                >
                    <ChevronLeft size={24} />
                    <span>Back</span>
                </button>
            )}
        </>
    );
};
export default WindowControls;
