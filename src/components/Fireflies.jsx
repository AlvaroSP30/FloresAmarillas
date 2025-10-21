// src/components/Fireflies.jsx
import React, { useEffect, useRef } from 'react';

function Fireflies() {
    const firefliesRef = useRef([]);

    useEffect(() => {
        const container = document.body;
        const count = 15;
        
        // Limpiar luciérnagas antiguas si existen
        firefliesRef.current.forEach(f => f.remove());
        firefliesRef.current = [];

        for (let i = 0; i < count; i++) {
            const firefly = document.createElement('div');
            firefly.classList.add('firefly');
            firefly.style.left = Math.random() * window.innerWidth + 'px';
            firefly.style.top = Math.random() * window.innerHeight + 'px';
            firefly.style.animationDelay = Math.random() * 3 + 's';
            firefly.style.animationDuration = (Math.random() * 4 + 4) + 's';
            
            container.appendChild(firefly);
            firefliesRef.current.push(firefly);
        }

        // Función de limpieza de React
        return () => {
            firefliesRef.current.forEach(f => f.remove());
        };
    }, []); // Se ejecuta solo una vez al montar

    // Nota: El elemento Firefly se añade directamente al <body>, no hay JSX aquí.
    return null; 
}

export default Fireflies;