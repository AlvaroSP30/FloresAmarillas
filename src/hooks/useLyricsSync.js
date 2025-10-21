// src/hooks/useLyricsSync.js
import { useEffect } from 'react';

const useLyricsSync = (musicRef, lyricsData, setLyricsText, musicPlaying) => {
    useEffect(() => {
        const audio = musicRef.current;
        if (!audio || !musicPlaying) {
            setLyricsText(""); // Limpiar letras si la música está pausada o no existe
            return;
        }

        const updateLyrics = () => {
            const time = audio.currentTime;
            
            // Encuentra la línea actual
            const currentLine = lyricsData.find(
                (line) => time >= line.time && time < line.time + 6 // Rango de 6 segundos
            );
            
            if (currentLine) {
                // Lógica de fade-in (simulada aquí, aunque el CSS maneja la opacidad)
                // Usamos el texto directamente
                setLyricsText(currentLine.text); 
            } else {
                setLyricsText("");
            }
        };

        // Escucha el evento 'timeupdate' para mayor precisión
        audio.addEventListener('timeupdate', updateLyrics);

        // Limpieza al desmontar o si las dependencias cambian
        return () => {
            audio.removeEventListener('timeupdate', updateLyrics);
        };
    }, [musicRef, lyricsData, setLyricsText, musicPlaying]);
};

export default useLyricsSync;