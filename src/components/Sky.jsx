import React, { useMemo, useState } from 'react';
import Fireworks from './Fireworks.jsx';

// Sky component: renders a decorative full moon and a set of twinkling stars
const Sky = ({ starCount = 28 }) => {
    // Generate deterministic-ish star positions once
    const stars = useMemo(() => {
        return Array.from({ length: starCount }).map((_, i) => {
            // X: 2%..98% | Y: 2%..28% (top area)
            const x = Math.floor(Math.random() * 96) + 2;
            const y = Math.floor(Math.random() * 26) + 2;
            const size = Math.random() * 2 + 1; // 1-3px
            const delay = Math.random() * 4; // seconds
            const duration = 2 + Math.random() * 3; // 2-5s
            return { key: i, x, y, size, delay, duration };
        });
    }, [starCount]);

    const [showFireworks, setShowFireworks] = useState(false);

    const handleMoonClick = (e) => {
        // compute moon center in viewport coords
        const targetEl = e.currentTarget;
        const rect = targetEl.getBoundingClientRect();
        const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        // set explosion target to top-center of the viewport (approx. 12% height)
        const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.12 };
        setShowFireworks({ origin, target });
        // auto-hide after a short while
        setTimeout(() => setShowFireworks(false), 3000);
    };

    return (
        <div className="sky" aria-hidden>
            <div className="moon" onClick={handleMoonClick} role="button" aria-label="Luna" />
            {stars.map(s => (
                <div
                    key={s.key}
                    className="twinkle-star"
                    style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${s.duration}s`,
                    }}
                />
            ))}
            {showFireworks && <Fireworks origin={showFireworks.origin} target={showFireworks.target} bursts={4} particlesPerBurst={20} />}
        </div>
    );
};

export default Sky;
