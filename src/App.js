import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext, AuthProvider } from "./AuthContext";
import Home from "./components/Home/Home";
import LoginForm from "./components/LoginForm/LoginForm";
import Header from "./components/Header/Header";
import Playlists from "./pages/Playlists/Playlists";
import { PlaylistsProvider } from "./contexts/PlaylistsContext";
import PlaylistSongs from "./pages/Playlists/Songs";
import MUIImageGallery from "./pages/SlidesEditor/SlidesEditor";
import { SongContext, SongProvider } from "./contexts/SongContext";
import SongPlayerV2 from "./components/SongPlayer/SongPlayerV2";
import SlidesManager from "./pages/SlidesManager/SlidesManager";

const App = () => {
  return (
    <AuthProvider>
      <SongProvider>
        <PlaylistsProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/home" element={<Home />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlist-songs" element={<PlaylistSongs />} />
              <Route path="/gallery" element={<MUIImageGallery />} />
              <Route path="/gallery_manager" element={<SlidesManager />} />
            </Routes>

            {/* ✅ Access context here, AFTER wrapping with providers */}
            <SongContextConsumer />
          </Router>
        </PlaylistsProvider>
      </SongProvider>
    </AuthProvider>
  );
};

function SongContextConsumer() {
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    showPlayer,
    setShowPlayer,
    playNextMusic,
  } = useContext(SongContext);

  if (!currentSong) return null;

  return (
    <SongPlayerV2
      song={currentSong}
      setSong={setCurrentSong}
      isPlaying={isPlaying}
      onMusicEnd={playNextMusic}
      onClose={() => {
        setIsPlaying(false);
        setCurrentSong(null);
      }}
      showPlayer={showPlayer}
      setShowPlayer={setShowPlayer}
    />
  );
}

export default App;
