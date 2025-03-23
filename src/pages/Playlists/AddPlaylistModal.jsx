import React, { useState, useContext } from "react";
import axios from "axios";
import { Modal, Box, Fade, Button, Typography, TextField } from "@mui/material";
import { AuthContext } from "../../AuthContext";

const AddPlaylistModal = ({ isVisible, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const { auth } = useContext(AuthContext);

  const handleCoverImageChange = (event) => {
    setCoverImage(event.target.files[0]);
  };

  const handleAddPlaylist = async () => {
    if (!title || !description || !coverImage) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("coverImagePath", coverImage);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/playlists/create-playlist",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
        }
      );
      console.log("Playlist created:", response.data);

      // Reset form & close modal
      setTitle("");
      setDescription("");
      setCoverImage(null);
      onClose();
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="add-playlist-modal-title"
      aria-describedby="add-playlist-modal-description"
    >
      <Fade in={isVisible}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" id="add-playlist-modal-title">
            Create New Playlist
          </Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button variant="outlined" component="label">
            Upload Cover Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleCoverImageChange}
              required
            />
          </Button>
          {coverImage && (
            <Typography variant="caption" color="text.secondary">
              {coverImage.name}
            </Typography>
          )}
          <Button
            onClick={handleAddPlaylist}
            variant="contained"
            color="primary"
            disabled={!title || !description || !coverImage}
          >
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddPlaylistModal;
