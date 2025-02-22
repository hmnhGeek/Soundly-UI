import React, { useContext, useState } from "react";
import axios from "axios";
import { Modal, Box, Fade, Button, Typography } from "@mui/material";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const EditCoverImageModal = ({ songId, isVisible, onClose }) => {
  const [coverImage, setCoverImage] = useState(null);
  const { auth, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCoverImageChange = (event) => {
    setCoverImage(event.target.files[0]);
  };

  const handleCoverChangeRequest = async () => {
    if (!coverImage) return;

    const formData = new FormData();
    formData.append("coverImagePath", coverImage);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/songs/change-cover/${songId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
          responseType: "blob", // Ensures we receive a binary file
        }
      );

      // Get content type from response headers (e.g., "image/jpeg")
      const contentType = response.headers["content-type"] || "image/jpeg"; // Default to JPEG

      // Determine file extension from content type
      const extensionMap = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
      };
      const extension = extensionMap[contentType] || "jpg"; // Fallback to jpg

      // Get filename from content-disposition header (if available)
      const contentDisposition = response.headers["content-disposition"];
      let filename = `cover_image.${extension}`; // Default filename
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        if (match) filename = match[1];
      } else {
        filename = `cover_image.${extension}`; // Use detected extension
      }

      // Create a download link for the image
      const blob = new Blob([response.data], { type: contentType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      fetchSongs();
      setCoverImage(null);
      onClose();
    } catch (err) {
      console.error("Error updating cover image:", err);
    }
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

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="edit-cover-modal-title"
      aria-describedby="edit-cover-modal-description"
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
          <Typography variant="h6" id="edit-cover-modal-title">
            Change Cover Image
          </Typography>
          <Typography variant="body2" id="edit-cover-modal-description">
            Select a new cover image for your song.
          </Typography>
          <Button variant="outlined" component="label">
            Select Cover Image
            <input
              type="file"
              name="coverImage"
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
            onClick={handleCoverChangeRequest}
            variant="contained"
            color="primary"
            disabled={!coverImage}
          >
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default EditCoverImageModal;
