import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ title, eyebrow, actions, children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="content">
          <div className="page-heading">
            <div>
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
              {title && <h1>{title}</h1>}
            </div>
            {actions && <div className="heading-actions">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
