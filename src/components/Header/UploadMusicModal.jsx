import * as React from "react";
import { Modal, Box, Fade, Button, Typography } from "@mui/material";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadMusicModal({ show, setShow }) {
  const [musicFileName, setMusicFileName] = React.useState("");
  const [coverImageName, setCoverImageName] = React.useState("");
  const [songFile, setSongFile] = React.useState(null);
  const [coverImage, setCoverImage] = React.useState(null);
  const { auth, login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleFileChange = (event, setFileName, setFile) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShow(false);
  };

  const fetchSongs = () => {
    const URL =
      "http://localhost:8080/api/songs/get-song-list-lite?page=0&size=8";

    axios
      .get(URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
        },
        withauth: true,
      })
      .then((response) => {
        console.log("Login successful:", response.data);
        login(auth.username, auth.password, response.data); // Store auth in context
        navigate("/home");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Login failed: Invalid auth");
        } else {
          console.error("Request error:", error);
        }
      });
  };

  const uploadMusic = () => {
    if (songFile && coverImage) {
      const formData = new FormData();
      formData.append("songFilePath", songFile);
      formData.append("coverImagePath", coverImage);

      // Making POST request to upload song and cover image
      axios
        .post("http://localhost:8080/api/songs/upload", formData, {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
          withauth: true,
        })
        .then((response) => {
          setShow(false);
          setMusicFileName("");
          setSongFile(null);
          setCoverImageName("");
          setCoverImage(null);
          fetchSongs();
        })
        .catch((error) => {
          console.error("Upload failed", error);
        });
    } else {
      alert("Please select both a song and a cover image.");
    }
  };

  return (
    <Modal
      open={show}
      onClose={() => setShow(false)}
      closeAfterTransition
      aria-labelledby="upload-music-modal-title"
      aria-describedby="upload-music-modal-description"
    >
      <Fade in={show}>
        <Box
          component="form"
          onSubmit={handleSubmit}
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
          {/* Modal Title */}
          <Typography variant="h6" id="upload-music-modal-title">
            Upload Music
          </Typography>

          {/* Modal Description */}
          <Typography variant="body2" id="upload-music-modal-description">
            Select a music file and a cover image to upload.
          </Typography>

          {/* Music File Upload */}
          <Button variant="outlined" component="label">
            Select Music File
            <input
              type="file"
              name="musicFile"
              accept="audio/*"
              hidden
              onChange={(e) =>
                handleFileChange(e, setMusicFileName, setSongFile)
              }
              required
            />
          </Button>
          {musicFileName && (
            <Typography variant="caption" color="text.secondary">
              {musicFileName}
            </Typography>
          )}

          {/* Cover Image Upload */}
          <Button variant="outlined" component="label">
            Select Cover Image
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              hidden
              onChange={(e) =>
                handleFileChange(e, setCoverImageName, setCoverImage)
              }
              required
            />
          </Button>
          {coverImageName && (
            <Typography variant="caption" color="text.secondary">
              {coverImageName}
            </Typography>
          )}

          {/* Submit Button */}
          <Button onClick={uploadMusic} variant="contained" color="primary">
            Upload
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}
