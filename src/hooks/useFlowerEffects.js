// src/hooks/useFlowerEffects.js
import { useEffect } from 'react';

const useFlowerEffects = (flowerRefs, isSendingCariño, createMiniConfetti) => {
    
    useEffect(() => {
        // Definir handlers dentro del efecto para no tener que añadirlos a las dependencias
        const handleFlowerClick = (e, flower) => {
            flower.classList.add('clicked');

            // Cambiar color temporalmente (manipulación directa del SVG en el DOM)
            const petals = flower.querySelectorAll('path');
            petals.forEach(petal => {
                // Guardar fill original en data attribute si no existe
                if (!petal.dataset.originalFill) {
                    petal.dataset.originalFill = petal.getAttribute('fill') || '';
                }
                petal.setAttribute('fill', '#ffff99');
            });

            // Llamar a la función de confeti que está en el componente padre (App.jsx)
            if (typeof createMiniConfetti === 'function') {
                createMiniConfetti(e.pageX, e.pageY);
            }

            setTimeout(() => {
                flower.classList.remove('clicked');
                petals.forEach(petal => {
                    // Restaurar el fill original desde data attribute
                    if (petal.dataset.originalFill) {
                        petal.setAttribute('fill', petal.dataset.originalFill);
                        delete petal.dataset.originalFill;
                    }
                });
            }, 600);
        };

        const handleMouseMove = (e) => {
            if (isSendingCariño) return; // Desactivar si se está enviando el cariño

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            flowerRefs.forEach(flowerRef => {
                const flower = flowerRef.current;
                if (!flower) return;

                const rect = flower.getBoundingClientRect();
                const flowerX = rect.left + rect.width / 2;
                const flowerY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - flowerX;
                const deltaY = mouseY - flowerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance < 250) {
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                    flower.style.transform = `rotate(${angle / 15}deg)`;
                } else {
                    flower.style.transform = ''; // Dejar que el CSS maneje las animaciones sway
                }
            });
        };

        // Registrar listeners
        const clickRemovers = [];
        flowerRefs.forEach(flowerRef => {
            const flower = flowerRef.current;
            if (flower) {
                const clickHandler = (e) => handleFlowerClick(e, flower);
                flower.addEventListener('click', clickHandler);
                clickRemovers.push(() => flower.removeEventListener('click', clickHandler));
            }
        });

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            // Cleanup: quitar todos los click handlers y el mousemove
            clickRemovers.forEach(remove => remove());
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [flowerRefs, isSendingCariño, createMiniConfetti]); // Dependencias
    
    // (El registro de listeners se realiza en el useEffect anterior.)
};

export default useFlowerEffects;