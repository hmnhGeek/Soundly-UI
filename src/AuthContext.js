import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [songs, setSongs] = useState([]); // Store song list

  const login = (username, password, songsData) => {
    setAuth({ username, password });
    setSongs(songsData); // Store song list after login
  };

  const logout = () => {
    setAuth(null);
    setSongs([]);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, songs }}>
      {children}
    </AuthContext.Provider>
  );
};
