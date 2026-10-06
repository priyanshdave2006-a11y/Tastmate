import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

// This single component handles BOTH "Add Task" (/tasks/new)
// and "Edit Task" (/tasks/:id/edit) — if an id is present in the
// URL, we load that task's data first.
const TaskForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    deadline: "",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      api.get(`/tasks/${id}`).then((res) => {
        const t = res.data;
        setForm({
          title: t.title,
          description: t.description || "",
          subject: t.subject || "",
          deadline: t.deadline ? t.deadline.substring(0, 10) : "",
          priority: t.priority,
        });
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.deadline) {
      setError("Title and deadline are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (isEditMode) {
        await api.put(`/tasks/${id}`, form);
      } else {
        await api.post("/tasks", form);
      }
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520, paddingTop: 40, paddingBottom: 60 }}>
      <div className="card">
        <h2>{isEditMode ? "Edit Task" : "Add New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Submit DBMS assignment" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Optional details" />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Database Management" />
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Deadline</label>
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" style={{ width: "100%", padding: 12 }} disabled={loading}>
            {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
