import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/TodoList";

// Wrapper for login/signup page buttons
function AuthPage({ token, handleLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f0f2f5",
      padding: "2rem"
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "1rem" }}>
          <button
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: showLogin ? "#4caf50" : "#ccc",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: !showLogin ? "#4caf50" : "#ccc",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => setShowLogin(false)}
          >
            Signup
          </button>
        </div>
        {showLogin ? <Login onLogin={handleLogin} /> : <Signup onSignup={handleLogin} />}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // TodoList wrapper to include logout button
  const TodoPage = () => {
    const navigate = useNavigate();
    const logoutAndRedirect = () => {
      handleLogout();
      navigate("/login");
    };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
          <button
            onClick={logoutAndRedirect}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "#f44336",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
        <TodoList />
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/todos" : "/login"} />} />
        <Route path="/login" element={<AuthPage token={token} handleLogin={handleLogin} />} />
        <Route path="/signup" element={<AuthPage token={token} handleLogin={handleLogin} />} />
        <Route path="/todos" element={token ? <TodoPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
