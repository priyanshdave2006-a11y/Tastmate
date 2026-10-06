import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users/profile").then((res) => {
      setProfile(res.data);
      setName(res.data.user.name);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.put("/users/profile", { name });
      setMessage("Profile updated successfully.");
      const updatedUser = { ...res.data.user };
      localStorage.setItem("taskmate_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setError("Could not update profile.");
    }
  };

  if (!profile) return <div className="container" style={{ paddingTop: 40 }}>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: 480, paddingTop: 40, paddingBottom: 60 }}>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2>My Profile</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Account Email: {profile.user.email}</p>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Member since: {new Date(profile.user.createdAt).toLocaleDateString()}
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          <div>
            <strong style={{ fontSize: 20 }}>{profile.stats.totalTasks}</strong>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Total Tasks</p>
          </div>
          <div>
            <strong style={{ fontSize: 20 }}>{profile.stats.completedTasks}</strong>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>Completed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Edit Name</h3>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {message && <p style={{ color: "var(--success)", fontSize: 13 }}>{message}</p>}
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" style={{ padding: "10px 20px" }}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
