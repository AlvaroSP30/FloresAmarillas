import React, { useMemo } from 'react';

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

    return (
        <div className="sky" aria-hidden>
            <div className="moon" />
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
        </div>
    );
};

export default Sky;
