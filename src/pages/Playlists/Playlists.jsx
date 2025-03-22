import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { PlaylistsContext } from "../../contexts/PlaylistsContext";
import AddPlaylistModal from "./AddPlaylistModal";
import { Remove } from "@mui/icons-material";

const Playlists = (props) => {
  const { auth } = useContext(AuthContext);
  const { playlists, setPlaylists } = useContext(PlaylistsContext);
  const navigate = useNavigate();

  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);

  useEffect(() => {
    if (auth?.username === undefined) {
      navigate("/");
    } else if (playlists === null && auth.username && auth.password) {
      const URL = "http://localhost:8080/api/playlists";

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
          setPlaylists(
            response.data.map((x) => {
              return { ...x, coverImage: null };
            })
          );
        })
        .catch((error) => {
          console.error("Request error:", error);
        });
    }
  }, [playlists, auth]);

  useEffect(() => {
    const URL = "http://localhost:8080/api/playlists";

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
        const existingIds = new Set(playlists.map((p) => p.id)); // Assuming each playlist has a unique `id`
        const newPlaylists = response.data
          .filter((p) => !existingIds.has(p.id)) // Filter only new playlists
          .map((p) => ({ ...p, coverImage: null })); // Add default coverImage

        setPlaylists([...playlists, ...newPlaylists]);
      })
      .catch((error) => {
        console.error("Request error:", error);
      });
  }, [showNewPlaylistModal]);

  const deletePlaylist = async (playlistId) => {
    const URL = `http://localhost:8080/api/playlists/${playlistId}`;

    try {
      await axios.delete(URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
        },
        withCredentials: true,
      });

      // Optionally update state by removing the deleted playlist
      setPlaylists((playlists) => playlists.filter((p) => p.id !== playlistId));
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  if (playlists) {
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
        <AddPlaylistModal
          isVisible={showNewPlaylistModal}
          onClose={() => setShowNewPlaylistModal(false)}
        />
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Search for a playlist"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            //   value={searchTerm}
            //   onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            sx={{ float: "right", mb: 2 }}
            onClick={() => setShowNewPlaylistModal(true)}
          >
            New Playlist
          </Button>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
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
                  <TableCell sx={{ width: "5%" }}>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell sx={{ width: "90%" }}>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell sx={{ width: "5%" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playlists?.map((playlist) => (
                  <TableRow key={playlist.id}>
                    <TableCell
                      onClick={() =>
                        navigate("/playlist-songs", {
                          state: { id: playlist.id },
                        })
                      }
                    >
                      {playlist.title}
                    </TableCell>
                    <TableCell>{playlist.description}</TableCell>
                    <TableCell>
                      <IconButton
                        color="warning"
                        onClick={() => deletePlaylist(playlist.id)}
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
      </Box>
    );
  }
  return null;
};

export default Playlists;
