import React, { createContext, useState } from "react";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [songs, setSongs] = useState([]);

  /**
   * Pick a random song to be played next.
   */
  const playNextMusic = () => {
    setCurrentSong(songs[Math.floor(Math.random() * songs.length)]);
  };

  // Handle Play/Pause
  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying); // Toggle play/pause
    } else {
      setCurrentSong(song);
      setIsPlaying(true); // Play new song
    }
    setShowPlayer(true);
  };

  return (
    <SongContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        handlePlayPause,
        playNextMusic,
        isPlaying,
        setIsPlaying,
        setShowPlayer,
        showPlayer,
        songs,
        setSongs,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
