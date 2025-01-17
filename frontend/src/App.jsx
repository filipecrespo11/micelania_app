import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // Página de registro
import CustomerManagement from "./components/CustomerManagement";
import "./App.css"; // Importa o arquivo CSS

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customers" element={<CustomerManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
