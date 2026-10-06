import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const isOverdue = (task) =>
  task.status === "Pending" && new Date(task.deadline) < new Date(new Date().toDateString());

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", subject: "", priority: "", status: "" });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    const res = await api.get("/tasks", { params });
    setTasks(res.data);
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleComplete = async (task) => {
    await api.put(`/tasks/${task._id}`, { status: task.status === "Completed" ? "Pending" : "Completed" });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const subjects = [...new Set(tasks.map((t) => t.subject).filter(Boolean))];

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>My Tasks</h2>
        <Link to="/tasks/new" className="btn btn-primary">+ Add Task</Link>
      </div>

      <div className="card" style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          name="search"
          placeholder="Search by title..."
          value={filters.search}
          onChange={handleFilterChange}
          style={{ flex: 2, minWidth: 180, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8 }}
        />
        <select name="subject" value={filters.subject} onChange={handleFilterChange} style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8 }}>
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="priority" value={filters.priority} onChange={handleFilterChange} style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8 }}>
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8 }}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", color: "var(--muted)" }}>
          No tasks match your filters yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tasks.map((task) => (
            <div key={task._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{task.title}</h3>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                  {isOverdue(task) ? (
                    <span className="badge badge-overdue">Overdue</span>
                  ) : (
                    <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
                  )}
                </div>
                {task.description && <p style={{ color: "var(--muted)", fontSize: 14, margin: "6px 0" }}>{task.description}</p>}
                <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                  {task.subject || "General"} · Due {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button className="btn btn-success" onClick={() => handleComplete(task)}>
                  {task.status === "Completed" ? "Mark Pending" : "Complete"}
                </button>
                <Link to={`/tasks/${task._id}/edit`} className="btn btn-outline">Edit</Link>
                <button className="btn btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
