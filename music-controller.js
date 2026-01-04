/**
 * Global Music Controller
 * Manages background music across all pages with state persistence
 */

(function() {
    'use strict';

    // Music state management
    let backgroundMusic = null;
    const MUSIC_FILE = 'audio/musique-audio.mp3';
    const STORAGE_KEYS = {
        MUTED: 'isMusicMuted',
        CURRENT_TIME: 'musicCurrentTime',
        INITIALIZED: 'musicInitialized'
    };

    /**
     * Initialize the background music
     */
    function initMusic() {
        // Create audio element if it doesn't exist
        if (!backgroundMusic) {
            backgroundMusic = new Audio(MUSIC_FILE);
            backgroundMusic.loop = true;
            backgroundMusic.volume = 0.15; // 15% volume
        }

        // Get saved state
        const isMuted = localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
        const savedTime = parseFloat(localStorage.getItem(STORAGE_KEYS.CURRENT_TIME)) || 0;

        // Restore playback position
        if (savedTime > 0) {
            backgroundMusic.currentTime = savedTime;
        }

        // Start playing if not muted
        if (!isMuted) {
            playMusic();
        }

        // Save current time periodically
        setInterval(() => {
            if (backgroundMusic) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_TIME, backgroundMusic.currentTime.toString());
            }
        }, 1000);

        // Mark as initialized
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }

    /**
     * Play the background music
     */
    function playMusic() {
        if (backgroundMusic) {
            backgroundMusic.play().catch(error => {
                console.log('Autoplay blocked by browser:', error);
                // Try again on user interaction
                document.addEventListener('click', function tryPlay() {
                    backgroundMusic.play().catch(e => console.log('Still blocked:', e));
                    document.removeEventListener('click', tryPlay);
                }, { once: true });
            });
        }
    }

    /**
     * Pause the background music
     */
    function pauseMusic() {
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
    }

    /**
     * Toggle mute state
     */
    function toggleMute() {
        const isMuted = localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
        const newMutedState = !isMuted;
        
        localStorage.setItem(STORAGE_KEYS.MUTED, newMutedState.toString());
        
        if (newMutedState) {
            pauseMusic();
        } else {
            playMusic();
        }
        
        return newMutedState;
    }

    /**
     * Get current mute state
     */
    function isMuted() {
        return localStorage.getItem(STORAGE_KEYS.MUTED) === 'true';
    }

    /**
     * Save state before page unload
     */
    function saveState() {
        if (backgroundMusic) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_TIME, backgroundMusic.currentTime.toString());
        }
    }

    // Initialize music when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusic);
    } else {
        initMusic();
    }

    // Save state before leaving page
    window.addEventListener('beforeunload', saveState);

    // Expose global API
    window.MusicController = {
        play: playMusic,
        pause: pauseMusic,
        toggleMute: toggleMute,
        isMuted: isMuted,
        getAudioElement: () => backgroundMusic
    };
})();
