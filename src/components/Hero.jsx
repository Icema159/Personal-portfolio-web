import { ArrowDownRight, ArrowUpRight, FileDown, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;

function ChromeMark() {
    return (
        <div className="chrome-stage" aria-hidden="true">
            <div className="chrome-orbit chrome-orbit-one" />
            <div className="chrome-orbit chrome-orbit-two" />
            <div className="chrome-mark"><span>AS</span></div>
            <span className="chrome-caption">DESIGN × ENGINEERING</span>
        </div>
    );
}

export default function Hero() {
    const reduceMotion = useReducedMotion();
    const cvPath = `${import.meta.env.BASE_URL}Aismantas_Skinulis_CV.pdf`;
    const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } };

    return (
        <section id="home" className="hero-section">
            <div className="hero-grid">
                <MotionDiv {...reveal} transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }} className="hero-copy">
                    <div className="eyebrow"><span>01</span> Portfolio · 2026</div>
                    <h1>Full-stack products.<br /><span>Built with clarity.</span></h1>
                    <p className="hero-intro">
                        I&apos;m <strong>Aismantas Skinulis</strong>, a junior full-stack developer building and deploying React, TypeScript, Node.js and PostgreSQL applications - from polished interfaces to APIs, background workers and AI-powered retrieval.
                    </p>
                    <div className="hero-actions">
                        <a href="#projects" className="button button-primary">Explore projects <ArrowDownRight size={17} /></a>
                        <a href="#contact" className="button button-glass">Let&apos;s talk <Mail size={16} /></a>
                    </div>
                    <div className="hero-meta" aria-label="Technology focus">
                        <span>React</span><i /><span>TypeScript</span><i /><span>Node.js</span><i /><span>PostgreSQL</span>
                    </div>
                </MotionDiv>
                <MotionDiv
                    {...(reduceMotion ? {} : { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 } })}
                    transition={{ duration: 1, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    className="hero-art"
                >
                    <ChromeMark />
                </MotionDiv>
            </div>
            <div className="hero-footer">
                <a href="https://github.com/Icema159" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} /></a>
                <a href={cvPath} target="_blank" rel="noopener noreferrer">Curriculum vitae <FileDown size={14} /></a>
                <a href="#about" className="scroll-cue">Scroll to discover <ArrowDownRight size={15} /></a>
            </div>
        </section>
    );
}
