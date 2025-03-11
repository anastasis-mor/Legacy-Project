import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/register", {
        name,
        email,
        password,
      });
      console.log("Registration Successful: ",response.data);
      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration Failed: ",error);
      alert("Registration Failed");
    }
  }

  return (
    <div className="login-register-bg">
      <div className="form-field">
        <h1>Sign Up</h1>

        <form onSubmit={handleRegister}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">U</span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">@</span>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your E-mail"
              aria-label="Username"
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
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <Link to="/login">
              <span className="register-link">I have registered</span>
            </Link>

            <button className="btn " type="Submit" id="button-addon2">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
