import { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Fab, ImageList, ImageListItem, IconButton } from "@mui/material";
import { Add, PlayArrow, Remove } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import AddSlideUrlsModal from "../../components/Home/AddSlidesUrlsModal";

function SlidesManager() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [images, setImages] = useState([]); // [{ id, url }]
  const [failedImageIds, setFailedImageIds] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  //   const removeSlide = async (slideId) => {
  //     try {
  //       const response = await axios.post(
  //         `http://localhost:8080/api/slides/remove-slides/${location.state?.song?.id}`,
  //         [slideId],
  //         {
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //             Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
  //           },
  //           withCredentials: true,
  //         }
  //       );
  //       fetchImages();
  //     } catch (error) {
  //       console.error("Failed to remove slides:", error);
  //     }
  //   };

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/slides`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
        },
        withCredentials: true,
      });

      const validImages = response.data
        .filter((slide) => slide?.id && slide?.url)
        .map(({ id, url }) => ({ id, url }));

      setImages(validImages);
      setFailedImageIds([]); // reset on fresh load
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  }, [auth]);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageError = (id) => {
    setFailedImageIds((prev) => [...prev, id]);
  };

  const filteredImages = images.filter(
    (img) => !failedImageIds.includes(img.id)
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (expandedIndex === null) return;

      if (e.key === "Escape") closeOverlay();
      else if (e.key === "ArrowRight")
        setExpandedIndex((prev) => (prev + 1) % filteredImages.length);
      else if (e.key === "ArrowLeft")
        setExpandedIndex(
          (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
        );
    },
    [expandedIndex, filteredImages.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const openOverlay = (index) => {
    setExpandedIndex(index);
    setTimeout(() => setAnimateIn(true), 10);
  };

  useEffect(() => {
    if (!auth?.username) navigate("/");
  }, []);

  const closeOverlay = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setExpandedIndex(null);
      navigate(`/gallery_manager`);
    }, 300);
  };

  const currentImage = filteredImages[expandedIndex]?.url;

  return (
    <>
      <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5 }}>
        <ImageList cols={3} gap={8}>
          {filteredImages.map((img, i) => (
            <ImageListItem
              key={img.id}
              sx={{
                position: "relative",
                "&:hover .remove-icon": {
                  opacity: 1,
                },
              }}
            >
              <img
                src={img.url}
                alt={`img-${i}`}
                loading="lazy"
                style={{ cursor: "pointer" }}
                onClick={() => openOverlay(i)}
                onError={() => handleImageError(img.id)}
              />
              <IconButton
                className="remove-icon"
                size="small"
                // onClick={() => removeSlide(img.id)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,0,0,0.7)",
                  },
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

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

export default SlidesManager;
