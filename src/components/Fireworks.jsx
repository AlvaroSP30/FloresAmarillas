import React, { useEffect, useState, useMemo } from 'react';

// Fireworks with rocket -> explosion flow
// origin: {x,y} px where rockets start (moon center)
// target: {x,y} px where rockets should explode (top of flowers)
const Fireworks = ({ origin = { x: window.innerWidth / 2, y: 80 }, target = null, bursts = 3, particlesPerBurst = 18 }) => {
    const [explosions, setExplosions] = useState([]);
    const colors = useMemo(() => ['#ffd54f', '#ff8a65', '#ff5252', '#ff4081', '#7c4dff', '#448aff', '#40c4ff', '#69f0ae'], []);

    useEffect(() => {
        if (!origin) return;
        // schedule rockets that fly to target and spawn explosions there
        const generated = [];
        for (let i = 0; i < bursts; i++) {
            const delay = i * 400;
            // schedule explosion time (rocket flight duration 600ms)
            const flight = 600 + Math.random() * 220;
            const explodeAt = delay + flight;
            const id = `${Date.now()}-${i}`;
            generated.push({ id, delay, flight, explodeAt });
            // schedule explosion
            setTimeout(() => {
                // spawn explosion at target (with a little random offset)
                const pos = target ? {
                    x: target.x + (Math.random() - 0.5) * 80,
                    y: target.y + (Math.random() - 0.5) * 40
                } : {
                    x: origin.x + (Math.random() - 0.5) * 200,
                    y: origin.y + 120 + Math.random() * 80
                };
                setExplosions(prev => [...prev, { id: `${id}-expl`, pos }]);
                // also spawn a couple of screen-wide colored flashes
                const screenLights = Array.from({ length: 2 + Math.floor(Math.random() * 3) }).map(() => ({
                    id: `${id}-light-${Math.random()}`,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight * 0.6, // top area mostly
                    color: colors[Math.floor(Math.random() * colors.length)],
                    duration: 800 + Math.random() * 900,
                }));
                setTimeout(() => {
                    // append screen lights to DOM by dispatching a custom event
                    const event = new CustomEvent('fireworks-screen-lights', { detail: screenLights });
                    document.dispatchEvent(event);
                }, 20);
                // remove this explosion after a while
                setTimeout(() => setExplosions(prev => prev.filter(e => e.id !== `${id}-expl`)), 2200);
            }, explodeAt);
        }

        // cleanup all explosions after duration
        const cleanup = setTimeout(() => setExplosions([]), bursts * 1500 + 2000);
        return () => {
            clearTimeout(cleanup);
            setExplosions([]);
        };
    }, [origin, target, bursts, colors]);

    return (
        <div className="fireworks-root" aria-hidden>
            {/* render rockets visuals (CSS only) */}
            {Array.from({ length: bursts }).map((_, i) => (
                <div
                    key={`rocket-${i}`}
                    className="firework-rocket"
                    style={{ left: origin.x, top: origin.y, animationDelay: `${i * 400}ms` }}
                />
            ))}

            {/* render explosions (particles) */}
            {explosions.map(ex => (
                <div key={ex.id} className="firework-explosion" style={{ left: ex.pos.x, top: ex.pos.y }}>
                    {Array.from({ length: particlesPerBurst }).map((_, pi) => {
                        const angle = (Math.PI * 2 * pi) / particlesPerBurst + (Math.random() - 0.5) * 0.6;
                        const distance = 40 + Math.random() * 220; // px
                        const dx = Math.cos(angle) * distance;
                        const dy = Math.sin(angle) * distance * -1;
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        const duration = 700 + Math.random() * 700;
                        const delay = Math.random() * 160;
                        return (
                            <div
                                key={pi}
                                className="firework-particle"
                                style={{
                                    background: color,
                                    boxShadow: `0 0 8px ${color}, 0 0 18px ${color}55`,
                                    '--dx': `${dx}px`,
                                    '--dy': `${dy}px`,
                                    animationDuration: `${duration}ms`,
                                    animationDelay: `${delay}ms`,
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Fireworks;
