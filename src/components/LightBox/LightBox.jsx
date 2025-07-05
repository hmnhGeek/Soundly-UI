import React, { useContext, useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import "./LightBox.css";

// 🔁 Shuffle utility
const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const preloadImages = (urls) => {
  const validUrls = [];

  return Promise.all(
    urls.map((url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          validUrls.push(url);
          resolve();
        };
        img.onerror = () => resolve(); // Just resolve on error, don't reject
      });
    })
  ).then(() => validUrls);
};

export default function LightBox({ selectedSong, startToggle, setShowPlayer }) {
  const { auth } = useContext(AuthContext);
  const [shuffled, setShuffled] = useState([]);
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [started, setStarted] = useState(false);

  // ✅ Fetch images on song change (or mount)
  useEffect(() => {
    const fetchImages = async (songId) => {
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
        handleStart(response.data);
      } catch (error) {
        console.error("Error removing song:", error);
      }
    };

    if (selectedSong?.id) {
      fetchImages(selectedSong.id);
    }
  }, [selectedSong, startToggle]);

  const handleStart = async (imageUrls) => {
    const validUrls = await preloadImages(imageUrls);

    if (validUrls.length === 0) {
      setShowPlayer(true);
      return;
    }

    const shuffledList = shuffle(validUrls);
    setShuffled(shuffledList);
    setIsOpen(true);
    setStarted(true);
  };

  // 🔁 Auto-advance every 5 seconds
  useEffect(() => {
    if (!isOpen || shuffled.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % shuffled.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isOpen, shuffled]);

  const closeSlideshow = () => {
    setIsOpen(false);
    setStarted(false);
  };

  if (shuffled.length === 0 || !started) return null;
  return (
    <Lightbox
      mainSrc={shuffled[index]}
      enableZoom={false}
      onCloseRequest={() => closeSlideshow()}
      animationDuration={1000}
      reactModalStyle={{
        overlay: { backgroundColor: "black" },
        content: { inset: "0", overflow: "hidden" },
      }}
    />
  );
}
