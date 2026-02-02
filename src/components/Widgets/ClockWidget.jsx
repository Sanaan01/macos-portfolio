import { useRef, useEffect, useMemo } from 'react';

const ClockWidget = ({ scale }) => {
    // --- ADJUST THIS VARIABLE TO SCALE THE DESKTOP CLOCK ---
    const DEFAULT_SCALE = 1;

    // Use the prop if passed (for mobile), otherwise use default
    const CLOCK_SCALE = scale || DEFAULT_SCALE;

    // Base dimensions (will be multiplied by CLOCK_SCALE)
    const d = {
        boxSize: 168 * CLOCK_SCALE,
        boxRadius: 25.6 * CLOCK_SCALE, // (1.6rem at 16px base)
        faceSize: 145 * CLOCK_SCALE,
        innerSize: 140 * CLOCK_SCALE,
        markingOrigin: 70 * CLOCK_SCALE,
        numberRadius: 50 * CLOCK_SCALE,
        numberSize: 17 * CLOCK_SCALE,
        pinSize: 9 * CLOCK_SCALE,
        innerPinSize: 3 * CLOCK_SCALE,
        // Hand Dimensions
        hands: (() => {
            const TAPER_CONFIG = {
                width: 5.5 * CLOCK_SCALE,
                thinWidth: 2.5 * CLOCK_SCALE,
                thinStop: 11 * CLOCK_SCALE,
                transitionLength: 3.5 * CLOCK_SCALE
            };
            return {
                hour: {
                    ...TAPER_CONFIG,
                    length: 42 * CLOCK_SCALE,
                    offset: -3 * CLOCK_SCALE,
                },
                minute: {
                    ...TAPER_CONFIG,
                    length: 71.5 * CLOCK_SCALE,
                    offset: -3 * CLOCK_SCALE,
                },
                second: {
                    width: 1.2 * CLOCK_SCALE,
                    length: 85 * CLOCK_SCALE,
                    offset: -12 * CLOCK_SCALE
                }
            };
        })()
    };

    // Helper to generate tapered clip-path
    const getTaperedClip = (config) => {
        const { width: w, length: l, thinWidth: tw, thinStop: ts, transitionLength: tl } = config;
        if (!tw) return 'none';

        // Horizontal percentages
        const x1 = ((w - tw) / 2 / w) * 100;
        const x2 = ((w + tw) / 2 / w) * 100;

        // Vertical percentages (100% is bottom, 0% is top)
        const yS = (1 - ts / l) * 100;           // Transition starts
        const yE = (1 - (ts + tl) / l) * 100;     // Transition ends (becomes full width)

        return `polygon(
            ${x1}% 100%, 
            ${x2}% 100%, 
            ${x2}% ${yS}%, 
            100% ${yE}%, 
            100% 0%, 
            0% 0%, 
            0% ${yE}%, 
            ${x1}% ${yS}%
        )`;
    };

    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const secondRef = useRef(null);

    useEffect(() => {
        let frameId;
        const update = () => {
            const now = new Date();
            const ms = now.getMilliseconds();
            const s = now.getSeconds();
            const m = now.getMinutes();
            const h = now.getHours();

            const secondDeg = (s + ms / 1000) * 6;
            const minuteDeg = (m + s / 60 + ms / 60000) * 6;
            const hourDeg = ((h % 12) + m / 60 + s / 3600) * 30;

            if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
            if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
            if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDeg}deg)`;

            frameId = requestAnimationFrame(update);
        };
        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Generate markings
    const markings = useMemo(() => {
        const result = [];
        for (let i = 0; i < 60; i++) {
            const isHour = i % 5 === 0;
            result.push(
                <div
                    key={i}
                    className="absolute left-1/2 top-0"
                    style={{
                        transform: `translateX(-50%) rotate(${i * 6}deg)`,
                        transformOrigin: `center ${d.markingOrigin}px`,
                        height: 5 * CLOCK_SCALE + 'px',
                        width: 1.5 * CLOCK_SCALE + 'px',
                        backgroundColor: isHour ? 'black' : 'rgba(0,0,0,0.25)',
                    }}
                />
            );
        }
        return result;
    }, [d.markingOrigin, CLOCK_SCALE]);

    const numbers = useMemo(() => [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], []);

    return (
        <div
            className="clock-widget group relative bg-white/50 dark:bg-black/40 backdrop-blur-2xl shadow-2xl select-none cursor-grab active:cursor-grabbing border border-white/40 dark:border-white/10 overflow-hidden flex items-center justify-center"
            style={{
                width: d.boxSize,
                height: d.boxSize,
                borderRadius: d.boxRadius
            }}
        >
            {/* Subtle Gradient Tint Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 to-transparent pointer-events-none" />

            {/* White Clock Face */}
            <div
                className="relative bg-white rounded-full shadow-inner overflow-hidden flex items-center justify-center"
                style={{ width: d.faceSize, height: d.faceSize }}
            >
                {/* Fixed-size Container for Clock Elements */}
                <div
                    className="relative flex items-center justify-center"
                    style={{ width: d.innerSize, height: d.innerSize }}
                >
                    {/* Markings */}
                    <div className="absolute inset-0">
                        {markings}
                    </div>

                    {/* Numbers */}
                    {numbers.map((num, i) => {
                        const angle = (i * 30) * (Math.PI / 180);
                        const x = Math.sin(angle) * d.numberRadius;
                        const y = -Math.cos(angle) * d.numberRadius;
                        return (
                            <span
                                key={num}
                                className="absolute text-black font-semibold tracking-tight"
                                style={{
                                    transform: `translate(${x}px, ${y}px)`,
                                    fontSize: d.numberSize + 'px',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
                                }}
                            >
                                {num}
                            </span>
                        );
                    })}

                    {/* Hands Container */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* Hour Hand */}
                        <div ref={hourRef} className="absolute size-0 z-10">
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
                                style={{
                                    bottom: d.hands.hour.offset,
                                    width: d.hands.hour.width,
                                    height: d.hands.hour.length,
                                    clipPath: getTaperedClip(d.hands.hour)
                                }}
                            />
                        </div>

                        {/* Minute Hand */}
                        <div ref={minuteRef} className="absolute size-0 z-20">
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
                                style={{
                                    bottom: d.hands.minute.offset,
                                    width: d.hands.minute.width,
                                    height: d.hands.minute.length,
                                    clipPath: getTaperedClip(d.hands.minute)
                                }}
                            />
                        </div>

                        {/* Second Hand */}
                        <div ref={secondRef} className="absolute size-0 z-30">
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-[#FF9500] rounded-full"
                                style={{ bottom: d.hands.second.offset, width: d.hands.second.width, height: d.hands.second.length }}
                            />
                        </div>

                        {/* Center Pin */}
                        <div
                            className="relative bg-[#FF9500] rounded-full z-40 border-black shadow-sm flex items-center justify-center"
                            style={{
                                width: d.pinSize,
                                height: d.pinSize,
                                borderWidth: 1.9 * CLOCK_SCALE + 'px'
                            }}
                        >
                            <div
                                className="bg-white rounded-full"
                                style={{
                                    width: d.innerPinSize + 'px',
                                    height: d.innerPinSize + 'px'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClockWidget;
