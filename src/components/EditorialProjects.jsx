import { useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion";
import { projects } from "./projectData";
const MotionDiv = motion.div;
const ordered = [projects[0], projects[1], projects[3], projects[2], ...projects.slice(4)];
const images = { "Developer Knowledge Hub": "devhub.png", "AriArt Website": "ariart.png", "FitBook Team Project": "fitbook.png", "Workout Tracker App": "workout-track.PNG", "Tricking Site": "tricking.png" };
export default function EditorialProjects() {
 const [expanded, setExpanded] = useState(null);
 const [hovered, setHovered] = useState(null);
 const [all, setAll] = useState(false);
 const reduce = useReducedMotion();
 const x = useMotionValue(0), y = useMotionValue(0);
 const springX = useSpring(x, { stiffness: 200, damping: 28 }), springY = useSpring(y, { stiffness: 200, damping: 28 });
 const active = hovered === null ? null : ordered[hovered];
 const track = event => { x.set(Math.min(event.clientX + 22, window.innerWidth - 390)); y.set(Math.max(90, Math.min(event.clientY - 110, window.innerHeight - 260))); };
 return <section id="projects" className="editorial-work"><div className="work-inner">
  <div className="work-heading"><h2>SELECTED WORK</h2><p>A selection of things I&apos;ve built.<br/>Independent projects & shared ambition.</p></div>
  <div className="work-list" onPointerMove={track} onPointerLeave={() => setHovered(null)}>
  {(all ? ordered : ordered.slice(0,4)).map((project,index) => <article className="work-item" key={project.title}>
   <button className="work-row" aria-expanded={expanded === index} aria-controls={`project-detail-${index}`} onClick={() => { setExpanded(expanded === index ? null : index); setHovered(null); }} onPointerEnter={event => { if(event.pointerType === "mouse") { track(event); springX.jump(x.get()); springY.jump(y.get()); setHovered(index); } }} onFocus={() => setHovered(null)}>
    <span className="work-index">0{index+1}</span><span className="work-title">{index===0 ? "DevHub" : project.title.replace(" Team Project", "").replace(" Website", "")}</span><span className="work-category">{project.category}</span>{expanded===index ? <Minus size={20}/> : <Plus size={20}/>}</button>
   <div id={`project-detail-${index}`} className="work-detail" hidden={expanded!==index}>
    {images[project.title] && <img className={project.title === "Workout Tracker App" ? "work-preview-mobile" : undefined} src={`${import.meta.env.BASE_URL}assets/${images[project.title]}`} alt={`${project.title} interface preview`} loading="lazy"/>}
    <div><p>{project.description}</p>{project.contribution && <p><strong>My contribution.</strong> {project.contribution}</p>}<div className="work-tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="work-actions">{project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Visit website <ArrowUpRight size={16}/></a>}{project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">View source <ArrowUpRight size={16}/></a>}</div></div>
   </div></article>)}
  </div>
  <button className="all-work" onClick={() => { setAll(!all); setHovered(null); if(all && expanded>3) setExpanded(null); }}>{all ? "Show selected projects" : `All projects (${ordered.length.toString().padStart(2,"0")})`} {all ? <Minus size={16}/> : <Plus size={16}/>}</button><p className="work-footnote">Built with curiosity. Shipped with care.</p>
 </div>{active && !reduce && <MotionDiv className="floating-preview" aria-hidden="true" style={{x:springX,y:springY}}>{images[active.title] ? <img className={active.title === "Workout Tracker App" ? "work-preview-mobile" : undefined} src={`${import.meta.env.BASE_URL}assets/${images[active.title]}`} alt=""/> : <div className="preview-description"><span>{active.category}</span><strong>{active.title}</strong><p>{active.tags.slice(0,4).join(" / ")}</p></div>}<span className="preview-label">Explore project <ArrowUpRight size={14}/></span></MotionDiv>}</section>;
}
