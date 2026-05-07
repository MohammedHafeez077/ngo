import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/dashboard">
        <span className="brand-mark">S</span>
        Seva Foundation
      </Link>
      <div className="nav-user">
        <span>{user?.name || "Mohammed Hafeez"}</span>
        <small>{user?.title || user?.role || "NGO Portal"}</small>
      </div>
      <button className="secondary" onClick={logout}>Logout</button>
    </header>
  );
}
