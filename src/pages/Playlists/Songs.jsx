import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SongPlayer from "../../components/SongPlayer/SongPlayer";
import { AuthContext } from "../../AuthContext";
import { Delete, OpenInBrowser, Remove } from "@mui/icons-material";
import DeleteMusicDialog from "../../components/Home/DeleteMusicDialog";
import Image from "@mui/icons-material/Image";
import { useLocation, useNavigate } from "react-router-dom";
import EditCoverImageModal from "../../components/Home/EditCoverImageModal";
import axios from "axios";
import { PlaylistsContext } from "../../contexts/PlaylistsContext";
import SongPlayerV2 from "../../components/SongPlayer/SongPlayerV2";
import AddSongModal from "./AddSongModal";

const PlaylistSongs = () => {
  const { auth } = useContext(AuthContext);
  const { playlists, setPlaylists } = useContext(PlaylistsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddSongsModal, setShowAddSongsModal] = useState(false);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState({
    show: false,
    song: null,
  });
  const [coverImageModalState, setCoverImageModalState] = useState({
    show: false,
    songId: null,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const playlistId = location.state?.id;

  const fetchCoverImage = async (id) => {
    try {
      const coverResponse = await fetch(
        `http://localhost:8080/api/playlists/cover-image/${id}`,
        {
          headers: {
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
          withCredentials: true,
        }
      );

      if (!coverResponse.ok) throw new Error("Failed to fetch cover image");

      const blob = await coverResponse.blob();
      const imageUrl = URL.createObjectURL(blob);

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((p) =>
          p.id === id ? { ...p, coverImage: imageUrl } : p
        )
      );
    } catch (err) {
      console.error("Could not load the cover image.", err);
    }
  };

  useEffect(() => {
    if (auth?.username === undefined || !playlistId) {
      navigate("/");
    } else if (playlistId) {
      let playlist = playlists.filter((x) => x.id === playlistId)?.[0];
      if (!playlist.coverImage) {
        fetchCoverImage(playlistId);
      }
      const URL = `http://localhost:8080/api/playlists/songs/${playlistId}`;

      axios
        .get(URL, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
          withCredentials: true,
        })
        .then((response) => {
          setSongs(response.data);
        })
        .catch((error) => {
          console.error("Request error:", error);
        });
    }
  }, [playlistId, refreshToggle]);

  // Filter songs based on search term (case-insensitive)
  const filteredSongs = songs.filter((song) =>
    song.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Play/Pause
  const handlePlayPause = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying); // Toggle play/pause
    } else {
      setCurrentSong(song);
      setIsPlaying(true); // Play new song
    }
    setShowPlayer(true);
  };

  /**
   * Pick a random song to be played next.
   */
  const playNextMusic = () => {
    setCurrentSong(songs[Math.floor(Math.random() * songs.length)]);
  };

  const initiateDelete = (song) => {
    setDeleteDialogState({ show: true, song });
  };

  const initiateCoverImageChange = (id) => {
    setCoverImageModalState({ show: true, songId: id });
  };

  const removeSongFromPlaylist = async (songId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/playlists/remove-song/${playlistId}/${songId}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
          },
          withCredentials: true,
        }
      );
      setRefreshToggle((x) => !x);
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  return (
    <>
      <AddSongModal
        open={showAddSongsModal}
        handleClose={() => setShowAddSongsModal(false)}
        playlistId={playlistId}
        refresher={setRefreshToggle}
      />
      <Box
        sx={{
          maxWidth: 1200,
          margin: "auto",
          mt: 5,
          display: "flex", // Arrange elements side-by-side
          //   gap: 2, // Adds spacing between song list and player
        }}
      >
        <Box sx={{ flex: 1, width: "100%" }}>
          <img
            src={playlists.filter((x) => x.id === playlistId)?.[0]?.coverImage}
            alt="Cover"
            width="100%"
            height="auto"
            style={{ borderRadius: 8 }}
          />{" "}
        </Box>

        {/* <Box sx={{ flex: 1, width: "90%" }}>
          <Typography variant="h4" sx={{ marginTop: "30%" }}>
            {playlists.filter((x) => x.id === playlistId)?.[0]?.title}
          </Typography>
        </Box> */}
      </Box>
      <Box
        sx={{
          maxWidth: 1200,
          margin: "auto",
          mt: 5,
          display: "flex", // Arrange elements side-by-side
          gap: 2, // Adds spacing between song list and player
        }}
      >
        {/* Left side: Song List */}
        <Box sx={{ flex: 1, width: currentSong ? "50%" : "100%" }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/playlists")}
            >
              Playlists
            </Link>
            <Typography sx={{ color: "text.primary" }}>Songs</Typography>
          </Breadcrumbs>
          <br />
          <TextField
            label="What do you want to play?"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            sx={{ float: "right", mb: 2 }}
            onClick={() => setShowAddSongsModal(true)}
          >
            Add Song
          </Button>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              mb: 5,
              boxShadow: 3,
              maxHeight: 600,
              overflowY: "auto",
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Edge
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "5%" }}></TableCell>
                  <TableCell sx={{ width: "90%" }}>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell sx={{ width: "5%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSongs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handlePlayPause(song)}
                        disabled={currentSong?.id === song.id && isPlaying}
                      >
                        {currentSong?.id === song.id && isPlaying ? (
                          <PauseIcon />
                        ) : (
                          <PlayArrowIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{song.originalName}</TableCell>

                    <TableCell>
                      <IconButton
                        color="warning"
                        onClick={() => removeSongFromPlaylist(song.id)}
                      >
                        <Remove />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Right side: Song Player (only visible when a song is selected) */}
        {currentSong && (
          <SongPlayerV2
            song={currentSong}
            setSong={setCurrentSong}
            isPlaying={isPlaying}
            onMusicEnd={playNextMusic}
            onClose={() => {
              setIsPlaying(false);
              setCurrentSong(null);
            }}
            showPlayer={showPlayer}
            setShowPlayer={setShowPlayer}
          />
        )}

        <DeleteMusicDialog
          state={deleteDialogState}
          setter={setDeleteDialogState}
        />

        <EditCoverImageModal
          songId={coverImageModalState.songId}
          isVisible={coverImageModalState.show}
          onClose={() => setCoverImageModalState({ show: false, songId: null })}
        />
      </Box>
    </>
  );
};

export default PlaylistSongs;
