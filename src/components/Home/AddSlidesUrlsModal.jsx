import React, { useContext, useState } from "react";
import axios from "axios";
import { Modal, Box, Fade, Button, Typography, TextField } from "@mui/material";
import { AuthContext } from "../../AuthContext";

const AddSlideUrlsModal = ({ isVisible, onClose, songId, callback }) => {
  const { auth } = useContext(AuthContext);
  const [urlText, setUrlText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const urls = urlText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

    if (urls.length === 0) return alert("Please enter at least one URL.");

    try {
      setIsSubmitting(true);
      await axios.post(
        `http://localhost:8080/api/slides/add-new-slides/${songId}`,
        urls,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
        }
      );
      setUrlText("");
      onClose();
      callback?.();
    } catch (error) {
      console.error("Failed to add slide URLs:", error);
      alert("Failed to submit URLs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isVisible}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="add-slide-modal-title"
      aria-describedby="add-slide-modal-description"
    >
      <Fade in={isVisible}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" id="add-slide-modal-title">
            Add Slide URLs
          </Typography>
          <Typography variant="body2" id="add-slide-modal-description">
            Paste one or more image URLs below. Each URL should be on a new
            line.
          </Typography>
          <TextField
            label="Image URLs"
            multiline
            rows={6}
            variant="outlined"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            fullWidth
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting || !urlText.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddSlideUrlsModal;
