export default function Nav() {
  return (
    <header className="nav mono">
      <a href="#top" className="nav-name">
        p·n·p
      </a>
      <nav className="nav-links" aria-label="sections">
        <a href="#about">about</a>
        <a href="#work">work</a>
        <a href="#log">career</a>
        <a href="#craft">craft</a>
        <a href="#contact">contact</a>
      </nav>
    </header>
  );
}
