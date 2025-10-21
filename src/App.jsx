import React, { useState, useEffect, useRef } from 'react';
import Controls from './components/Controls.jsx';
import FlowersGarden from './components/FlowersGarden.jsx';
import Confetti from './components/Confetti.jsx';
import Fireflies from './components/Fireflies.jsx';
import './assets/style.css'; 

// Definición de la canción y las letras
const SONG = {
    // Archivo en public/audio. Asegúrate de que el fichero exista exactamente con este nombre
    src: "/audio/Danny Ocean.mp3",
    lyrics: [
        { text: "En este cielo oscuro, tú eres mi luz.", time: 0 },
        { text: "Cada estrella es un reflejo de tu alma.", time: 4000 },
        { text: "Mi corazón late al ritmo de tu nombre.", time: 8000 },
        { text: "Y mi cariño es eterno, como el tiempo.", time: 12000 },
        { text: "Gracias por existir.", time: 16000 },
        { text: "Pulsa el botón 💛 y haz florecer la pantalla.", time: 20000 },
    ],
    duration: 25000 // Duración total para el loop
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
        if (!musicPlaying) {
            setCurrentLyric(SONG.lyrics[0]);
            return;
        }

        const audio = musicRef.current;
        let interval;

        const syncLyrics = () => {
            const currentTime = (audio.currentTime || 0) * 1000; // a ms

            let nextLyric = SONG.lyrics.find(lyric => currentTime < lyric.time);
            let activeLyric;

            if (nextLyric) {
                const activeIndex = SONG.lyrics.indexOf(nextLyric) - 1;
                activeLyric = SONG.lyrics[activeIndex] || SONG.lyrics[0];
            } else {
                activeLyric = SONG.lyrics[SONG.lyrics.length - 1];
            }

            if (activeLyric && activeLyric.text !== currentLyric.text) {
                setCurrentLyric(activeLyric);
            }

            // No reiniciamos manualmente; dejamos que el audio se repita solo
            if (audio.ended) {
                audio.currentTime = 0;
                audio.play();
            }
        };

        interval = setInterval(syncLyrics, 500);
        return () => clearInterval(interval);
    }, [musicPlaying, currentLyric.text]);

    // --- Interaction Handlers ---
    const handleSendCariño = () => {
        setIsSendingCariño(true);
        setShowConfetti(true);
        setConfettiKey(prev => prev + 1);
        setTimeout(() => {
            setIsSendingCariño(false);
            setShowConfetti(false);
        }, 4000);
    };

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
            <Fireflies />
            <FlowersGarden 
                isSendingCariño={isSendingCariño}
                createMiniConfetti={createMiniConfetti}
            />

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
