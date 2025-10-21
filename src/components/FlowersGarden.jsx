// src/components/FlowersGarden.jsx - CORREGIDO (Posición y Tamaño)
import React, { useRef, useMemo } from 'react';
import FlowerSVG from './FlowerSVG.jsx';
import useFlowerEffects from '../hooks/useFlowerEffects.js';

const FLOWER_COUNT = 15; 

const FlowersGarden = ({ isSendingCariño, createMiniConfetti }) => {
    
    // Generar las propiedades de las flores una sola vez, usando useMemo para optimización
    const floatingFlowerProps = useMemo(() => {
        return Array.from({ length: FLOWER_COUNT }, (_, index) => {
            // Generamos una posición aleatoria para el CENTRO de la flor
            // LIMITAR a un área central para evitar que todas aparezcan en la esquina
            // Por ejemplo, X entre 15% y 85%, Y entre 25% y 75%.
            const minX = 15; const maxX = 85;
            const minY = 25; const maxY = 75;
            const randomX = Math.random() * (maxX - minX) + minX; // Porcentaje X (minX - maxX)
            const randomY = Math.random() * (maxY - minY) + minY; // Porcentaje Y (minY - maxY)
            
            // Tamaños más grandes: entre 90 y 140 (antes 70-110)
            const size = Math.floor(Math.random() * 50) + 90; 
            
            const delay = index * 0.3 + Math.random(); 
            const swayClass = `sway-${(index % 3) + 1}`;

            return {
                key: index,
                x: randomX,
                y: randomY,
                size: size,
                delay: delay,
                swayClass: swayClass,
            };
        });
    }, []); // El array vacío asegura que esto se calcule una sola vez al montar

    // Almacena referencias a los elementos de las flores
    const flowerRefs = useRef([]); 
    flowerRefs.current = floatingFlowerProps.map((_, i) => flowerRefs.current[i] ?? React.createRef());
    
    // Hook para la interactividad
    useFlowerEffects(flowerRefs.current, isSendingCariño, createMiniConfetti);

    return (
        <div className="flowers-container" id="flowersContainer">
            {floatingFlowerProps.map((props, index) => {
                // Ajuste de posición: el SVG tiene un viewBox de 100x150.
                // Usamos props.size como el ancho (width) del SVG.
                // La altura será props.size * 1.5.
                // Para centrar, restamos la mitad del ancho y la mitad de la altura.
                const adjustmentX = props.size / 2; // La mitad del ancho del SVG
                const adjustmentY = (props.size * 1.5) / 2; // La mitad de la altura del SVG
                
                // Calculamos la posición final para que el CENTRO de la flor esté en (props.x, props.y)
                // Usamos vw para X y vh para Y, y restamos la mitad del tamaño para centrar.
                const finalX = `calc(${props.x}vw - ${adjustmentX}px)`;
                const finalY = `calc(${props.y}vh - ${adjustmentY}px)`;

                return (
                    <FlowerSVG
                        key={props.key}
                        ref={flowerRefs.current[index]}
                        size={props.size}
                        delay={props.delay}
                        swayClass={props.swayClass + (isSendingCariño ? ' fast-sway' : '')}
                        style={{ left: finalX, top: finalY, position: 'absolute' }}
                    />
                );
            })}
        </div>
    );
};

export default FlowersGarden;