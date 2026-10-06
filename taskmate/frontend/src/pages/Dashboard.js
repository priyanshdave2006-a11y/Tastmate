import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, color }) => (
  <div className="card" style={{ borderTop: `3px solid ${color}` }}>
    <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>{label}</p>
    <h2 style={{ fontSize: 32, margin: "6px 0 0" }}>{value}</h2>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/tasks/stats/summary");
        setStats(res.data);
      } catch (err) {
        setError("Could not load dashboard statistics.");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h2>Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
      <p style={{ color: "var(--muted)", marginBottom: 28 }}>Here's a snapshot of your assignments.</p>

      {error && <p className="error-text">{error}</p>}

      {stats && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
            <StatCard label="Total Tasks" value={stats.totalTasks} color="var(--primary)" />
            <StatCard label="Pending" value={stats.pendingTasks} color="var(--medium)" />
            <StatCard label="Completed" value={stats.completedTasks} color="var(--success)" />
            <StatCard label="Overdue" value={stats.overdueTasks} color="var(--danger)" />
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Recent Tasks</h3>
              <Link to="/tasks" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>View all →</Link>
            </div>
            {stats.recentTasks.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>
                No tasks yet. <Link to="/tasks/new" style={{ color: "var(--primary)" }}>Add your first task</Link>.
              </p>
            ) : (
              stats.recentTasks.map((task) => (
                <div key={task._id} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{task.title}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>{task.subject}</p>
                  </div>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
