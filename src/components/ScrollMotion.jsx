import { useEffect } from 'react';
export default function ScrollMotion() {
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const nodes=[...document.querySelectorAll('.work-heading, .work-item, .about-section .section-heading, .about-story p, .stack-group, .timeline-item, .education-item, .contact-panel > *')];
  const setup=()=>{
   observer?.disconnect();nodes.forEach(el=>el.classList.remove('reveal-pending'));
   if(preference.matches)return;
   observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');observer.unobserve(entry.target);}}),{threshold:.08});
   nodes.forEach((el,i)=>{if(el.getBoundingClientRect().top>innerHeight){el.style.setProperty('--reveal-delay',`${(i%3)*60}ms`);el.classList.add('reveal-pending');observer.observe(el);}});
  };
  nodes.forEach(el=>el.classList.add('scroll-reveal'));setup();preference.addEventListener('change',setup);
  return()=>{observer?.disconnect();preference.removeEventListener('change',setup);nodes.forEach(el=>el.classList.remove('scroll-reveal','reveal-pending'));};
 },[]);
 return null;
}
