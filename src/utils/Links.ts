import SettingsIcon from "@mui/icons-material/Settings";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";


const dashboardDrawerItems = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: FolderCopyIcon,
  },
];

const drawerNavigationLinks = [
  {
    title: "Settings",
    link: "/account-settings",
    icon: SettingsIcon,
  },
];

const Links = {
  dashboardDrawerItems,
  drawerNavigationLinks,
};

export default Links;
