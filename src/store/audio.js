import { create } from "zustand";

// Create a single shared Audio element
const sharedAudio = typeof window !== 'undefined' ? new Audio() : null;

const useAudioStore = create((set, get) => ({
    // Playlist state
    playlist: [],
    currentTrackIndex: 0,

    // Playback state
    isPlaying: false,
    currentTime: 0,
    duration: 0,

    // Shuffle and repeat state
    shuffleEnabled: false,
    repeatMode: 'off', // 'off' | 'all' | 'one'

    // Seeking state
    isSeeking: false,
    wasPlayingBeforeSeek: false,

    // Get current track
    getCurrentTrack: () => {
        const { playlist, currentTrackIndex } = get();
        return playlist[currentTrackIndex] || { title: '', artist: '', album: '', src: '', cover: '' };
    },

    // Get the shared audio element
    getAudioElement: () => sharedAudio,

    // Initialize playlist
    setPlaylist: (playlist) => set({ playlist }),

    // Sync audio state (called from components)
    syncState: () => {
        if (!sharedAudio) return;
        set({
            currentTime: sharedAudio.currentTime,
            duration: sharedAudio.duration || 0
        });
    },

    // Play/pause controls
    play: async () => {
        if (!sharedAudio) return;
        try {
            await sharedAudio.play();
            set({ isPlaying: true });
        } catch (err) {
            console.error('Playback failed:', err);
            set({ isPlaying: false });
        }
    },

    pause: () => {
        if (!sharedAudio) return;
        sharedAudio.pause();
        set({ isPlaying: false });
    },

    togglePlay: async () => {
        const { isPlaying, play, pause } = get();
        if (isPlaying) {
            pause();
        } else {
            await play();
        }
    },

    // Track navigation
    nextTrack: () => {
        const { playlist, currentTrackIndex, isPlaying, shuffleEnabled } = get();

        // Shuffle mode: play random track
        if (shuffleEnabled) {
            const randomIndex = get().getRandomTrackIndex();
            set({ currentTrackIndex: randomIndex, currentTime: 0 });
            get().loadTrack(isPlaying);
            return;
        }

        // Normal sequential playback
        if (currentTrackIndex < playlist.length - 1) {
            set({ currentTrackIndex: currentTrackIndex + 1, currentTime: 0 });
            get().loadTrack(isPlaying);
        }
    },

    prevTrack: () => {
        const { currentTrackIndex, isPlaying } = get();
        if (currentTrackIndex > 0) {
            set({ currentTrackIndex: currentTrackIndex - 1, currentTime: 0 });
            get().loadTrack(isPlaying);
        }
    },

    setTrack: (index) => {
        const { playlist, isPlaying } = get();
        if (index >= 0 && index < playlist.length) {
            set({ currentTrackIndex: index, currentTime: 0 });
            get().loadTrack(isPlaying);
        }
    },

    // Load current track into audio element
    loadTrack: async (autoPlay = false) => {
        if (!sharedAudio) return;
        const track = get().getCurrentTrack();
        if (!track.src) return;

        sharedAudio.src = track.src;
        sharedAudio.load();
        set({ duration: 0, currentTime: 0 });

        if (autoPlay) {
            try {
                await sharedAudio.play();
                set({ isPlaying: true });
            } catch (err) {
                console.error('Playback failed:', err);
                set({ isPlaying: false });
            }
        }
    },

    // Seeking
    startSeek: () => {
        const { isPlaying } = get();
        set({ isSeeking: true, wasPlayingBeforeSeek: isPlaying });
        if (sharedAudio && isPlaying) {
            sharedAudio.pause();
        }
    },

    endSeek: (time) => {
        if (!sharedAudio) return;
        const { wasPlayingBeforeSeek } = get();
        sharedAudio.currentTime = time;
        set({ isSeeking: false, currentTime: time });
        if (wasPlayingBeforeSeek) {
            sharedAudio.play();
            set({ isPlaying: true });
        }
    },

    seek: (time) => {
        if (!sharedAudio) return;
        sharedAudio.currentTime = time;
        set({ currentTime: time });
    },

    // Toggle shuffle mode (auto-disables if repeatMode is 'one')
    toggleShuffle: () => {
        const { shuffleEnabled, repeatMode } = get();
        if (!shuffleEnabled && repeatMode === 'one') {
            // Can't enable shuffle when repeat-one is active
            // Switch repeat mode to 'all' first
            set({ shuffleEnabled: true, repeatMode: 'all' });
        } else {
            set({ shuffleEnabled: !shuffleEnabled });
        }
    },

    // Cycle repeat mode: off -> all -> one -> off
    cycleRepeatMode: () => {
        const { repeatMode, shuffleEnabled } = get();
        if (repeatMode === 'off') {
            set({ repeatMode: 'all' });
        } else if (repeatMode === 'all') {
            // When entering repeat-one, disable shuffle
            set({ repeatMode: 'one', shuffleEnabled: false });
        } else {
            set({ repeatMode: 'off' });
        }
    },

    // Get a random track index (for shuffle mode)
    getRandomTrackIndex: () => {
        const { playlist, currentTrackIndex } = get();
        if (playlist.length <= 1) return 0;
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentTrackIndex);
        return newIndex;
    },
}));

// Setup audio event listeners
if (sharedAudio) {
    sharedAudio.addEventListener('timeupdate', () => {
        const state = useAudioStore.getState();
        if (!state.isSeeking) {
            useAudioStore.setState({ currentTime: sharedAudio.currentTime });
        }
    });

    sharedAudio.addEventListener('loadedmetadata', () => {
        useAudioStore.setState({ duration: sharedAudio.duration });
    });

    sharedAudio.addEventListener('ended', () => {
        const state = useAudioStore.getState();
        const { playlist, currentTrackIndex, repeatMode, shuffleEnabled } = state;

        // Repeat-one mode: loop current track
        if (repeatMode === 'one') {
            sharedAudio.currentTime = 0;
            sharedAudio.play();
            return;
        }

        // Shuffle mode: play random track
        if (shuffleEnabled) {
            const randomIndex = state.getRandomTrackIndex();
            state.setTrack(randomIndex);
            return;
        }

        // Normal playback
        if (currentTrackIndex < playlist.length - 1) {
            state.nextTrack();
        } else if (repeatMode === 'all') {
            // Loop back to first track
            state.setTrack(0);
        } else {
            useAudioStore.setState({ isPlaying: false, currentTime: 0 });
        }
    });
}

export default useAudioStore;
