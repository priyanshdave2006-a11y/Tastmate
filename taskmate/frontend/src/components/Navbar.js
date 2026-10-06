import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  nav: {
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "14px 0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 20, color: "var(--primary)" },
  links: { display: "flex", gap: 20, alignItems: "center" },
  link: { fontSize: 14, fontWeight: 500, color: "var(--ink)" },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>TaskMate</Link>
        <div style={styles.links}>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <Link to="/tasks" style={styles.link}>My Tasks</Link>
              <Link to="/tasks/new" style={styles.link}>Add Task</Link>
              <Link to="/profile" style={styles.link}>Profile</Link>
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
