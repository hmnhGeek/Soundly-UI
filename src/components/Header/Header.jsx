import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { AccountCircle, CloudUpload, Logout } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import UploadMusicModal from "./UploadMusicModal";
import CustomDrawer from "../CustomDrawer/CustomDrawer";
import { PlaylistsContext } from "../../contexts/PlaylistsContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [show, setShow] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const { logout, auth, userProfileImage } = useContext(AuthContext);
  const { setPlaylists } = useContext(PlaylistsContext);

  const navigate = useNavigate();

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <AppBar
      elevation={0}
      sx={{ borderBottom: "1px solid #ddd" }}
      color="transparent"
      position="static"
    >
      <Toolbar>
        {/* Updated MenuIcon to toggle the Drawer */}
        {auth?.username && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)} // Added onClick event
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Soundly
        </Typography>
        {auth?.username && (
          <>
            <IconButton color="inherit" onMouseEnter={handleMouseEnter}>
              {userProfileImage ? (
                <Avatar alt="Profile" src={userProfileImage} />
              ) : (
                <AccountCircle fontSize="large" />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{ onMouseLeave: handleClose }}
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
      <CustomDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
    </AppBar>
  );
};

export default Header;
