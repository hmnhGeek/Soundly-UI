import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
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

const Playlists = (props) => {
  const { auth } = useContext(AuthContext);
  const { playlists, setPlaylists } = useContext(PlaylistsContext);
  const navigate = useNavigate();

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
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Search for a playlist"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            //   value={searchTerm}
            //   onChange={(e) => setSearchTerm(e.target.value)}
          />

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
                  <TableCell sx={{ width: "95%" }}>
                    <strong>Description</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playlists?.map((playlist) => (
                  <TableRow key={playlist.id}>
                    <TableCell>{playlist.title}</TableCell>
                    <TableCell>{playlist.description}</TableCell>
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
