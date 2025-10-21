// src/components/Controls.jsx - CORREGIDO
import React, { useState } from 'react';

function Controls({ musicPlaying, setMusicPlaying, musicRef, handleSendCariño }) {
    const [sendButtonText, setSendButtonText] = useState('💛 Enviar mi cariño 💛');

    const toggleMusic = () => {
        const audio = musicRef.current;
        if (!audio) return;

        if (musicPlaying) {
            audio.pause();
            setMusicPlaying(false);
        } else {
            // Intentar reproducir solo si no está ya reproduciéndose
            if (audio.paused) { 
                audio.play().catch(console.error);
                setMusicPlaying(true);
            }
        }
    };

    const handleButtonClick = () => {
        handleSendCariño();
        
        // Efecto visual en el botón
        const originalText = '💛 Enviar Flores 💛';
        setSendButtonText('✨ ¡Cariño enviado! ✨');
        
        setTimeout(() => {
            setSendButtonText(originalText);
        }, 4000);
    };

    // Estilo dinámico para el botón (ya que lo manipulabas con JS en el código original)
    const buttonStyle = sendButtonText !== '💛 Enviar Flores 💛' 
        ? { background: 'linear-gradient(135deg, #98fb98, #7fffd4)', color: '#0a0e1a' } 
        : {};

    return (
        <>
            {/* Botón de interacción */}
            <button 
                // APLICACIÓN DE CLASE CRUCIAL
                className="send-button" 
                id="sendButton"
                onClick={handleButtonClick}
                style={buttonStyle}
            >
                {sendButtonText}
            </button>

            {/* Control de música */}
            <div 
                // APLICACIÓN DE CLASE CRUCIAL
                className="music-control"
            >
                <button 
                    // APLICACIÓN DE CLASE CRUCIAL
                    className="music-button" 
                    id="musicButton" 
                    onClick={toggleMusic}
                >
                    <span id="musicIcon">{musicPlaying ? '🔊' : '🔇'}</span>
                </button>
                <span className="music-label">Música</span>
            </div>
        </>
    );
}

export default Controls;