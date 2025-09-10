import React, { useState, useEffect } from "react";
import API from "../api";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null); // which todo is being edited
  const [editFields, setEditFields] = useState({ title: "", description: "" });

  const fetchTodos = async () => {
    const res = await API.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await API.post("/todos", { title, description });
    setTitle("");
    setDescription("");
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await API.delete(`/todos/${id}`);
    fetchTodos();
  };

  const handleToggle = async (todo) => {
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    await API.put(`/todos/${todo.id}`, {
      title: todo.title,
      description: todo.description,
      status: newStatus,
    });
    fetchTodos();
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditFields({ title: todo.title, description: todo.description });
  };

  const handleChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (id) => {
    await API.put(`/todos/${id}`, {
      ...editFields,
      status: todos.find((t) => t.id === id).status,
    });
    setEditingId(null);
    setEditFields({ title: "", description: "" });
    fetchTodos();
  };

  const containerStyle = {
    padding: "2rem",
    maxWidth: "600px",
    margin: "2rem auto",
    background: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
  };

  const inputStyle = {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const buttonStyle = (bg) => ({
    padding: "0.3rem 0.5rem",
    borderRadius: "6px",
    border: "none",
    background: bg,
    color: "#fff",
    cursor: "pointer",
    marginLeft: "0.5rem",
  });

  return (
    <div style={containerStyle}>
      <h2>My Todos</h2>
      <form onSubmit={handleAdd} style={formStyle}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ marginTop: "1rem" }}>
        {todos.map((t) => (
          <li key={t.id} style={{ marginBottom: "0.5rem" }}>
            {editingId === t.id ? (
              <>
                <input
                  style={{ ...inputStyle, width: "45%", marginRight: "0.5rem" }}
                  value={editFields.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
                <input
                  style={{ ...inputStyle, width: "45%" }}
                  value={editFields.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                <button
                  style={buttonStyle("#4caf50")}
                  onClick={() => handleUpdate(t.id)}
                >
                  Save
                </button>
                <button
                  style={buttonStyle("#f44336")}
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <strong>{t.title}</strong> - {t.description} ({t.status})
                <button
                  style={buttonStyle("#2196f3")}
                  onClick={() => handleToggle(t)}
                >
                  {t.status === "pending" ? "Mark Completed" : "Mark Pending"}
                </button>
                <button
                  style={buttonStyle("#ff9800")}
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </button>
                <button
                  style={buttonStyle("#f44336")}
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
