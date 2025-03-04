import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { AuthContext } from "../../AuthContext";
import { Avatar, Typography } from "@mui/material";
import { AccountCircle, Favorite } from "@mui/icons-material";

export default function CustomDrawer({ open, toggleDrawer }) {
  const { userProfileImage, userFullName } = useContext(AuthContext);

  const list = (
    <Box
      sx={{ width: 350 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {userProfileImage ? (
          <img
            src={userProfileImage}
            alt="Cover"
            width="100%"
            height="auto"
            style={{ borderRadius: "0%" }}
          />
        ) : (
          <AccountCircle fontSize="large" />
        )}
        <Typography align="center" mt={2} variant="h4">
          {userFullName}
        </Typography>
      </List>
      <Divider />
      <List>
        <ListItem key={"Favourites"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Favorite />
            </ListItemIcon>
            <ListItemText primary={"Favourites"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
      {list}
    </Drawer>
  );
}
