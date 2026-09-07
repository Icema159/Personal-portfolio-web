import { useEffect, useRef, useState } from "react";

const links = [
    { href: "#home", label: "Home", section: "home" },
    { href: "#projects", label: "Work", section: "projects" },
    { href: "#about", label: "About", section: "about" },
    { href: "#contact", label: "Contact", section: "contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const menuButtonRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        const updateScrollState = () => setIsScrolled(window.scrollY > 72);
        updateScrollState();
        window.addEventListener("scroll", updateScrollState, { passive: true });
        return () => window.removeEventListener("scroll", updateScrollState);
    }, []);

    useEffect(() => {
        const sections = links.map((link) => document.getElementById(link.section)).filter(Boolean);
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActiveSection(visible.target.id);
        }, { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] });
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const closeOnEscape = (event) => {
            if (event.key === "Escape") setIsOpen(false);
            if (event.key !== "Tab" || !isOpen || !overlayRef.current) return;
            const focusable = [...overlayRef.current.querySelectorAll("a[href], button:not([disabled])")];
            const first = focusable[0];
            const last = focusable.at(-1);
            if (!first || !last) return;
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = "";
            return undefined;
        }
        const previousOverflow = document.body.style.overflow;
        const menuButton = menuButtonRef.current;
        document.body.style.overflow = "hidden";
        const firstLink = overlayRef.current?.querySelector("a");
        requestAnimationFrame(() => firstLink?.focus());
        return () => {
            document.body.style.overflow = previousOverflow;
            menuButton?.focus();
        };
    }, [isOpen]);

    const selectLink = (section) => {
        setActiveSection(section);
        setIsOpen(false);
    };

    return (
        <header className={`nav-wrap ${isScrolled ? "is-scrolled" : "is-hero"} ${isOpen ? "menu-open" : ""}`}>
            <nav className="liquid-nav" aria-label="Primary navigation">
                <button
                    ref={menuButtonRef}
                    type="button"
                    onClick={() => setIsOpen((value) => !value)}
                    className="menu-toggle"
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    aria-controls="site-navigation-overlay"
                >
                    <span className="menu-toggle-bars" aria-hidden="true"><i /><i /><i /></span>
                </button>
            </nav>
            <div className="hero-navigation" aria-label="Hero navigation">
                {links.map((link) => <a key={link.href} href={link.href} onClick={() => selectLink(link.section)} className={activeSection === link.section ? "is-active" : ""} aria-current={activeSection === link.section ? "page" : undefined}>{link.label}</a>)}
            </div>
            <div id="site-navigation-overlay" ref={overlayRef} className="navigation-overlay" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!isOpen}>
                <p className="overlay-label">Navigation</p>
                <div className="overlay-links">
                    {links.map((link) => <a key={link.href} href={link.href} onClick={() => selectLink(link.section)} className={activeSection === link.section ? "is-active" : ""} aria-current={activeSection === link.section ? "page" : undefined}><span>{link.label}</span></a>)}
                </div>
            </div>
        </header>
    );
}
