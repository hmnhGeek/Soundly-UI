import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Input,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { AccountCircle, CloudUpload, Logout } from "@mui/icons-material";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import UploadMusicModal from "./UploadMusicModal";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [show, setShow] = useState(false);
  const { logout, auth, setProfileImage, userProfileImage } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const authHeader = useMemo(
    () => ({
      headers: {
        Authorization: `Basic ${btoa(auth?.username + ":" + auth?.password)}`,
      },
      withCredentials: true,
    }),
    [auth?.username, auth?.password]
  );

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const coverResponse = await fetch(
          `http://localhost:8080/api/users/profile-image`,
          authHeader
        );
        if (!coverResponse.ok) throw new Error("Failed to fetch profile image");
        setProfileImage(URL.createObjectURL(await coverResponse.blob()));
      } catch (err) {
        console.error("Could not load the profile image.");
      }
    };

    if (auth?.username) {
      fetchProfileImage();
    }
  }, [auth]);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Soundly
        </Typography>
        {auth?.username && (
          <>
            <IconButton
              color="inherit"
              onMouseEnter={handleMouseEnter} // Open menu on hover
            >
              {userProfileImage ? (
                // <img
                //   src={userProfileImage}
                //   alt="Profile"
                //   width="40"
                //   height="40"
                //   style={{ borderRadius: "100%" }}
                // />
                <Avatar alt="Profile" src={userProfileImage} />
              ) : (
                <AccountCircle fontSize="large" />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{ onMouseLeave: handleClose }} // Close on mouse leave
            >
              <MenuItem onClick={() => setShow(true)}>
                <CloudUpload /> &nbsp; Upload
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout /> &nbsp; Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
      <UploadMusicModal show={show} setShow={setShow} />
    </AppBar>
  );
};

export default Header;
