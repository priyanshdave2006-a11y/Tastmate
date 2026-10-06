import React from "react";
import { Link } from "react-router-dom";

const features = [
  { title: "Add & Organize Tasks", desc: "Create assignments with subject, deadline and priority in seconds." },
  { title: "Track Deadlines", desc: "Overdue tasks are flagged automatically so nothing slips through." },
  { title: "Progress Dashboard", desc: "See total, pending, completed and overdue tasks at a glance." },
  { title: "Search & Filter", desc: "Find any task instantly by subject, priority or status." },
  { title: "Secure Login", desc: "Your tasks are private, protected with JWT authentication." },
  { title: "Simple & Fast", desc: "A clean interface built for students, not project managers." },
];

const Home = () => {
  return (
    <div>
      <section style={{ padding: "80px 0 60px", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: 40, color: "var(--ink)" }}>
            Keep every assignment <span style={{ color: "var(--primary)" }}>under control.</span>
          </h1>
          <p style={{ maxWidth: 560, margin: "16px auto 32px", color: "var(--muted)", fontSize: 16, lineHeight: 1.6 }}>
            TaskMate is a simple task and assignment manager built for students —
            add your assignments, set deadlines and priorities, and track your
            progress from one clean dashboard.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: "12px 28px" }}>Get Started</Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: "12px 28px" }}>Login</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 0 80px" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: 32 }}>What you can do with TaskMate</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card">
                <h3 style={{ fontSize: 16 }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
