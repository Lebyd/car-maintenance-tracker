import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "owner",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiClient.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in name and email.");
      return;
    }

    try {
      await apiClient.post("/users", formData);
      setSuccess("User added successfully.");
      setFormData({
        name: "",
        email: "",
        role: "owner",
      });
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
          err.response?.data?.message ||
          "Failed to add user."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setError("");
    setSuccess("");

    try {
      await apiClient.delete(`/users/${id}`);
      setSuccess("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="container">
      <h1>Users</h1>

      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add User Form */}
      <section className="card">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>
              Name*:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Email*:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Role:
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="owner">Owner</option>
                <option value="mechanic">Mechanic</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>

          <button type="submit" className="btn-primary">
            Save User
          </button>
        </form>
      </section>

      {/* Users List */}
      <section className="card">
        <h2>All Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found. Add one above.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default UsersPage;
