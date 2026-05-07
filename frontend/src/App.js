import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Campaigns from "./pages/Campaigns";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Volunteers from "./pages/Volunteers";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/campaigns" element={<RequireAuth><Campaigns /></RequireAuth>} />
        <Route path="/donations" element={<RequireAuth><Donations /></RequireAuth>} />
        <Route path="/volunteers" element={<RequireAuth><Volunteers /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
