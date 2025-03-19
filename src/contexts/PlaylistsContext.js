import React, { createContext, useState } from "react";

export const PlaylistsContext = createContext();

export const PlaylistsProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState(null);

  return (
    <PlaylistsContext.Provider
      value={{
        playlists,
        setPlaylists,
      }}
    >
      {children}
    </PlaylistsContext.Provider>
  );
};
