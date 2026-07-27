export default function Nav() {
  return (
    <header className="nav mono">
      <a href="#top" className="nav-name">
        p·n·p
      </a>
      <nav className="nav-links" aria-label="sections">
        <a href="#work">work</a>
        <a href="#log">timeline</a>
        <a href="#about">about</a>
        <a href="#contact">contact</a>
      </nav>
    </header>
  );
}
