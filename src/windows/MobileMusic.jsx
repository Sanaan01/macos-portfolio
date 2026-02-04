import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/index.js";
import { useRef, useState, useEffect } from "react";
import { SkipBack, Play, Pause, SkipForward } from "lucide-react";

const MobileMusic = () => {
    const audioRef = useRef(null);
    const isSeeking = useRef(false);
    const wasPlayingBeforeSeek = useRef(false);

    const [playlist, setPlaylist] = useState([]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seekTime, setSeekTime] = useState(0);

    const currentTrack = playlist[currentTrackIndex] || { title: '', artist: '', album: '', src: '', cover: '' };

    // Fetch playlist on mount
    useEffect(() => {
        fetch('/playlist.json')
            .then(res => res.json())
            .then(data => setPlaylist(data))
            .catch(err => console.error('Failed to load playlist:', err));
    }, []);

    // Audio event listeners
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
            setCurrentTrackIndex(prev => {
                if (prev < playlist.length - 1) {
                    return prev + 1;
                }
                // Last track ended, stop playing
                setIsPlaying(false);
                return prev;
            });
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [playlist.length]);

    // Effect to load and play audio when track changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || playlist.length === 0) return;

        // Load the new source
        audio.load();
        setDuration(0);
        setCurrentTime(0);

        // If we should be playing, start playback
        if (isPlaying) {
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                setIsPlaying(false);
            });
        }
    }, [currentTrackIndex, playlist]);


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
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

    const playTrack = (index) => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTrackIndex(index);
        setCurrentTime(0);
        audio.load();
        audio.play();
        setIsPlaying(true);
    };

    const handleSkipBack = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (currentTime < 5 && currentTrackIndex > 0) {
            playTrack(currentTrackIndex - 1);
        } else {
            audio.currentTime = 0;
            setCurrentTime(0);
        }
    };

    const handleSkipForward = () => {
        if (currentTrackIndex < playlist.length - 1) {
            playTrack(currentTrackIndex + 1);
        } else {
            playTrack(0);
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
                <audio ref={audioRef} src={currentTrack.src} />

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

                {/* Progress Bar */}
                <div className="progress-container">
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

                {/* Controls */}
                <div className="controls">
                    <button onClick={handleSkipBack} className="control-btn">
                        <SkipBack size={40} fill="currentColor" />
                    </button>
                    <button onClick={togglePlay} className="control-btn play-btn">
                        {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
                    </button>
                    <button onClick={handleSkipForward} className="control-btn">
                        <SkipForward size={40} fill="currentColor" />
                    </button>
                </div>
            </div>
        </>
    );
};

const MobileMusicWindow = WindowWrapper(MobileMusic, "mobilemusic");
export default MobileMusicWindow;
