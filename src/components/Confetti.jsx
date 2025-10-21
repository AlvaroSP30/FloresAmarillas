// src/components/Confetti.jsx
import React, { useEffect, useRef } from 'react';

function Confetti({ showFullConfetti, miniConfettiTrigger }) {
    const confettiContainerRef = useRef(null);

    const createPetal = (x, y, size, duration, delay, color) => {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        petal.style.left = x + 'px';
        petal.style.top = y + 'px';
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.background = color;
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = delay + 's';
        
        // Efecto inicial de explosión para mini-confeti
        if (y !== '-30') {
             petal.style.transform = `translateX(${(Math.random() - 0.5) * 100}px)`;
        }

        confettiContainerRef.current.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, (duration + delay) * 1000); // Quitar después de la animación
    };

    // 1. Lógica de Confeti Completo
    useEffect(() => {
        if (!showFullConfetti) return;

        const petalCount = 120;
        const colors = ['#f4e157', '#fff566', '#7fffd4', '#98fb98'];
        let timeoutIds = [];
        
        for (let i = 0; i < petalCount; i++) {
            const id = setTimeout(() => {
                createPetal(
                    Math.random() * window.innerWidth, // x
                    -30, // y (desde arriba)
                    Math.random() * 12 + 8, // size
                    Math.random() * 3 + 3, // duration
                    0, // delay (ya usamos el i*25 para el staggered delay)
                    colors[Math.floor(Math.random() * colors.length)] // color
                );
            }, i * 25);
            timeoutIds.push(id);
        }
        
        // Limpieza
        return () => timeoutIds.forEach(id => clearTimeout(id));
        
    }, [showFullConfetti]);

    // 2. Lógica de Mini Confeti (al hacer clic en flor)
    useEffect(() => {
        if (!miniConfettiTrigger) return;
        
        const { x, y } = miniConfettiTrigger;
        const colors = ['#f4e157', '#fff566', '#7fffd4'];
        
        for (let i = 0; i < 12; i++) {
            createPetal(
                x, 
                y,
                Math.random() * 8 + 6, // size
                Math.random() * 2 + 2, // duration
                0, // delay
                colors[Math.floor(Math.random() * colors.length)] // color
            );
        }
    }, [miniConfettiTrigger]); // Se dispara cada vez que cambia el trigger

    return (
        <div className="confetti-container" ref={confettiContainerRef}>
            {/* Aquí se inyectarán los pétalos dinámicamente */}
        </div>
    );
}

export default Confetti;