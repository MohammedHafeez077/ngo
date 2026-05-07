import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import api from "../services/api";

const fallbackCredentials = [
  { name: "Mohammed Hafeez", title: "Owner & Executive Director", email: "admin@sevafoundation.test", password: "admin123", role: "admin" },
  { name: "Amaan Khan", title: "Program Manager", email: "manager@sevafoundation.test", password: "manager123", role: "staff" },
  { name: "Sana Ahmed", title: "Field Volunteer", email: "volunteer@sevafoundation.test", password: "volunteer123", role: "volunteer" }
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState(fallbackCredentials);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/demo-credentials").then((res) => setCredentials(res.data)).catch(() => {});
  }, []);

  const fillAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const login = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in");
    }
  };

  return (
    <main className="auth-page designed-auth">
      <PublicNav />
      <section className="auth-layout">
        <div className="login-panel">
          <span className="eyebrow">Secure team access</span>
          <h1>Sign in to coordinate impact</h1>
          <p>Type your email and password manually, or choose a demo role to fill the form.</p>
          <div className="credential-grid">
            {credentials.map((account) => (
              <button className="credential-card" type="button" key={account.email} onClick={() => fillAccount(account)}>
                <strong>{account.name}</strong>
                <span>{account.title || account.role}</span>
                <small>{account.email}</small>
              </button>
            ))}
          </div>
        </div>
        <form className="auth-card" onSubmit={login}>
          <h2>Team Login</h2>
          {error && <div className="error">{error}</div>}
          <label>
            Email
            <input
              value={email}
              placeholder="Enter email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Login</button>
          <Link to="/register">Create volunteer account</Link>
        </form>
      </section>
    </main>
  );
}
