import React, { useContext, useState } from "react";
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
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { AuthContext } from "../../AuthContext";

const Home = () => {
  const { songs } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter songs based on search term (case-insensitive)
  const filteredSongs = songs.filter((song) =>
    song.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5 }}>
      {/* Search Input */}
      <TextField
        label="Search Songs"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableCell>
                <strong>Play</strong>
              </TableCell>
              <TableCell>
                <strong>Song</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSongs.map((song) => (
              <TableRow key={song.id}>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => console.log(`Playing ${song.originalName}`)}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{song.originalName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Home;
