import React, { useState, useEffect, useRef } from 'react';
import Controls from './components/Controls.jsx';
import FlowersGarden from './components/FlowersGarden.jsx';
import Confetti from './components/Confetti.jsx';
import Fireflies from './components/Fireflies.jsx';
import Sky from './components/Sky.jsx';
import './assets/style.css'; 

// Definición de la canción y las letras
const SONG = {
    src: "/audio/Danny Ocean.mp3",
    lyrics: [
    { text: "A veces, sin avisar, apareces en mi cabeza", time: 0 },
    { text: "Y no sé por qué, pero pensarte siempre mejora mi día.", time: 4000 },
    { text: "Hay personas que simplemente transmiten buena vibra... tú eres una de ellas.", time: 8000 },
    { text: "Supongo que tuve suerte de cruzarme contigo.", time: 12000 },
    { text: "Gracias por ser tan tú, osea Rigg :3.", time: 16000 },
    { text: "Tan auténtica, alegre y con un buen gusto para la moda", time: 20000 },
    { text: "que ni Pinteres se iguala", time: 20000 },
    { text: "Nunca cambies tu forma de ser, es lo que te hace única.", time: 24000 },
    { text: "Y sí... a veces te cuelas entre mis pensamientos sin que me dé cuenta.", time: 28000 },
],
duration: 36000


};


const App = () => {
    const musicRef = useRef(null);
    const [musicPlaying, setMusicPlaying] = useState(false);
    // autoplayBlocked/mutedAutoplay and manual play button removed per user request
    const [currentLyric, setCurrentLyric] = useState(SONG.lyrics[0]);
    const [isSendingCariño, setIsSendingCariño] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiKey, setConfettiKey] = useState(0);
    const [miniConfetti, setMiniConfetti] = useState([]);
    const [showGarden, setShowGarden] = useState(false);

    // --- Audio Logic ---
    useEffect(() => {
    const audio = new Audio(SONG.src);
    musicRef.current = audio;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.85;

    // Intentar reproducir al cargar (algunos navegadores permitirán muted autoplay)
    const tryPlay = async () => {
        try {
            await audio.play();
            setMusicPlaying(true);
        } catch (err) {
            console.warn('Autoplay bloqueado. Esperando interacción del usuario...');
            setMusicPlaying(false);
        }
    };
    tryPlay();

    // Si fue bloqueado, iniciar al primer clic/toque
    const startOnInteraction = async () => {
        try {
            await audio.play();
            setMusicPlaying(true);
        } catch (err) {
            console.error('Error al reproducir tras interacción:', err);
        } finally {
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
        }
    };

    document.addEventListener('click', startOnInteraction, { once: true });
    document.addEventListener('touchstart', startOnInteraction, { once: true });

    return () => {
        audio.pause();
        audio.src = "";
    };
}, []);


    // --- Lyrics Synchronization Logic ---
    useEffect(() => {
        const audio = musicRef.current;
        if (!audio) return;
        let rafId = null;
        let lastIndex = -1;

        const tick = () => {
            const currentTimeMs = (audio.currentTime || 0) * 1000;
            let newIndex = SONG.lyrics.length - 1;
            for (let i = 0; i < SONG.lyrics.length; i++) {
                if (currentTimeMs < SONG.lyrics[i].time) {
                    newIndex = Math.max(0, i - 1);
                    break;
                }
            }
            if (newIndex !== lastIndex) {
                lastIndex = newIndex;
                setCurrentLyric(SONG.lyrics[newIndex]);
            }
            rafId = requestAnimationFrame(tick);
        };

        if (musicRef.current && !audio.paused) {
            rafId = requestAnimationFrame(tick);
        }

        const onPlay = () => { if (!rafId) rafId = requestAnimationFrame(tick); };
        const onPause = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [/* no dependencias para no reiniciar */]);

    // --- Interaction Handlers ---
    const handleSendCariño = () => {
        // first make the garden visible, then trigger the bloom so the animation runs on mount
        setShowGarden(true);
        // small next-tick delay to allow FlowersGarden to mount
        setTimeout(() => {
            setIsSendingCariño(true);
            setShowConfetti(true);
            setConfettiKey(prev => prev + 1);
            setTimeout(() => {
                setIsSendingCariño(false);
                setShowConfetti(false);
            }, 4000);
        }, 80);
    };

    // Backup: listen for a custom event dispatched from Controls in case prop wiring fails
    useEffect(() => {
        const onSendEvent = () => {
            // show garden first
            setShowGarden(true);
            setTimeout(() => {
                setIsSendingCariño(true);
                setShowConfetti(true);
                setConfettiKey(prev => prev + 1);
                setTimeout(() => {
                    setIsSendingCariño(false);
                    setShowConfetti(false);
                }, 4000);
            }, 80);
        };
        document.addEventListener('send-cariño', onSendEvent);
        return () => document.removeEventListener('send-cariño', onSendEvent);
    }, []);

    const createMiniConfetti = (x, y) => {
        const newPetal = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            color: '#f4e157',
            size: Math.random() * 8 + 6,
            rotation: Math.random() * 360,
        };
        setMiniConfetti(prev => [...prev, newPetal]);
        setTimeout(() => {
            setMiniConfetti(prev => prev.filter(p => p.id !== newPetal.id));
        }, 3000);
    };

    // manual play handler removed (autoplay button removed)

    let lyricsText;
    let isActive;

    if (musicPlaying) {
        lyricsText = currentLyric.text;
        isActive = true;
    }
    const lyricsClass = `lyrics-display ${isActive ? 'lyrics-display-active' : ''}`;

    return (
        <div className="container">
            <Sky />
            <Fireflies />
            {showGarden && (
                <FlowersGarden 
                    isSendingCariño={isSendingCariño}
                    createMiniConfetti={createMiniConfetti}
                />
            )}

            {showConfetti && <Confetti key={confettiKey} />}

            <div className="confetti-container">
                {miniConfetti.map(petal => (
                    <div 
                        key={petal.id}
                        className="petal"
                        style={{
                            left: petal.x,
                            top: petal.y,
                            width: `${petal.size}px`,
                            height: `${petal.size}px`,
                            background: petal.color,
                            transform: `rotate(${petal.rotation}deg)`,
                            animationDuration: `${Math.random() * 1.5 + 1.5}s`,
                            animationDelay: `${Math.random() * 0.5}s`,
                        }}
                    ></div>
                ))}
            </div>

            <div className="message-box">
                <p 
                    id="lyricsDisplay" 
                    className={lyricsClass}
                >
                    {lyricsText}
                </p>
                {/* Nota de mutedAutoplay eliminada por petición del usuario */}
            </div>
            {/* Autoplay overlay removed per user request */}

            <Controls 
                musicPlaying={musicPlaying}
                setMusicPlaying={setMusicPlaying}
                musicRef={musicRef}
                handleSendCariño={handleSendCariño}
            />
        </div>
    );
};

export default App;
