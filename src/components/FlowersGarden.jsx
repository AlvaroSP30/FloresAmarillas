// src/components/FlowersGarden.jsx - CORREGIDO (Posición y Tamaño)
import React, { useMemo } from 'react';
import FlowerSVG from './FlowerSVG.jsx';
import '../assets/style.css';

const FlowersGarden = ({ isSendingCariño, createMiniConfetti }) => {
    // Más flores para simular un jardín
    const FLOWER_COUNT = 70; // más flores para cubrir la pantalla

    // Genera posiciones y tamaños una vez (useMemo para estabilidad)
    const flowers = useMemo(() => {
        const arr = [];
        for (let i = 0; i < FLOWER_COUNT; i++) {
            // Distribución: cubrir prácticamente toda la pantalla
            // pero con sesgo hacia el centro usando una suma de dos randoms (distribución triangular)
            const bias = () => (Math.random() + Math.random()) / 2;
            const minX = 5, maxX = 95;
            const minY = 15, maxY = 85;
            const x = minX + bias() * (maxX - minX);
            const y = minY + bias() * (maxY - minY);
            // Aumentar el tamaño en un 50% respecto al base previo
            const base = 44 * 1.5; // 66px base
            const scale = Math.random() * 0.9 + 0.9; // 0.9 - 1.8
            const size = Math.round(base * scale); // tamaño en px
            // Variaciones de amarillo/ámbar para pétalos
            const petalColors = ['#f4e157', '#fff176', '#ffd54f', '#ffeb3b', '#fdd835'];
            const centerColors = ['#f57f17', '#ffb300', '#ff8f00', '#bf360c'];
            const petal = petalColors[Math.floor(Math.random() * petalColors.length)];
            const center = centerColors[Math.floor(Math.random() * centerColors.length)];

            arr.push({
                id: `flower-${i}-${Date.now()}`,
                left: `${x}%`,
                top: `${y}%`,
                size,
                petal,
                center,
                sway: `sway-${(i % 3) + 1}`,
                // base delay used for per-flower staggering (seconds)
                baseDelay: Math.random() * 1.4
            });
        }
        return arr;
    }, []);

    return (
        <div className="flowers-container" aria-hidden="true">
            {flowers.map((f, idx) => (
                <FlowerSVG
                    key={f.id}
                    className={`flower ${f.sway}`}
                    size={f.size}
                    isBlooming={!!isSendingCariño}
                    // stagger: combine baseDelay with index-based offset when blooming (seconds)
                    // aumentar el offset por índice para una onda más pronunciada
                    animationDelay={isSendingCariño ? (f.baseDelay + idx * 0.14) : f.baseDelay}
                    gradientId={f.id}
                    style={{
                        position: 'absolute',
                        left: f.left,
                        top: f.top,
                        zIndex: 10
                    }}
                    petalColor={f.petal}
                    centerColor={f.center}
                    onClick={(e) => {
                        // Propagar efecto si existe createMiniConfetti
                        const rect = e.currentTarget.getBoundingClientRect();
                        createMiniConfetti?.(rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }}
                />
            ))}
        </div>
    );
};

export default FlowersGarden;