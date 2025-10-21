// src/components/FlowerSVG.jsx
import React from 'react';

// El SVG de la flor es el mismo que tenías en la función createFlower, 
// solo que adaptado a la sintaxis JSX.

const FlowerSVG = React.forwardRef(({ size = 48, appearanceDelay = 0, bloomDelay = 0, swayClass = '', className = '', petalColor, centerColor, isBlooming = false, gradientId, onClick, onMouseEnter, style }, ref) => {
    // Definición de Gradiente (debe estar dentro del SVG para que funcione correctamente)

    return (
        <svg
            ref={ref}
            width={size}
            height={size * 1.5}
            viewBox="0 0 100 150"
            className={`${className} ${swayClass} ${isBlooming ? 'bloom' : ''}`.trim()}
            /* merge incoming style (left/top/position) and expose per-flower delays as CSS variables */
            style={{
                ...(style || {}),
                transformOrigin: '50% 100%',
                ['--appearance-delay']: `${appearanceDelay}s`,
                ['--bloom-delay']: `${bloomDelay}s`
            }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient id={gradientId || `petalGradient-${appearanceDelay}`}>
                    <stop offset="0%" style={{ stopColor: petalColor || '#fff566', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: petalColor || '#f4e157', stopOpacity: 1 }} />
                </radialGradient>
            </defs>
            
            {/* Tallo */}
            <path
                d="M 50 40 Q 48 70 50 100 T 50 140"
                stroke="#2d5a3d"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
            />
            
            {/* Hojas */}
            <ellipse cx="45" cy="80" rx="8" ry="15" fill="#3d7a52" transform="rotate(-30 45 80)" />
            <ellipse cx="55" cy="100" rx="8" ry="15" fill="#3d7a52" transform="rotate(30 55 100)" />
            
            {/* Pétalos */}
            {/* Se generan en el JS, pero aquí se definen con una función de ayuda si es necesario, 
               o se dibujan como un grupo simple para el ejemplo. Para mantenerlo simple, 
               usaremos el gradiente genérico. El JS original usa un bucle para dibujar los 5 pétalos. */}
               
            {/* Ejemplo simplificado de un pétalo central con el gradiente (el código original es más complejo): */}
            <g fill={`url(#${gradientId || `petalGradient-${appearanceDelay}`})`} stroke="#e8d44d" strokeWidth="0.5">
                {[0, 72, 144, 216, 288].map(angle => (
                    <path
                        key={angle}
                        d="M 50 40 Q 42 28 50 22 Q 58 28 50 40" // Forma de pétalo
                        transform={`rotate(${angle} 50 40)`}
                    />
                ))}
            </g>
            
            {/* Centro (Pistilo y Estambres) */}
            <g>
                <circle cx="50" cy="40" r="6" fill={centerColor || '#d4a017'} />
                {[...Array(8)].map((_, i) => {
                    const angle = (i * 45) * Math.PI / 180;
                    const dotX = 50 + Math.cos(angle) * 3;
                    const dotY = 40 + Math.sin(angle) * 3;
                    return <circle key={i} cx={dotX} cy={dotY} r="1" fill="#8b4513" />;
                })}
            </g>
        </svg>
    );
});

FlowerSVG.displayName = 'FlowerSVG';
export default FlowerSVG;