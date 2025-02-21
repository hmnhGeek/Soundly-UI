import { useEffect, useRef, useState, useContext, useMemo } from "react";
import { Box, IconButton, Slider, Typography, Paper } from "@mui/material";
import { PlayArrow, Pause, Minimize } from "@mui/icons-material";
import { AuthContext } from "../../AuthContext";

const SongPlayer = ({ song, isMinimized, setIsMinimized, onSongEnd }) => {
  const { auth } = useContext(AuthContext);
  const username = auth?.username;
  const password = auth?.password;
  const [audioSrc, setAudioSrc] = useState(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [coverImage, setCoverImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current && audioSrc) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Playback started.");
            })
            .catch((error) => {
              setError("Could not autoplay the song. Please try manually.");
              console.error(error);
            });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioSrc, isPlaying]);

  const authHeader = useMemo(() => {
    console.log(username, password);
    return {
      headers: {
        Authorization: `Basic ${btoa(username + ":" + password)}`,
      },
      withCredentials: true,
    };
  }, [username, password]);

  useEffect(() => {
    if (!song) return;

    const fetchSong = async () => {
      try {
        setError(null);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
          setProgress(0);
        }

        const response = await fetch(
          `http://localhost:8080/api/songs/get-song/${song.id}`,
          authHeader
        );

        console.log("Song Response Status:", response.status);
        console.log("Song Response Headers:", response.headers);

        if (!response.ok) throw new Error("Failed to fetch song");

        const blob = await response.blob();
        console.log("Song Blob Size:", blob.size);
        console.log("Song Blob Type:", blob.type);

        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
      } catch (err) {
        setError("Could not load the song. Please try again.");
        console.error(err);
      }
    };

    const fetchCoverImage = async () => {
      try {
        const coverResponse = await fetch(
          `http://localhost:8080/api/songs/get-song-cover-image/${song.id}`,
          authHeader
        );

        if (!coverResponse.ok) throw new Error("Failed to fetch cover image");

        const blob = await coverResponse.blob();
        // const mimeType = blob.type || "image/*"; // Default to "image/jpeg" if type is missing

        // if (!mimeType.startsWith("image/")) {
        //   throw new Error("Invalid image file received");
        // }
        console.log("imagebhai", URL.createObjectURL(blob));
        setCoverImage(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Could not load the cover image.");
      }
    };

    fetchSong();
    fetchCoverImage();

    return () => {
      if (audioSrc) URL.revokeObjectURL(audioSrc);
      if (coverImage) URL.revokeObjectURL(coverImage);
    };
  }, [song, authHeader]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback error:", err));
      setIsPlaying(true);
    }
  }, [audioSrc]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      // Save the current position before pausing
      const currentTime = audioRef.current.currentTime;
      setProgress((currentTime / audioRef.current.duration) * 100);
    }
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        togglePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlayPause]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 2,
        borderRadius: 3,
        width: 500,
        height: 640,
      }}
      style={{ float: "right" }}
    >
      <Box>
        <img
          src={coverImage}
          alt="Cover"
          width="100%"
          height="auto"
          style={{ borderRadius: 8 }}
        />
        <Typography variant="h6" sx={{ my: 3 }} align="center">
          {song?.originalName}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={togglePlayPause} color="primary">
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <Typography variant="body2">{formatTime(currentTime)}</Typography>
          <Slider
            value={progress}
            onChange={(e, newValue) => {
              const newTime = (newValue / 100) * audioRef.current.duration;
              audioRef.current.currentTime = newTime;
              setProgress(newValue);
            }}
            sx={{ mx: 2, flexGrow: 1 }}
          />
          <Typography variant="body2">{formatTime(duration)}</Typography>
        </Box>
      </Box>

      {/* Component UI remains unchanged */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        // onEnded={onSongEnd}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </Paper>
  );
};

export default SongPlayer;
