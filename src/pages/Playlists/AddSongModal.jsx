import React, { useContext, useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
} from "@mui/material";
import { AuthContext } from "../../AuthContext";

const AddSongModal = ({ open, handleClose, playlistId, refresher }) => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const { songs, auth } = useContext(AuthContext); // Assume songs is an array of song objects

  const handleSubmit = async () => {
    try {
      const songIds = selectedSongs.map((song) => song.id); // Extract selected song IDs
      const requestData = { songIds };

      await axios.post(
        `http://localhost:8080/api/playlists/add-to-playlist?playlistId=${playlistId}`,
        requestData,
        {
          headers: {
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
          withCredentials: true,
        }
      );
      refresher((x) => !x);
      handleClose();
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-song-modal">
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Add Song to Playlist
        </Typography>

        <Autocomplete
          multiple
          options={songs}
          getOptionLabel={(option) => option.originalName} // Display song name
          value={selectedSongs}
          onChange={(event, newValue) => setSelectedSongs(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search and Select Songs"
              fullWidth
              margin="normal"
            />
          )}
        />

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}
        >
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default AddSongModal;
