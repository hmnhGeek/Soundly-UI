import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, ImageList, ImageListItem } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../AuthContext"; // adjust the path if needed

function MUIImageGallery() {
  const { songId } = useParams(); // URL must have a route like /gallery/:songId
  const { auth } = useContext(AuthContext);
  const [images, setImages] = useState([]);

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

        // Filter valid URLs if needed (optional)
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
      <ImageList cols={3} gap={8}>
        {images.map((img, i) => (
          <ImageListItem key={i}>
            <img src={img.url} alt={`img-${i}`} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

export default MUIImageGallery;
