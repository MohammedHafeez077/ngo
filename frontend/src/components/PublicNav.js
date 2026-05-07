import { Link } from "react-router-dom";

export default function PublicNav() {
  return (
    <header className="public-nav">
      <Link className="brand" to="/">
        <span className="brand-mark">S</span>
        Seva Foundation
      </Link>
      <nav>
        <a href="#programs">Programs</a>
        <a href="#impact">Impact</a>
        <a href="#stories">Stories</a>
        <Link to="/login">Team Login</Link>
      </nav>
    </header>
  );
}
