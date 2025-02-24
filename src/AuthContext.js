import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [songs, setSongs] = useState([]); // Store song list
  const [userProfileImage, setUserProfileImage] = useState(null);

  const login = (username, password, songsData) => {
    setAuth({ username, password });
    setSongs(songsData); // Store song list after login
  };

  const setProfileImage = (profileImage) => setUserProfileImage(profileImage);

  const logout = () => {
    setAuth(null);
    setSongs([]);
    setUserProfileImage(null);
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, songs, userProfileImage, setProfileImage }}
    >
      {children}
    </AuthContext.Provider>
  );
};
