import { useState, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/index.js";
import { gallery as staticGallery } from "#constants/index.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Build-time constants (injected by Vite)
const GIT_COMMIT = typeof __GIT_COMMIT__ !== 'undefined' ? __GIT_COMMIT__ : 'dev';
const GIT_BRANCH = typeof __GIT_BRANCH__ !== 'undefined' ? __GIT_BRANCH__ : 'unknown';
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0';
const BUILD_TIME = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();

// Custom hook for shared About data and effects
const useAboutData = () => {
    const [loadedAssets, setLoadedAssets] = useState("—");
    const [galleryCount, setGalleryCount] = useState(staticGallery.length);
    const [deviceInfo, setDeviceInfo] = useState({ platform: "—", browser: "—" });
    const [viewport, setViewport] = useState({ width: 0, height: 0, dpr: 1 });
    const [uptime, setUptime] = useState("—");

    // Calculate loaded assets size
    useEffect(() => {
        const calculateAssets = () => {
            try {
                const resources = performance.getEntriesByType("resource");
                let totalSize = 0;
                for (const resource of resources) {
                    const size = resource.transferSize || resource.encodedBodySize || 0;
                    totalSize += size;
                }
                const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
                setLoadedAssets(`${sizeMB} MB`);
            } catch {
                setLoadedAssets("—");
            }
        };
        const timer = setTimeout(calculateAssets, 500);
        return () => clearTimeout(timer);
    }, []);

    // Fetch gallery count from API
    useEffect(() => {
        const fetchGalleryCount = async () => {
            try {
                const res = await fetch('/api/gallery.json');
                if (res.ok) {
                    const data = await res.json();
                    const r2Count = data.images?.length || 0;
                    setGalleryCount(r2Count + staticGallery.length);
                }
            } catch { }
        };
        fetchGalleryCount();
    }, []);

    // Get device/browser info
    useEffect(() => {
        const getDeviceInfo = () => {
            let platform = "Unknown";
            let browser = "Unknown";

            if (navigator.userAgentData) {
                platform = navigator.userAgentData.platform || "Unknown";
                const brands = navigator.userAgentData.brands || [];
                const mainBrand = brands.find(b =>
                    !b.brand.includes("Not") && !b.brand.includes("Chromium")
                ) || brands[0];
                browser = mainBrand?.brand || "Chrome";
            } else {
                const ua = navigator.userAgent;
                if (ua.includes("Win")) platform = "Windows";
                else if (ua.includes("Mac")) platform = "macOS";
                else if (ua.includes("Linux")) platform = "Linux";
                else if (ua.includes("Android")) platform = "Android";
                else if (ua.includes("iPhone") || ua.includes("iPad")) platform = "iOS";

                if (ua.includes("Firefox")) browser = "Firefox";
                else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
                else if (ua.includes("Edge")) browser = "Edge";
                else if (ua.includes("Chrome")) browser = "Chrome";
            }

            setDeviceInfo({ platform, browser });
        };
        getDeviceInfo();
    }, []);

    // Get viewport info
    useEffect(() => {
        const updateViewport = () => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
                dpr: window.devicePixelRatio || 1,
            });
        };
        updateViewport();
        window.addEventListener("resize", updateViewport);
        return () => window.removeEventListener("resize", updateViewport);
    }, []);

    // Calculate uptime (time since deployment/build)
    useEffect(() => {
        const updateUptime = () => {
            const now = dayjs();
            const deployed = dayjs(BUILD_TIME);
            const diffMs = now.diff(deployed);

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            let uptimeStr = '';
            if (days > 0) uptimeStr += `${days}d `;
            if (hours > 0 || days > 0) uptimeStr += `${hours}h `;
            uptimeStr += `${minutes}m`;

            setUptime(uptimeStr.trim());
        };
        updateUptime();
        const interval = setInterval(updateUptime, 60000);
        return () => clearInterval(interval);
    }, []);

    return { loadedAssets, galleryCount, deviceInfo, viewport, uptime };
};

const AboutOverview = () => {
    const { loadedAssets, galleryCount, deviceInfo, viewport, uptime } = useAboutData();

    return (
        <>
            <div id="window-header">
                <WindowControls target="about" disableMaximize />
                <h2>About</h2>
                <div className="w-16" />
            </div>

            <div className="about-content">
                {/* Left: Profile Image */}
                <div className="about-image">
                    <img
                        src="/images/sanaanfull.JPG"
                        alt="Profile"
                        className="about-profile-img"
                    />
                </div>

                {/* Right: Info Panel */}
                <div className="about-info">
                    <h1 className="about-title">Sanaan's Portfolio</h1>
                    <p className="about-version">Version {APP_VERSION}</p>

                    <div className="about-details">
                        <div className="about-row">
                            <span className="about-label">Deployed</span>
                            <span className="about-value">{uptime}</span>
                        </div>
                        <div className="about-row">
                            <span className="about-label">Commit</span>
                            <span className="about-value">{GIT_COMMIT} ({GIT_BRANCH})</span>
                        </div>
                        <div className="about-row">
                            <span className="about-label">Built</span>
                            <span className="about-value">{dayjs(BUILD_TIME).format("MMM D, YYYY")}</span>
                        </div>
                        <div className="about-row">
                            <span className="about-label">Loaded Assets</span>
                            <span className="about-value">{loadedAssets}</span>
                        </div>
                        <div className="about-row">
                            <span className="about-label">Platform</span>
                            <span className="about-value">{deviceInfo.platform} • {deviceInfo.browser}</span>
                        </div>
                        <div className="about-row">
                            <span className="about-label">Viewport</span>
                            <span className="about-value">{viewport.width}×{viewport.height} @ {viewport.dpr}x</span>
                        </div>
                        <div className="about-row">
                            <span className="about-label">Gallery</span>
                            <span className="about-value">{galleryCount} photos</span>
                        </div>
                    </div>

                    <p className="about-copyright">
                        © 2026 sanaan.dev — All rights reserved
                    </p>
                </div>
            </div>
        </>
    );
};

// Mobile About component - iOS Settings style
const MobileAbout = () => {
    const { loadedAssets, galleryCount, deviceInfo, viewport, uptime } = useAboutData();

    return (
        <>
            <div id="window-header">
                <WindowControls target="mobileabout" />
                <h2>About</h2>
                <div className="w-16" />
            </div>

            <div className="mobile-about-content">
                {/* Section 1: Site Info */}
                <div className="mobile-about-section">
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Name</span>
                        <span className="mobile-about-value">Sanaan's Portfolio</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Version</span>
                        <span className="mobile-about-value">{APP_VERSION}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Platform</span>
                        <span className="mobile-about-value">{deviceInfo.platform}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Browser</span>
                        <span className="mobile-about-value">{deviceInfo.browser}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Commit</span>
                        <span className="mobile-about-value">{GIT_COMMIT}</span>
                    </div>
                </div>

                {/* Section 2: Build Info */}
                <div className="mobile-about-section">
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Built</span>
                        <span className="mobile-about-value">{dayjs(BUILD_TIME).format("MMM D, YYYY")}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Uptime</span>
                        <span className="mobile-about-value">{uptime}</span>
                    </div>
                </div>

                {/* Section 3: Stats */}
                <div className="mobile-about-section">
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Photos</span>
                        <span className="mobile-about-value">{galleryCount}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Loaded Assets</span>
                        <span className="mobile-about-value">{loadedAssets}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">Viewport</span>
                        <span className="mobile-about-value">{viewport.width}×{viewport.height}</span>
                    </div>
                    <div className="mobile-about-row">
                        <span className="mobile-about-label">DPR</span>
                        <span className="mobile-about-value">{viewport.dpr}x</span>
                    </div>
                </div>

                {/* Copyright */}
                <p className="mobile-about-copyright">
                    © 2026 sanaan.dev — All rights reserved
                </p>
            </div>
        </>
    );
};

const AboutOverviewWindow = WindowWrapper(AboutOverview, "about");
const MobileAboutWindow = WindowWrapper(MobileAbout, "mobileabout");

export default AboutOverviewWindow;
export { MobileAboutWindow };

