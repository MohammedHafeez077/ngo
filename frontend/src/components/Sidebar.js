import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Overview" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/donations", label: "Donations" },
  { to: "/volunteers", label: "Volunteers" },
  { to: "/profile", label: "Profile" }
];

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <span>{user?.role || "team"}</span>
        <strong>{user?.name || "Mohammed Hafeez"}</strong>
      </div>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to}>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
