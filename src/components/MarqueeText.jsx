import { useRef, useEffect, useState } from 'react';

const MarqueeText = ({ text, className = '', speed = 30, minLength = 20 }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [animationDuration, setAnimationDuration] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Skip if container isn't visible yet (display: none or zero width)
                if (containerWidth === 0) return;

                const textWidth = textRef.current.scrollWidth;
                const isOverflowing = textWidth > containerWidth;
                // Only animate if text is long enough AND overflows
                const animate = isOverflowing && text.length > minLength;
                setShouldAnimate(animate);

                if (animate) {
                    // Calculate duration based on text width and speed
                    const duration = textWidth / speed;
                    setAnimationDuration(duration);
                }
            }
        };

        // Reset animation state when text changes
        setShouldAnimate(false);

        // Use ResizeObserver to detect when container becomes visible
        // This handles the case where parent is initially display: none
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0) {
                    checkOverflow();
                }
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        // Also check on resize
        window.addEventListener('resize', checkOverflow);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, [text, speed, minLength]);

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden whitespace-nowrap ${className}`}
            style={{ maskImage: shouldAnimate ? 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' : 'none' }}
        >
            <span
                ref={textRef}
                className={shouldAnimate ? 'marquee-text' : ''}
                style={{
                    display: 'inline-block',
                    paddingRight: shouldAnimate ? '50px' : '0',
                    animation: shouldAnimate
                        ? `marquee ${animationDuration}s linear infinite`
                        : 'none',
                }}
            >
                {text}
                {shouldAnimate && <span className="pl-12">{text}</span>}
            </span>
        </div>
    );
};

export default MarqueeText;

