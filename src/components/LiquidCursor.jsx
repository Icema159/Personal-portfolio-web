import { useEffect, useRef } from 'react';

export default function LiquidCursor() {
    const cursorRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );

        const finePointer = window.matchMedia(
            '(hover: hover) and (pointer: fine)'
        );

        if (reduceMotion.matches || !finePointer.matches) {
            cursor.style.display = 'none';
            return;
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let currentX = mouseX;
        let currentY = mouseY;

        let frame;

        const onPointerMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            const hot = Boolean(
                event.target.closest('.name-stage')
            );

            cursor.classList.toggle('cursor-hot', hot);
        };

        const animate = () => {
            // Mažesnis skaičius = daugiau "liquid lag"
            const speed = 0.14;

            currentX += (mouseX - currentX) * speed;
            currentY += (mouseY - currentY) * speed;

            cursor.style.transform = `
        translate3d(
          ${currentX}px,
          ${currentY}px,
          0
        )
        translate(-50%, -50%)
      `;

            frame = requestAnimationFrame(animate);
        };

        window.addEventListener(
            'pointermove',
            onPointerMove,
            { passive: true }
        );

        frame = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener(
                'pointermove',
                onPointerMove
            );

            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="liquid-cursor"
            aria-hidden="true"
        />
    );
}