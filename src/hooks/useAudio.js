import { useEffect, useRef, useState, useCallback } from 'react';

export default function useAudio(src, { loop = true, volume = 0.85 } = {}) {
    const audioRef = useRef(null);
    const [state, setState] = useState({ playing: false, mutedAutoplay: false, error: null, loading: true });

    useEffect(() => {
        if (!src) return;
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.preload = 'auto';
        audio.loop = loop;
        audio.volume = volume;

        const onPlay = () => setState(s => ({ ...s, playing: true, loading: false }));
        const onPause = () => setState(s => ({ ...s, playing: false }));
        const onError = () => setState(s => ({ ...s, error: true, loading: false }));

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('error', onError);

        const tryPlay = async () => {
            try {
                await audio.play();
                setState(s => ({ ...s, playing: true }));
            } catch {
                // autoplay blocked — wait user interaction
                setState(s => ({ ...s, playing: false, loading: false }));
            }
        };
        tryPlay();

        return () => {
            audio.pause();
            audio.src = '';
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('error', onError);
        };
    }, [src, loop, volume]);

    const play = useCallback(async (opts = { muted: false }) => {
        const audio = audioRef.current;
        if (!audio) return;
        try {
            audio.muted = !!opts.muted;
            await audio.play();
            setState(s => ({ ...s, playing: true, mutedAutoplay: !!opts.muted }));
        } catch (err) {
            setState(s => ({ ...s, error: err }));
            throw err;
        }
    }, []);

    const pause = useCallback(() => {
        const audio = audioRef.current;
        if (audio) audio.pause();
    }, []);

    return { audioRef, state, play, pause };
}