import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Home from "./components/Home/Home";
import LoginForm from "./components/LoginForm/LoginForm";
import Header from "./components/Header/Header";
import Playlists from "./pages/Playlists/Playlists";
import { PlaylistsProvider } from "./contexts/PlaylistsContext";

const App = () => {
  return (
    <AuthProvider>
      <PlaylistsProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/playlists" element={<Playlists />} />
          </Routes>
        </Router>
      </PlaylistsProvider>
    </AuthProvider>
  );
};

export default App;
