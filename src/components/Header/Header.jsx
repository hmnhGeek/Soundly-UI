import React, { useContext, useState } from "react";
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
} from "@mui/material";
import { AccountCircle, CloudUpload, Logout } from "@mui/icons-material";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import UploadMusicModal from "./UploadMusicModal";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [show, setShow] = useState(false);
  const { logout, auth } = useContext(AuthContext);
  const navigate = useNavigate();

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
              <AccountCircle />
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
