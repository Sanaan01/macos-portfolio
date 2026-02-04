import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/index.js";
import useWindowStore from "#store/window.js";
import useAudioStore from "#store/audio.js";
import { useRef, useEffect } from "react";
import { SkipBack, Play, Pause, SkipForward, Shuffle, Repeat, Repeat1 } from "lucide-react";

const MobileMusic = () => {
    const { closeWindow } = useWindowStore();
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
        nextTrack,
        prevTrack,
        startSeek,
        endSeek,
        seek,
        loadTrack,
        toggleShuffle,
        cycleRepeatMode,
    } = useAudioStore();

    const currentTrack = getCurrentTrack();

    // Fetch playlist on mount (if not already loaded)
    useEffect(() => {
        if (playlist.length === 0) {
            fetch('/playlist.json')
                .then(res => res.json())
                .then(data => {
                    setPlaylist(data);
                    setTimeout(() => loadTrack(false), 100);
                })
                .catch(err => console.error('Failed to load playlist:', err));
        }
    }, []);

    // Auto-close mobile music when resizing to desktop (no animation)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                // Close immediately without animation by setting display none directly
                const el = document.getElementById('mobilemusic');
                if (el) {
                    el.style.display = 'none';
                }
                closeWindow('mobilemusic');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [closeWindow]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleSeekStart = () => {
        startSeek();
    };

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        localSeekTime.current = newTime;
    };

    const handleSeekEnd = () => {
        endSeek(localSeekTime.current);
    };

    // Skip back: if < 5 seconds and not first track, go to previous; otherwise restart
    const handleSkipBack = () => {
        if (currentTime < 5 && currentTrackIndex > 0) {
            prevTrack();
        } else {
            seek(0);
        }
    };

    // Skip forward: go to next track or loop to first
    const handleSkipForward = () => {
        if (currentTrackIndex < playlist.length - 1) {
            nextTrack();
        } else {
            useAudioStore.getState().setTrack(0);
        }
    };

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <>
            {/* Blurred Album Art Background */}
            <div
                className="absolute inset-0 z-0 overflow-hidden"
                style={{
                    backgroundImage: currentTrack.cover ? `url(${currentTrack.cover})` : 'none',
                    backgroundSize: '250% 250%',
                    backgroundPosition: 'center',
                    filter: 'blur(60px) saturate(1.4)',
                    opacity: 0.5,
                    transform: 'scale(1.5)',
                    transition: 'background-image 0.5s ease-in-out',
                }}
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/50 to-black/70" />

            <div id="window-header" className="relative z-10">
                <WindowControls target="mobilemusic" />
                <h2>Now Playing</h2>
                <div className="w-16" />
            </div>

            <div className="mobile-music-content relative z-10">
                {/* Album Art */}
                <div className="album-art-container">
                    <img
                        src={currentTrack.cover}
                        alt="Album Art"
                        className="album-art"
                    />
                </div>

                {/* Track Info */}
                <div className="track-info">
                    <h3 className="track-title">{currentTrack.title}</h3>
                    <p className="track-artist">{currentTrack.artist}</p>
                </div>
            </div>

            {/* Progress Bar - Fixed at bottom */}
            <div className="progress-container z-10">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={handleProgressChange}
                    onMouseDown={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchStart={handleSeekStart}
                    onTouchEnd={handleSeekEnd}
                    className="mobile-music-slider"
                    style={{
                        "--progress": `${progressPercent}%`,
                    }}
                />
                <div className="time-display">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(duration - currentTime)}</span>
                </div>
            </div>

            {/* Controls - Fixed at bottom */}
            <div className="controls z-10">
                <button
                    onClick={toggleShuffle}
                    className={`control-btn ${shuffleEnabled ? 'text-white' : 'text-white/40'
                        }`}
                >
                    <Shuffle size={24} />
                </button>
                <button onClick={handleSkipBack} className="control-btn">
                    <SkipBack size={40} fill="currentColor" />
                </button>
                <button onClick={togglePlay} className="control-btn play-btn">
                    {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
                </button>
                <button onClick={handleSkipForward} className="control-btn">
                    <SkipForward size={40} fill="currentColor" />
                </button>
                <button
                    onClick={cycleRepeatMode}
                    className={`control-btn ${repeatMode !== 'off' ? 'text-white' : 'text-white/40'
                        }`}
                >
                    {repeatMode === 'one' ? <Repeat1 size={24} /> : <Repeat size={24} />}
                </button>
            </div>
        </>
    );
};

const MobileMusicWindow = WindowWrapper(MobileMusic, "mobilemusic");
export default MobileMusicWindow;
