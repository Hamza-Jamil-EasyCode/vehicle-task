import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Navbar.scss";
import { useLayoutEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { setDrawerOpen, setIsIconOnly } from "@store/slice/DrawerSlice";
import { useDispatch, useSelector } from "react-redux";
import SettingsIcon from "@mui/icons-material/Settings";
import { firstLetterCapitalize } from "@common/common";
import Link from "next/link";
import Input from "@components/Input/Input";
import { setLightTheme } from "@store/slice/ThemeSlice";
import { logout } from "@store/slice/AuthSlice";
import LogoutIcon from "@mui/icons-material/Logout";

const ProfileSettingsList = ({
  anchorEl,
  open,
  onClose,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}) => {
  const { lightTheme } = useSelector((state: any) => state.theme);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    try {
      dispatch(logout());
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <Menu
      id="profile-settings-nav-btn"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem>
        <ListItemText sx={{ marginRight: "20px" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Dark Theme
          </Typography>
        </ListItemText>
        <Input
          name="theme"
          type="switch"
          checked={!lightTheme}
          onChange={() => dispatch(setLightTheme(!lightTheme))}
        />
      </MenuItem>
      <Link href={"account-settings"} onClick={onClose}>
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Settings
            </Typography>
          </ListItemText>
        </MenuItem>
      </Link>
      <MenuItem onClick={logoutHandler} sx={{ color: "error.main", gap: 1.5 }}>
        <LogoutIcon />
        <Typography>Log out</Typography>
      </MenuItem>
    </Menu>
  );
};

const ProfileSettingsButton = () => {
  const theme = useTheme();
  const { userInfo } = useSelector((state: any) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        sx={{ padding: 0 }}
        id="profile-settings-nav-btn"
        onClick={handleClick}
      >
        <Avatar sx={{ color: '#fff', bgcolor: theme.palette.primary.main }}>
          {firstLetterCapitalize(
            userInfo?.displayName?.split(" ")[0].charAt(0),
          )}
        </Avatar>
      </IconButton>
      <ProfileSettingsList
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      />
    </Box>
  );
};

const Navbar = () => {
  const [title, setTitle] = useState<string>("Dashboard");
  const pathname = usePathname();
  const { userInfo } = useSelector((state: any) => state.auth);
  const { isSmallScreen, openDrawer, isIconOnly } = useSelector((state: any) => state.drawer);
  const dispatch = useDispatch();
  const params = useParams();
  const theme = useTheme();

  useLayoutEffect(() => {
    const title = pathname?.split("/")[1].replaceAll("-", " ") || "";
    const capitalizeTitle = `${title?.charAt(0).toUpperCase()}${title?.substring(1)}`;
    const finalTitle = capitalizeTitle === "Chat" ? "Welcome" : capitalizeTitle;
    setTitle(finalTitle);
  }, [params]);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      className="app-bar-custom"
      sx={{ backgroundColor: theme.palette.background.paper }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ padding: "13px 7px" }}
      >
        <Stack direction={"row"}>
          {isSmallScreen ? (
            <IconButton
              onClick={() => dispatch(setDrawerOpen(!openDrawer))}
              sx={{
                borderRadius: "5px",
                padding: "2px",
                marginRight: "0.5rem",
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => dispatch(setIsIconOnly(!isIconOnly))}
              sx={{
                borderRadius: "5px",
                padding: "2px",
                marginRight: "0.5rem",
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h5"
            fontWeight={500}
            color={theme.palette.mode === "dark" ? "#fff" : ""}
          >
            {title}
          </Typography>
          {title === "Welcome" && (
            <Typography
              variant="h5"
              fontWeight={600}
              color={"primary"}
              marginLeft={"5px"}
            >{`${userInfo?.displayName?.split(" ")[0]}!`}</Typography>
          )}
        </Stack>
        <ProfileSettingsButton />
      </Stack>
    </AppBar>
  );
};

export default Navbar;
