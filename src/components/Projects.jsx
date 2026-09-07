import { ArrowUpRight, BrainCircuit, Dumbbell, Github, LayoutDashboard, Layers3, MonitorSmartphone, Palette, Users } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const projects = [
    {
        title: "Developer Knowledge Hub", status: "Live production", category: "AI knowledge platform · 2026", icon: BrainCircuit,
        description: "Full-stack SaaS platform for securely uploading private PDFs and querying them through semantic search, with streamed AI answers and persistent source citations.",
        contribution: "Built owner-scoped sessions and email verification, private R2 storage, PostgreSQL/pgvector retrieval and Redis/BullMQ ingestion workers; deployed the web, API and workers on Railway.",
        tags: ["React", "TypeScript", "Express", "PostgreSQL", "Prisma", "pgvector", "Redis", "BullMQ", "OpenAI"], live: "https://devhub.men",
    },
    {
        title: "FitBook Team Project", status: "Team Project", category: "Full-stack product", icon: Users,
        description: "Full-stack team project built with React, Node.js, Express and PostgreSQL. Focused on authentication, validation, database structure, REST API architecture and collaborative GitHub workflow.",
        contribution: "PostgreSQL/Docker setup, validation middleware, auth structure, pull requests and Jira/Scrum workflow.",
        tags: ["React", "Node.js", "Express", "PostgreSQL", "Docker", "Zod"], github: "https://github.com/AugustinaCodes/pavasario-projektas-js",
    },
    {
        title: "Workout Tracker App", status: "In progress", category: "Mobile product", icon: Dumbbell,
        description: "Mobile fitness tracking app focused on workout creation, exercise tracking, progress statistics and future AI-powered workout analysis. It connects my personal training background with software development.",
        tags: ["React Native", "Expo", "TypeScript", "AsyncStorage"], github: "https://github.com/Icema159/workout-tracker",
    },
    {
        title: "AriArt Website", category: "Client website", icon: Palette,
        description: "Real-world business website focused on responsive layout, clean UI, service presentation and production deployment.",
        tags: ["React", "JavaScript", "Tailwind CSS", "Responsive UI"], live: "https://www.ariart.lt/", github: "https://github.com/Icema159/ariart",
    },
    {
        title: "Personal Portfolio Page", category: "Personal brand", icon: LayoutDashboard,
        description: "My personal developer portfolio built with React, Vite and Tailwind CSS to present projects, skills and developer profile.",
        tags: ["React", "Vite", "Tailwind CSS", "GitHub Pages"], live: "https://icema159.github.io/Personal-portfolio-page/", github: "https://github.com/Icema159/Personal-portfolio-page",
    },
    {
        title: "PayAPI Multi-page Website", status: "Team Project", category: "Frontend build", icon: Layers3,
        description: "Frontend team project focused on responsive multi-page layout, clean component structure and collaborative Git workflow.",
        tags: ["HTML", "CSS", "JavaScript", "Responsive Design", "Git"], github: "https://github.com/h4kazz/PayAPI-multi-page-website",
    },
    {
        title: "Tricking Site", category: "Community concept", icon: MonitorSmartphone,
        description: "Sports community concept website built with React, focused on visual presentation and responsive layout.",
        tags: ["React", "JavaScript", "Tailwind CSS"], live: "https://icema159.github.io/tricking-site/", github: "https://github.com/Icema159/tricking-site",
    },
];

export default function Projects() {
    const reduceMotion = useReducedMotion();
    return (
        <section id="projects" className="section projects-section">
            <div className="projects-heading">
                <div className="section-heading"><div className="eyebrow"><span>03</span> Selected work</div><h2>Projects built to<br /><span>solve real problems.</span></h2></div>
                <a className="text-link" href="https://github.com/Icema159" target="_blank" rel="noopener noreferrer">All repositories <ArrowUpRight size={16} /></a>
            </div>
            <MotionDiv className="project-grid" initial={reduceMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
                {projects.map((project, index) => {
                    const Icon = project.icon;
                    return (
                        <MotionArticle key={project.title} className={`project-card ${index < 2 ? "project-featured" : ""}`} variants={reduceMotion ? {} : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
                            <div className="project-visual">
                                <span className="project-number">0{index + 1}</span>
                                <div className="project-icon"><Icon size={index < 2 ? 38 : 30} strokeWidth={1.35} /></div>
                                <span className="project-category">{project.category}</span>
                            </div>
                            <div className="project-body">
                                <div className="project-title-row">
                                    <div>{project.status && <span className="project-status">{project.status}</span>}<h3>{project.title}</h3></div>
                                    <div className="project-links">
                                        {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} live site`}><ArrowUpRight size={19} /></a>}
                                        {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} on GitHub`}><Github size={18} /></a>}
                                    </div>
                                </div>
                                <p>{project.description}</p>
                                {project.contribution && <p className="project-contribution"><strong>My contribution</strong> — {project.contribution}</p>}
                                <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                            </div>
                        </MotionArticle>
                    );
                })}
            </MotionDiv>
        </section>
    );
}
