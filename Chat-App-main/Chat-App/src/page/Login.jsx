import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle login errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });

      // Extract the token from the response
      const token = response.data;
      localStorage.setItem("auth-token", token); // Store the token in localStorage

      console.log("Login Successful: ", token);
      alert("Login Successful");

      // Redirect to the chat page
      navigate("/chat");
    } catch (error) {
      console.error("Login Failed: ", error.response?.data || error.message);
      setError("Login failed. Please check your email and password."); // Set error message
      alert("Login Failed");
    }
  };

  return (
    <div className="login-register-bg">
      <div className="form-field">
        <h1>Login</h1>

        {/* Display error message if login fails */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">@</span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your E-mail"
              aria-label="Email"
              aria-describedby="basic-addon1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">P</span>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <Link to="/register">
              <span className="register-link">I haven't registered</span>
            </Link>
            <button className="btn" type="submit" id="button-addon2">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;