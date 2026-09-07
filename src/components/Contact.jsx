import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

export default function Contact() {
    const cvPath = `${import.meta.env.BASE_URL}Aismantas_Skinulis_CV.pdf`;
    return (
        <footer id="contact" className="section contact-section">
            <div className="contact-panel">
                <div className="eyebrow"><span>04</span> Contact</div>
                <h2>Have a challenge?<br /><span>Let&apos;s make it tangible.</span></h2>
                <p>I&apos;m open to junior full-stack and web development opportunities where I can take ownership, contribute to production work and keep growing alongside an experienced team.</p>
                <div className="contact-actions">
                    <a href="mailto:aismantass@gmail.com" className="button button-primary">Say hello <Mail size={17} /></a>
                    <a href={cvPath} target="_blank" rel="noopener noreferrer" className="button button-glass">View CV <ArrowUpRight size={16} /></a>
                </div>
            </div>
            <div className="footer-row">
                <span>© 2026 Aismantas Skinulis</span>
                <span className="footer-note">Built with React · Kaunas, Lithuania</span>
                <div className="social-links">
                    <a href="https://github.com/Icema159" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Github size={19} /></a>
                    <a href="https://www.linkedin.com/in/aismantas-skinulis-202bb8366/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><Linkedin size={19} /></a>
                </div>
            </div>
        </footer>
    );
}
