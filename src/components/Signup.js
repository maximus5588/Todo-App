import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/signup", { username, email, password });
      onSignup(res.data.token);
      navigate("/todos");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };
    const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  };

  const cardStyle = {
    background: "#fff",
    padding: "2.5rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
  };

  const errorStyle = {
    color: "red",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Signup</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          /><br /><br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          /><br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          /><br /><br />
          <button type="submit" style={buttonStyle}>Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
