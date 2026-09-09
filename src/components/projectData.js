import { BrainCircuit, Dumbbell, MonitorSmartphone, Palette, Users } from 'lucide-react';
export const projects = [
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
        title: "Tricking Site", category: "Community concept", icon: MonitorSmartphone,
        description: "Sports community concept website built with React, focused on visual presentation and responsive layout.",
        tags: ["React", "JavaScript", "Tailwind CSS"], live: "https://icema159.github.io/tricking-site/", github: "https://github.com/Icema159/tricking-site",
    },
];
