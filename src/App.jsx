import Navbar from "./components/Navbar";
import Hero from "./components/EditorialHero";
import About from "./components/About";
import Projects from "./components/EditorialProjects";
import NextChapter from "./components/NextChapter";
import Contact from "./components/Contact";
import LiquidCursor from "./components/LiquidCursor";
import ScrollMotion from "./components/ScrollMotion";

function App() {
  return (
    <div className="site-shell">
      <div className="site-content">
        <LiquidCursor />
        <ScrollMotion />
        <Navbar />
        <main>
          <div className="intro-chapters"><Hero /><Projects /></div>
          <About />
          <NextChapter />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;
