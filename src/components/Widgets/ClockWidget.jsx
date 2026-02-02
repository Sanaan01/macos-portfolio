import { useState, useEffect } from 'react';

const ClockWidget = ({ scale }) => {
    // --- ADJUST THIS VARIABLE TO SCALE THE DESKTOP CLOCK ---
    const DEFAULT_SCALE = 0.9;

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
        // Hand Dimensions [width, length, offset]
        hands: {
            hour: [5.5 * CLOCK_SCALE, 34 * CLOCK_SCALE, -3 * CLOCK_SCALE],
            minute: [3.8 * CLOCK_SCALE, 54 * CLOCK_SCALE, -3 * CLOCK_SCALE],
            second: [1.2 * CLOCK_SCALE, 72 * CLOCK_SCALE, -15 * CLOCK_SCALE]
        }
    };

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        let frameId;
        const update = () => {
            setTime(new Date());
            frameId = requestAnimationFrame(update);
        };
        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, []);

    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    const secondDeg = (s + ms / 1000) * 6;
    const minuteDeg = (m + s / 60 + ms / 60000) * 6;
    const hourDeg = ((h % 12) + m / 60 + s / 3600) * 30;

    // Generate markings
    const markings = [];
    for (let i = 0; i < 60; i++) {
        const isHour = i % 5 === 0;
        markings.push(
            <div
                key={i}
                className="absolute left-1/2 top-0"
                style={{
                    transform: `translateX(-50%) rotate(${i * 6}deg)`,
                    transformOrigin: `center ${d.markingOrigin}px`,
                    height: (isHour ? 7 : 4) * CLOCK_SCALE + 'px',
                    width: (isHour ? 1.5 : 0.8) * CLOCK_SCALE + 'px',
                    backgroundColor: isHour ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.25)',
                }}
            />
        );
    }

    const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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
                        <div className="absolute size-0 z-10" style={{ transform: `rotate(${hourDeg}deg)` }}>
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
                                style={{ bottom: d.hands.hour[2], width: d.hands.hour[0], height: d.hands.hour[1] }}
                            />
                        </div>

                        {/* Minute Hand */}
                        <div className="absolute size-0 z-20" style={{ transform: `rotate(${minuteDeg}deg)` }}>
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
                                style={{ bottom: d.hands.minute[2], width: d.hands.minute[0], height: d.hands.minute[1] }}
                            />
                        </div>

                        {/* Second Hand */}
                        <div className="absolute size-0 z-30" style={{ transform: `rotate(${secondDeg}deg)` }}>
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bg-[#FF9500] rounded-full"
                                style={{ bottom: d.hands.second[2], width: d.hands.second[0], height: d.hands.second[1] }}
                            />
                        </div>

                        {/* Center Pin */}
                        <div
                            className="relative bg-[#FF9500] rounded-full z-40 border-white shadow-sm"
                            style={{
                                width: d.pinSize,
                                height: d.pinSize,
                                borderWidth: 2 * CLOCK_SCALE + 'px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClockWidget;
