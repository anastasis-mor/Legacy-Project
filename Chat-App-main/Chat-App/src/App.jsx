import { useState } from "react";
import Login from "./page/Login";
import Register from "./page/Register";
import DisplayPosts from "./components/DisplayPosts";
import { BrowserRouter as Router, Routes , Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path= "/chat" element={<DisplayPosts />} />
        <Route path="/" element={<Login />} /> {/* Default Route */}
      </Routes>
    </Router>
  );
}

export default App;
