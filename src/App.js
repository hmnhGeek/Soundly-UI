import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./components/Home/Home";
import LoginForm from "./components/LoginForm/LoginForm";
import Header from "./components/Header/Header";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
