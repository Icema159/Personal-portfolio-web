import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import './next-chapter.css';

const MotionSpan = motion.span;
const MotionAnchor = motion.a;

export default function NextChapter() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const fill = useTransform(scrollYProgress, [0, 0.25], [100, 0]);
  const clipPath = useTransform(fill, value => `inset(${value}% 0 0 0)`);
  const opacity = useTransform(scrollYProgress, [0.2, 0.32], [0, 1]);
  const y = useTransform(scrollYProgress, [0.2, 0.32], [14, 0]);

  const scale = useTransform(scrollYProgress, [0.25, 1], [1, 1.7]);
  const separation = useTransform(scrollYProgress, [0.25, 1], ['0vw', '40vw']);
  const sceneOpacity = useTransform(scrollYProgress, [0.65, 1], [1, 0.5]);

  return (
    <section ref={ref} className="next-chapter" aria-labelledby="next-chapter-title">
      <div className="next-chapter-sticky">
      <div className="next-chapter-scene">
      <p className="next-chapter-kicker">Discipline brought me here.</p>
      <h2 id="next-chapter-title" className="next-chapter-title" aria-label="WHAT’S NEXT?">
        {['WHAT’S', 'NEXT?'].map(word => (
          <MotionSpan key={word} aria-hidden="true" className="next-chapter-word"
            style={reduceMotion ? {} : { scale, opacity: sceneOpacity, '--word-shift': separation }}>
            <span className="next-chapter-outline">{word}</span>
            <MotionSpan className="next-chapter-fill"
              style={reduceMotion ? { clipPath: 'none' } : { clipPath }}>
              {word}
            </MotionSpan>
          </MotionSpan>
        ))}
      </h2>
      <MotionAnchor href="#contact" className="next-chapter-link"
        style={reduceMotion ? {} : { opacity, y }}>
        Let’s build it together.
        <ArrowDown size={23} strokeWidth={1.25} aria-hidden="true" />
      </MotionAnchor>
      </div>
      </div>
    </section>
  );
}
