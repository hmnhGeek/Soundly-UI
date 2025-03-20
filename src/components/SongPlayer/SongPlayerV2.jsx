import { useEffect, useRef, useState, useContext, useMemo } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Skeleton,
  Paper,
  Modal,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { PlayArrow, Pause, Close, Minimize } from "@mui/icons-material";
import { AuthContext } from "../../AuthContext";

const SongPlayerV2 = ({
  song,
  setSong,
  onMusicEnd,
  onClose,
  showPlayer,
  setShowPlayer,
}) => {
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
          playPromise.catch(() => {
            setError("Could not autoplay the song. Please try manually.");
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioSrc, isPlaying]);

  const authHeader = useMemo(
    () => ({
      headers: { Authorization: `Basic ${btoa(username + ":" + password)}` },
      withCredentials: true,
    }),
    [username, password]
  );

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
        if (!response.ok) throw new Error("Failed to fetch song");
        const blob = await response.blob();
        setAudioSrc(URL.createObjectURL(blob));
      } catch (err) {
        setError("Could not load the song. Please try again.");
      }
    };

    const fetchCoverImage = async () => {
      try {
        const coverResponse = await fetch(
          `http://localhost:8080/api/songs/get-song-cover-image/${song.id}`,
          authHeader
        );
        if (!coverResponse.ok) throw new Error("Failed to fetch cover image");
        setCoverImage(URL.createObjectURL(await coverResponse.blob()));
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

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      setShowPlayer(false);
      return;
    }
    onClose();
  };

  return (
    <>
      {showPlayer ? (
        <Modal
          open={showPlayer}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div>
            <Paper
              elevation={6}
              sx={{
                padding: 2,
                borderRadius: 3,
                width: 500,
                height: 640,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={() => setSong(null)}
                sx={{
                  position: "relative",
                  float: "right",
                  top: 0,
                  right: 0,
                }}
              >
                <Close />
              </IconButton>
              <Box>
                <Typography variant="h6" sx={{ my: 2 }} align="center">
                  {song?.originalName.length > 35
                    ? `${song.originalName.substring(0, 35)}...`
                    : song?.originalName}
                </Typography>
                {/* Cover Image with Placeholder */}
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover"
                    width="100%"
                    height="auto"
                    style={{ borderRadius: 8 }}
                  />
                ) : (
                  <Skeleton
                    variant="square"
                    width="100%"
                    height={500}
                    sx={{ borderRadius: 8 }}
                  />
                )}

                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <IconButton onClick={togglePlayPause} color="primary">
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <Typography variant="body2">
                    {formatTime(currentTime)}
                  </Typography>
                  <Slider
                    value={progress}
                    onChange={(e, newValue) => {
                      const newTime =
                        (newValue / 100) * audioRef.current.duration;
                      audioRef.current.currentTime = newTime;
                      setProgress(newValue);
                    }}
                    sx={{ mx: 2, flexGrow: 1 }}
                  />
                  <Typography variant="body2">
                    {formatTime(duration)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </div>
        </Modal>
      ) : (
        <>
          <Box
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: 3,
              display: "flex",
              alignItems: "center",
              p: 1,
              zIndex: 1200,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                cursor: "pointer",
              }}
              image={coverImage}
              onClick={() => setShowPlayer(true)}
            />
          </Box>
        </>
      )}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onMusicEnd}
      />
    </>
  );
};

export default SongPlayerV2;
