import useWindowStore from "#store/window.js";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";
import { playlist } from "#constants";

const MusicPlayer = () => {
    const { windows } = useWindowStore();
    const { isOpen, data } = windows.music;
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const isFirstMount = useRef(true);
    const isSeeking = useRef(false);
    const wasPlayingBeforeSeek = useRef(false);

    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seekTime, setSeekTime] = useState(0);

    const currentTrack = playlist[currentTrackIndex];

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

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (!isSeeking.current) {
                setCurrentTime(audio.currentTime);
            }
        };
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            // Auto-advance to next track when current ends
            if (currentTrackIndex < playlist.length - 1) {
                setCurrentTrackIndex(prev => prev + 1);
                setCurrentTime(0);
                // Keep playing set to true, audio will auto-play from playTrack effect
            } else {
                // Last track ended, stop
                setIsPlaying(false);
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeekStart = () => {
        const audio = audioRef.current;
        if (!audio) return;
        isSeeking.current = true;
        wasPlayingBeforeSeek.current = isPlaying;
        if (isPlaying) {
            audio.pause();
        }
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        setSeekTime(newTime);
        setCurrentTime(newTime);
    };

    const handleSeekEnd = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = seekTime;
        isSeeking.current = false;
        if (wasPlayingBeforeSeek.current) {
            audio.play();
        }
    };

    // Play a specific track
    const playTrack = (index) => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTrackIndex(index);
        setCurrentTime(0);
        audio.load();
        audio.play();
        setIsPlaying(true);
    };

    // Skip back: if < 5 seconds and not first track, go to previous; otherwise restart
    const handleSkipBack = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentTime < 5 && currentTrackIndex > 0) {
            // Go to previous track
            playTrack(currentTrackIndex - 1);
        } else {
            // Restart current track
            audio.currentTime = 0;
            setCurrentTime(0);
        }
    };

    // Skip forward: go to next track or loop to first
    const handleSkipForward = () => {
        if (currentTrackIndex < playlist.length - 1) {
            playTrack(currentTrackIndex + 1);
        } else {
            // Loop back to first track
            playTrack(0);
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed w-[320px] bg-white/70 dark:bg-[#1e1e1e]/70 backdrop-blur-2xl rounded-2xl shadow-2xl select-none border border-white/20 dark:border-white/10 p-4 music-player"
            style={{
                zIndex: 3100,
                top: data?.bottom ? `${data.bottom + 8}px` : "48px",
                left: data?.centerX ? `${data.centerX - 308}px` : undefined,
                display: "none"
            }}
        >
            <audio ref={audioRef} src={currentTrack.src} />

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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{currentTrack.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{currentTrack.artist} — {currentTrack.album}</p>
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
            <div className="flex items-center justify-center gap-8">
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
            </div>
        </div>
    );
};

export default MusicPlayer;
