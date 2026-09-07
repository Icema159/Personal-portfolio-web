import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
const MotionDiv = motion.div;
export default function Hero() {
 const ref = useRef(null);
 const reduce = useReducedMotion();
 const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
 const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
 const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
 return <section ref={ref} id="home" className="editorial-hero">
  <MotionDiv className="hero-center" style={reduce ? {} : { y, opacity }}>
   <p className="hero-role">Junior full-stack developer</p>
   <div className="name-stage"><img className="hero-knot" src={`${import.meta.env.BASE_URL}assets/hero-knot.png`} alt="" fetchPriority="high"/><h1><span>AISMANTAS</span><span>SKINULIS</span></h1></div>
   <div className="hero-location">BASED IN KAUNAS, LITHUANIA</div>
   <p className="hero-summary">Thoughtful interfaces. Reliable systems.<br/>From the first component to production.</p>
   <div className="hero-actions"><a href="#projects" className="button button-primary">View projects <ArrowDown size={16}/></a><a href={`${import.meta.env.BASE_URL}Aismantas_Skinulis_CV.pdf`} className="button button-glass" target="_blank" rel="noopener noreferrer">Download CV <ArrowUpRight size={16}/></a></div>
  </MotionDiv>
  <div className="editorial-hero-footer"><span>REACT · TYPESCRIPT · NODE.JS · POSTGRESQL</span><a href="#projects">Scroll to explore <ArrowDown size={14}/></a><span>PORTFOLIO / 2026</span></div>
 </section>;
}
