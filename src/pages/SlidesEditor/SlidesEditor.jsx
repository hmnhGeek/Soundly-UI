import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, ImageList, ImageListItem } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

function MUIImageGallery() {
  const { songId } = useParams();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/slides/${songId}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(
                auth.username + ":" + auth.password
              )}`,
            },
            withCredentials: true,
          }
        );

        const validImages = response.data
          .filter(Boolean)
          .map((url) => ({ url }));
        setImages(validImages);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    if (songId) {
      fetchImages();
    }
  }, [songId, auth]);

  // 🔁 ESC / Arrow Key Handler
  const handleKeyDown = useCallback(
    (e) => {
      if (expandedIndex === null) return;

      if (e.key === "Escape") {
        closeOverlay();
      } else if (e.key === "ArrowRight") {
        setExpandedIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowLeft") {
        setExpandedIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    },
    [expandedIndex, images.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const openOverlay = (index) => {
    setExpandedIndex(index);
    setTimeout(() => setAnimateIn(true), 10);
  };

  const closeOverlay = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setExpandedIndex(null);
      navigate(`/gallery/${songId}`);
    }, 300);
  };

  const currentImage = images[expandedIndex]?.url;

  return (
    <>
      <Box
        sx={{
          maxWidth: 1200,
          margin: "auto",
          mt: 5,
        }}
      >
        <ImageList cols={3} gap={8}>
          {images.map((img, i) => (
            <ImageListItem key={i}>
              <img
                src={img.url}
                alt={`img-${i}`}
                loading="lazy"
                style={{ cursor: "pointer" }}
                onClick={() => openOverlay(i)}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* 🖼️ Floating Overlay with Animation and Navigation */}
      {expandedIndex !== null && currentImage && (
        <div
          onClick={closeOverlay}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: animateIn ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0)",
            opacity: animateIn ? 1 : 0,
            transition: "background-color 300ms ease, opacity 300ms ease",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
            cursor: "zoom-out",
          }}
        >
          <img
            src={currentImage}
            alt="preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              transform: animateIn ? "scale(1)" : "scale(0.95)",
              opacity: animateIn ? 1 : 0,
              transition: "transform 300ms ease, opacity 300ms ease",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default MUIImageGallery;
