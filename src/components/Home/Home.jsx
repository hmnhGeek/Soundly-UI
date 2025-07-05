import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../AuthContext";
import { Delete, Edit, PhotoLibrary } from "@mui/icons-material";
import DeleteMusicDialog from "./DeleteMusicDialog";
import EditCoverImageModal from "./EditCoverImageModal";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../../contexts/SongContext";

const Home = () => {
  const { songs, auth } = useContext(AuthContext);
  const { handlePlayPause, currentSong, isPlaying, setSongs } =
    useContext(SongContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogState, setDeleteDialogState] = useState({
    show: false,
    song: null,
  });
  const [coverImageModalState, setCoverImageModalState] = useState({
    show: false,
    songId: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.username === undefined) {
      navigate("/");
    }
    setSongs(songs);
  }, []);

  // Filter songs based on search term (case-insensitive)
  const filteredSongs = songs.filter((song) =>
    song.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initiateDelete = (song) => {
    setDeleteDialogState({ show: true, song });
  };

  const initiateCoverImageChange = (id) => {
    setCoverImageModalState({ show: true, songId: id });
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
      <Box sx={{ flex: 1, width: "100%" }}>
        <TextField
          label="What do you want to play?"
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
                <TableCell sx={{ width: "5%" }}></TableCell>
                <TableCell sx={{ width: "75%" }}>
                  <strong>Title</strong>
                </TableCell>
                <TableCell sx={{ width: "5%" }}></TableCell>
                <TableCell sx={{ width: "5%" }}></TableCell>
                <TableCell sx={{ width: "5%" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handlePlayPause(song)}
                      disabled={currentSong?.id === song.id && isPlaying}
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
                      color="secondary"
                      onClick={() =>
                        navigate(`/gallery`, {
                          state: { song },
                        })
                      }
                    >
                      <PhotoLibrary />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => initiateCoverImageChange(song.id)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
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

      <DeleteMusicDialog
        state={deleteDialogState}
        setter={setDeleteDialogState}
      />

      <EditCoverImageModal
        songId={coverImageModalState.songId}
        isVisible={coverImageModalState.show}
        onClose={() => setCoverImageModalState({ show: false, songId: null })}
      />
    </Box>
  );
};

export default Home;
