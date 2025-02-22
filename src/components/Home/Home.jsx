import React, { useContext, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SongPlayer from "../SongPlayer/SongPlayer";
import { AuthContext } from "../../AuthContext";
import { Delete } from "@mui/icons-material";
import DeleteMusicDialog from "./DeleteMusicDialog";

const Home = () => {
  const { songs } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState({
    show: false,
    song: null,
  });

  // Filter songs based on search term (case-insensitive)
  const filteredSongs = songs.filter((song) =>
    song.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Play/Pause
  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying); // Toggle play/pause
    } else {
      setCurrentSong(song);
      setIsPlaying(true); // Play new song
    }
  };

  /**
   * Pick a random song to be played next.
   */
  const playNextMusic = () => {
    setCurrentSong(songs[Math.floor(Math.random() * songs.length)]);
  };

  const initiateDelete = (song) => {
    setDeleteDialogState({ show: true, song });
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "auto",
        mt: 5,
        display: "flex", // Arrange elements side-by-side
        gap: 2, // Adds spacing between song list and player
      }}
    >
      {/* Left side: Song List */}
      <Box sx={{ flex: 1, width: currentSong ? "50%" : "100%" }}>
        <TextField
          label="Search Songs"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            maxHeight: 600,
            overflowY: "auto",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Play</strong>
                </TableCell>
                <TableCell>
                  <strong>Song</strong>
                </TableCell>
                <TableCell>
                  <strong>Delete</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handlePlayPause(song)}
                    >
                      {currentSong?.id === song.id && isPlaying ? (
                        <PauseIcon />
                      ) : (
                        <PlayArrowIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{song.originalName}</TableCell>
                  <TableCell>
                    <IconButton
                      color="warning"
                      onClick={() => initiateDelete(song)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Right side: Song Player (only visible when a song is selected) */}
      {currentSong && (
        <Box sx={{ flex: 1, width: "50%" }}>
          <SongPlayer
            song={currentSong}
            setSong={setCurrentSong}
            isPlaying={isPlaying}
            onMusicEnd={playNextMusic}
          />
        </Box>
      )}

      <DeleteMusicDialog
        state={deleteDialogState}
        setter={setDeleteDialogState}
      />
    </Box>
  );
};

export default Home;
