import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

export default function DeleteMusicDialog({ state, setter }) {
  const { auth, login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const fetchSongs = () => {
    const URL =
      "http://localhost:8080/api/songs/get-song-list-lite?page=0&size=8";

    axios
      .get(URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
        },
        withauth: true,
      })
      .then((response) => {
        console.log("Login successful:", response.data);
        login(auth.username, auth.password, response.data); // Store auth in context
        navigate("/home");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error("Login failed: Invalid auth");
        } else {
          console.error("Request error:", error);
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/api/songs/${state.song.id}`, {
        headers: {
          Authorization: `Basic ${btoa(auth.username + ":" + auth.password)}`,
        },
      })
      .then(() => {
        handleClose();
        fetchSongs();
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setter({ show: false, song: null });
  };

  if (state.show)
    return (
      <React.Fragment>
        <Dialog
          open={state.show}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete confirmation!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this song?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button onClick={handleDelete} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  return null;
}
