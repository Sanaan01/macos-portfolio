import useWindowStore from "#store/window.js";
import useAudioStore from "#store/audio.js";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SkipBack, Play, Pause, SkipForward, Shuffle, Repeat, Repeat1 } from "lucide-react";
import MarqueeText from "#components/MarqueeText.jsx";

const MusicPlayer = () => {
    const { windows } = useWindowStore();
    const { isOpen, data } = windows.music;
    const containerRef = useRef(null);
    const isFirstMount = useRef(true);
    const localSeekTime = useRef(0);

    // Get state and actions from shared audio store
    const {
        playlist,
        currentTrackIndex,
        isPlaying,
        currentTime,
        duration,
        shuffleEnabled,
        repeatMode,
        getCurrentTrack,
        setPlaylist,
        togglePlay,
        startSeek,
        endSeek,
        seek,
        loadTrack,
        toggleShuffle,
        cycleRepeatMode,
    } = useAudioStore();

    const currentTrack = getCurrentTrack();

    // Fetch playlist on mount
    useEffect(() => {
        if (playlist.length === 0) {
            fetch('/playlist.json')
                .then(res => res.json())
                .then(data => {
                    setPlaylist(data); // loadTrack is now called internally
                })
                .catch(err => console.error('Failed to load playlist:', err));
        }
    }, [playlist.length, setPlaylist]);

    useGSAP(() => {
        const el = containerRef.current;
        if (!el) return;

        if (isOpen) {
            el.style.display = "block";
            gsap.fromTo(
                el,
                { scale: 0.95, opacity: 0, y: -10 },
                { scale: 1, opacity: 1, y: 0, duration: 0.2, ease: "power3.out" }
            );
        } else {
            if (isFirstMount.current) {
                el.style.display = "none";
            } else {
                gsap.to(el, {
                    scale: 0.95,
                    opacity: 0,
                    y: -10,
                    duration: 0.15,
                    ease: "power3.in",
                    onComplete: () => {
                        el.style.display = "none";
                    },
                });
            }
        }
        isFirstMount.current = false;
    }, [isOpen]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeekStart = () => {
        startSeek();
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        localSeekTime.current = newTime;
        // Update visual immediately
        useAudioStore.setState({ currentTime: newTime });
    };

    const handleSeekEnd = () => {
        endSeek(localSeekTime.current);
    };

    // Skip back: if < 5 seconds and not first track, go to previous; otherwise restart
    const handleSkipBack = () => {
        if (currentTime < 5 && currentTrackIndex > 0) {
            useAudioStore.getState().prevTrack();
        } else {
            seek(0);
        }
    };

    // Skip forward: go to next track or loop to first
    const handleSkipForward = () => {
        if (currentTrackIndex < playlist.length - 1) {
            useAudioStore.getState().nextTrack();
        } else {
            useAudioStore.getState().setTrack(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed w-[320px] rounded-2xl shadow-2xl select-none border border-white/20 dark:border-white/10 p-4 music-player overflow-hidden"
            style={{
                zIndex: 3100,
                top: data?.bottom ? `${data.bottom + 8}px` : "48px",
                left: data?.centerX ? `${data.centerX - 308}px` : undefined,
                display: "none"
            }}
        >
            {/* Blurred Album Art Background */}
            <div
                className="absolute inset-0 -z-20"
                style={{
                    backgroundImage: currentTrack.cover ? `url(${currentTrack.cover})` : 'none',
                    backgroundSize: '200% 200%',
                    backgroundPosition: 'center',
                    filter: 'blur(40px) saturate(1.5)',
                    opacity: 0.6,
                    transform: 'scale(1.5)',
                    transition: 'background-image 0.5s ease-in-out',
                }}
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 -z-10 bg-white/60 dark:bg-[#1e1e1e]/60 backdrop-blur-xl" />

            {/* Track Info */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-lg">
                    <img
                        src={currentTrack.cover}
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <MarqueeText
                        text={currentTrack.title}
                        className="text-lg font-bold text-gray-900 dark:text-white"
                        speed={25}
                    />
                    <MarqueeText
                        text={`${currentTrack.artist} — ${currentTrack.album}`}
                        className="text-sm text-gray-500 dark:text-gray-400"
                        speed={20}
                    />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleProgressChange}
                    onMouseDown={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchStart={handleSeekStart}
                    onTouchEnd={handleSeekEnd}
                    className="music-slider"
                    style={{
                        "--track-bg": `linear-gradient(to right, var(--played) ${duration ? (currentTime / duration) * 100 : 0
                            }%, var(--remaining) ${duration ? (currentTime / duration) * 100 : 0}%)`,
                    }}
                />
                <div className="flex justify-between text-[11px] font-medium text-gray-500 dark:text-white/40 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
                <button
                    onClick={toggleShuffle}
                    className={`transition-all duration-150 hover:scale-110 active:scale-95 ${shuffleEnabled
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-800/40 dark:text-white/40'
                        }`}
                    title="Shuffle"
                >
                    <Shuffle size={18} />
                </button>
                <button
                    onClick={handleSkipBack}
                    className="text-gray-800 dark:text-white hover:opacity-70 hover:scale-110 active:scale-95 transition-all duration-150"
                >
                    <SkipBack size={24} fill="currentColor" />
                </button>
                <button
                    onClick={togglePlay}
                    className="text-gray-800 dark:text-white hover:opacity-70 hover:scale-110 active:scale-95 transition-all duration-150"
                >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                </button>
                <button
                    onClick={handleSkipForward}
                    className="text-gray-800 dark:text-white hover:opacity-70 hover:scale-110 active:scale-95 transition-all duration-150"
                >
                    <SkipForward size={24} fill="currentColor" />
                </button>
                <button
                    onClick={cycleRepeatMode}
                    className={`transition-all duration-150 hover:scale-110 active:scale-95 ${repeatMode !== 'off'
                        ? 'text-gray-800 dark:text-white'
                        : 'text-gray-800/40 dark:text-white/40'
                        }`}
                    title={repeatMode === 'one' ? 'Repeat One' : repeatMode === 'all' ? 'Repeat All' : 'Repeat Off'}
                >
                    {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                </button>
            </div>
        </div>
    );
};

export default MusicPlayer;
