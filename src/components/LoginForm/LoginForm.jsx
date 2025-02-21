import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const fetchSongs = () => {
    const URL =
      "http://localhost:8080/api/songs/get-song-list-lite?page=0&size=8";

    axios
      .get(URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(
            credentials.username + ":" + credentials.password
          )}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Login successful:", response.data);
        login(credentials.username, credentials.password, response.data); // Store credentials in context
        navigate("/home");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Login failed: Invalid credentials");
        } else {
          console.error("Request error:", error);
        }
      });
  };

  return (
    <Box
      sx={{
        height: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#f4f4f4",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            // onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              fullWidth
            />
            <Button
              onClick={fetchSongs}
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;
