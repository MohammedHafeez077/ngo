import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicNav from "../components/PublicNav";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "volunteer" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const register = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  };

  return (
    <main className="auth-page designed-auth">
      <PublicNav />
      <form className="auth-card wide-auth" onSubmit={register}>
        <span className="eyebrow">Join the team</span>
        <h1>Create Volunteer Account</h1>
        {error && <div className="error">{error}</div>}
        <label>Name<input name="name" value={form.name} onChange={updateField} /></label>
        <label>Email<input name="email" value={form.email} onChange={updateField} /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={updateField} /></label>
        <button type="submit">Register</button>
        <Link to="/login">Back to login</Link>
      </form>
    </main>
  );
}
