import ClearIcon from "@mui/icons-material/Clear";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  darken,
  Divider,
  Drawer,
  IconButton,
  lighten,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  styled,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { setDrawerOpen, setIsIconOnly, setIsSmallScreen } from "@store/slice/DrawerSlice";
import "./AppDrawer.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@store/slice/AuthSlice";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import Link from "next/link";
import AppLogo from "@components/AppLogo/AppLogo";
import Config from "@utils/config";
import Links from "@utils/Links";
import { firstLetterCapitalize } from "@common/common";
import SettingsIcon from "@mui/icons-material/Settings";
import { RootState } from "@store/store";
import ChatIcon from "@mui/icons-material/Chat";
import { Chat, ChatSummary } from "@common/types";

export const DRAWER_WIDTH = 220;
export const ICON_ONLY_DRAWER_WIDTH = 50;

const DRAWER_ABS_WIDTH = 720;
const SMALL_DRAWER_ABS_WIDTH = 1000;

export const CustomListItemBtn = styled("div")(
  ({ theme, active }: { theme?: any; active: boolean }) => ({
    width: "100%",
    transition: "0.2s ease-in-out",
    borderRadius: 5,
    backgroundColor: active
      ? theme.palette.mode === "dark"
        ? darken(theme.palette.primary.main, 0.6)
        : lighten(theme.palette.primary.main, 0.8)
      : "transparent",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? darken(theme.palette.primary.main, 0.5)
          : lighten(theme.palette.primary.main, 0.8),
    },
  }),
);

const AppDrawer = () => {
  const theme = useTheme();
  const { openDrawer, isIconOnly, isSmallScreen } = useSelector((state: RootState) => state.drawer);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < DRAWER_ABS_WIDTH) {
        dispatch(setDrawerOpen(false));
        dispatch(setIsSmallScreen(true));
        dispatch(setIsIconOnly(false));
      } else if (window.innerWidth < SMALL_DRAWER_ABS_WIDTH) {
        dispatch(setIsSmallScreen(false));
        dispatch(setIsIconOnly(true));
        dispatch(setDrawerOpen(true));
      } else {
        dispatch(setIsSmallScreen(false));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On small screens, close the drawer when navigating between routes
  useEffect(() => {
    if (isSmallScreen) {
      dispatch(setDrawerOpen(false));
    }
  }, [params]);

  const logoutHandler = () => {
    try {
      setAnchorEl(null);
      dispatch(logout());
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const drawerItems: {
    link?: string | null;
    title?: string;
    icon?: React.ElementType;
    onClick?: () => void;
  }[] = Links.dashboardDrawerItems;

  const initials = firstLetterCapitalize(
    userInfo?.displayName?.trim().charAt(0) ?? "",
  );

  const activeWidth = isIconOnly ? ICON_ONLY_DRAWER_WIDTH : DRAWER_WIDTH;

  const textTransition = theme.transitions.create(["opacity", "max-width"], {
    easing: isIconOnly
      ? theme.transitions.easing.sharp
      : theme.transitions.easing.easeOut,
    duration: isIconOnly
      ? theme.transitions.duration.leavingScreen
      : theme.transitions.duration.enteringScreen,
  });

  const widthTransition = theme.transitions.create(["width"], {
    easing: isIconOnly
      ? theme.transitions.easing.sharp
      : theme.transitions.easing.easeOut,
    duration: isIconOnly
      ? theme.transitions.duration.leavingScreen
      : theme.transitions.duration.enteringScreen,
  });

  const paperTransition = theme.transitions.create(["width", "padding"], {
    easing: isIconOnly
      ? theme.transitions.easing.sharp
      : theme.transitions.easing.easeOut,
    duration: isIconOnly
      ? theme.transitions.duration.leavingScreen
      : theme.transitions.duration.enteringScreen,
  });

  return (
    <Drawer
      variant="persistent"
      open={openDrawer}
      anchor="left"
      className="custom_drawer-wrapper"
      sx={{
        width: activeWidth,
        flexShrink: 0,
        transition: widthTransition,
        "& .MuiDrawer-paper": {
          width: activeWidth,
          boxSizing: "border-box",
          paddingBottom: "20px",
          paddingInline: isIconOnly ? "10px" : "20px",
          height: "100dvh",
          overflowX: "hidden",
          transition: paperTransition,
        },
      }}
    >
      <Stack sx={{ height: "100dvh" }}>
        <Stack
          alignItems={"center"}
          direction={"row"}
          gap={"20px"}
          justifyContent={isSmallScreen ? "space-between" : "center"}
          height={"70px"}
        >
          <AppLogo onClick={() => router.push("/")} iconOnly={isIconOnly} />
          {isSmallScreen && (
            <IconButton onClick={() => dispatch(setDrawerOpen(false))}>
              <ClearIcon />
            </IconButton>
          )}
        </Stack>
        <Stack sx={{ flexGrow: 1 }}>
          <List sx={{}}>
            {drawerItems?.map((item, index) => (
              <ListItem
                key={index}
                className="custom_list-item"
                onClick={() => {
                  if (item?.link) {
                    router.push(item.link);
                  } else if (item?.onClick) {
                    item.onClick();
                  }
                }}
                sx={{ px: isIconOnly ? 0 : undefined }}
              >
                <Tooltip
                  title={isIconOnly ? item?.title : ""}
                  placement="right"
                >
                  <CustomListItemBtn active={pathname === item?.link}>
                    <ListItemButton
                      sx={{
                        paddingBlock: "2px",
                        paddingInline: 1,
                        justifyContent: isIconOnly ? "center" : "flex-start",
                      }}
                    >
                      <ListItemIcon
                        className="list_item-icon"
                        sx={{
                          minWidth: isIconOnly ? "unset" : undefined,
                          ...(isIconOnly && pathname === item?.link
                            ? { color: theme.palette.primary.main }
                            : {}),
                          ml: isIconOnly ? 0.6 : 0
                        }}
                      >
                        {item?.icon && <item.icon />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item?.title}
                        primaryTypographyProps={{ noWrap: true }}
                        sx={{
                          opacity: isIconOnly ? 0 : 1,
                          maxWidth: isIconOnly ? 0 : 160,
                          overflow: "hidden",
                          margin: 0,
                          transition: textTransition,
                        }}
                      />
                    </ListItemButton>
                  </CustomListItemBtn>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Stack>

        <Divider sx={{ marginBottom: "20px" }} />

        {/* User section */}
        <Tooltip
          title={isIconOnly ? (userInfo?.displayName ?? "") : ""}
          placement="right"
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              px: isIconOnly ? 0.5 : 1.5,
              py: 1.2,
              borderRadius: 2,
              cursor: "pointer",
              justifyContent: isIconOnly ? "center" : "flex-start",
              transition: "0.2s ease-in-out",
              border: !isIconOnly
                ? `1px solid ${theme.palette.mode === "dark" ? "#2b2b2b" : "#e0e0e0"}`
                : undefined,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? darken(theme.palette.primary.main, 0.7)
                    : lighten(theme.palette.primary.main, 0.9),
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 34,
                height: 34,
                fontSize: 15,
                flexShrink: 0,
                ml: isIconOnly ? '50%' : '',
                color: '#fff'
              }}
            >
              {initials}
            </Avatar>
            <Stack
              sx={{
                overflow: "hidden",
                flex: 1,
                opacity: isIconOnly ? 0 : 1,
                maxWidth: isIconOnly ? 0 : 160,
                transition: textTransition,
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                noWrap
                sx={{ lineHeight: 1.3 }}
              >
                {userInfo?.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {userInfo?.email}
              </Typography>
            </Stack>
          </Stack>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          elevation={2}
          slotProps={{
            paper: {
              sx: { width: DRAWER_WIDTH - 40, mb: 0.5, borderRadius: 2 },
            },
          }}
        >
          {Links.drawerNavigationLinks?.map((item, index) => (
            <MenuItem onClick={() => router.push(item.link)} sx={{ gap: 1.5 }}>
              <item.icon />
              <Typography>{item.title}</Typography>
            </MenuItem>
          ))}
          <MenuItem
            onClick={logoutHandler}
            sx={{ color: "error.main", gap: 1.5 }}
          >
            <LogoutIcon />
            <Typography>Log out</Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </Drawer>
  );
};

export default AppDrawer;
