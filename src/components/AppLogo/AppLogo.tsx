import { Typography } from "@mui/material";
import Config from "@utils/config";

const AppLogo: React.FC<{
  width?: number;
  height?: number;
  onClick?: () => void;
  iconOnly?: boolean;
  textOnly?: boolean;
}> = ({
  width = 35,
  height = 35,
  onClick,
}) => {
  const fontSize = Math.round((Number(width) + Number(height)) / 4);

  return (
    <Typography
      fontWeight={"bolder"}
      textTransform={"uppercase"}
      noWrap
      onClick={onClick}
      sx={{
        fontSize,
        textDecoration: "none",
        opacity: 1,
        maxWidth: 200,
        overflow: "hidden",
      }}
    >
      {Config.appName}
    </Typography>
  );
};

export default AppLogo;
