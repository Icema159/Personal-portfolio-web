import { useEffect, useRef } from "react";
import { BrainCircuit, Code2, GitPullRequest, Layers3 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SiCloudflare, SiDocker, SiExpress, SiGithub, SiJavascript, SiNodedotjs, SiPostgresql, SiPostman, SiPrisma, SiReact, SiRedis, SiTailwindcss, SiTypescript, SiVite, SiZod } from "react-icons/si";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const toolkit = [
    [SiReact, "React"], [SiTypescript, "TypeScript"], [SiJavascript, "JavaScript"], [SiVite, "Vite"],
    [SiTailwindcss, "Tailwind CSS"], [SiNodedotjs, "Node.js"], [SiExpress, "Express"], [SiPostgresql, "PostgreSQL"],
    [SiPrisma, "Prisma"], [SiRedis, "Redis"], [SiZod, "Zod"], [SiDocker, "Docker"],
    [SiCloudflare, "Cloudflare"], [SiGithub, "GitHub"], [SiPostman, "Postman"], [BrainCircuit, "AI & RAG"],
];

function ScrollToneText({ children, className = "" }) {
    const ref = useRef(null);
    const words = children.split(" ");

    useEffect(() => {
        const element = ref.current;
        if (!element) return undefined;
        const spans = [...element.querySelectorAll("span")];
        const update = () => {
            const rect = element.getBoundingClientRect();
            const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.78 - rect.top) / (rect.height + window.innerHeight * 0.24)));
            spans.forEach((span, index) => {
                const wordProgress = Math.max(0, Math.min(1, progress * (spans.length + 5) - index));
                span.style.color = `rgba(246,244,240,${0.17 + wordProgress * 0.83})`;
            });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return <p ref={ref} className={`scroll-tone-text ${className}`}>{words.map((word, index) => <span key={`${word}-${index}`}>{word}{index < words.length - 1 ? " " : ""}</span>)}</p>;
}

const focusCards = [
    { number: "01", title: "Product Engineering", description: "Building and deploying complete applications across interface, API and data layers.", icon: Code2 },
    { number: "02", title: "Backend & Data", description: "Authentication, REST APIs, PostgreSQL, queues and owner-scoped data access.", icon: Layers3 },
    { number: "03", title: "AI Retrieval", description: "Grounded document answers with RAG, embeddings, vector search and source citations.", icon: BrainCircuit },
    { number: "04", title: "Team & Ownership", description: "Nine years of military leadership plus collaborative GitHub, Jira and Scrum workflows.", icon: GitPullRequest },
];

const experience = [
    { role: "Personal Trainer", organization: "Gym Plius Lietuva", period: "Jan 2024 - Present", detail: "Design individualized strength and performance programs, define measurable goals and adapt plans from results." },
    { role: "Professional Soldier / Squad Leader", organization: "Lithuanian Armed Forces", period: "Jan 2015 - Jan 2024", detail: "Led and trained conscripts while coordinating teams in structured, high-pressure environments." },
];

const education = [
    { course: "Junior Programmer Program", school: "TECHIN", period: "Sep 2025 - Jun 2026" },
    { course: "Bachelor's Degree in Training Systems", school: "Lithuanian Sports University", period: "2018 - 2023" },
];

export default function About() {
    const reduceMotion = useReducedMotion();

    return (
        <section id="about" className="section about-section">
            <div className="section-heading">
                <div className="eyebrow"><span>02</span> Profile</div>
                <h2>Full-stack capability.<br /><span>Real-world discipline.</span></h2>
            </div>

            <div className="about-grid">
                <div className="about-story">
                    <ScrollToneText className="about-lead">I build production-minded software from interface to infrastructure.</ScrollToneText>
                    <ScrollToneText>My hands-on project work spans solo and team applications with authentication, REST APIs, background processing, vector search and AI-powered document retrieval.</ScrollToneText>
                    <ScrollToneText>Nine years of military leadership and client-facing coaching shaped how I work: strong ownership, calm communication, measurable goals and the discipline to carry a problem through to a dependable result.</ScrollToneText>
                </div>

                <MotionDiv className="focus-grid" initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}>
                    {focusCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <MotionArticle key={card.title} className="focus-card" variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}>
                                <div className="focus-card-top"><span>{card.number}</span><Icon size={20} /></div>
                                <h3>{card.title}</h3><p>{card.description}</p>
                            </MotionArticle>
                        );
                    })}
                </MotionDiv>
            </div>

            <div className="stack-panel">
                <span className="stack-title">Technical toolkit</span>
                <div className="toolkit-marquee" aria-label="Technical toolkit">
                    <div className="toolkit-track">
                        {[...toolkit, ...toolkit].map((tool, index) => {
                            const ToolkitIcon = tool[0];
                            const label = tool[1];
                            return <span className="toolkit-icon" key={`${label}-${index}`} title={label} aria-hidden={index >= toolkit.length}><ToolkitIcon /></span>;
                        })}
                    </div>
                </div>
            </div>

            <div className="profile-details">
                <div className="experience-intro"><div className="profile-kicker">The journey</div><h2>Built on <br />discipline. <br /><span>Driven by <br />curiosity.</span></h2><p>Leadership, coaching and a new chapter in software development.</p></div>
                <div className="experience-content">
                    <div className="profile-column">
                        <div className="profile-kicker">Experience</div>
                        {experience.map((item) => (
                            <article className="timeline-item" key={item.role}>
                                <span className="timeline-period">{item.period}</span>
                                <h3>{item.role}</h3>
                                <strong>{item.organization}</strong>
                                <p>{item.detail}</p>
                            </article>
                        ))}
                    </div>

                    <div className="profile-column">
                        <div className="profile-kicker">Education</div>
                        {education.map((item) => (
                            <article className="education-item" key={item.course}>
                                <span>{item.period}</span>
                                <h3>{item.course}</h3>
                                <p>{item.school}</p>
                            </article>
                        ))}
                        <div className="language-block">
                            <div className="profile-kicker">Languages</div>
                            <div className="language-list"><span>Lithuanian <b>Native</b></span><span>English <b>Fluent</b></span><span>Russian <b>Fluent</b></span></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
