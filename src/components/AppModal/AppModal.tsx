import React from "react";
import {
  Box,
  Divider,
  IconButton,
  Modal,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import "./AppModal.scss";
import ClearIcon from "@mui/icons-material/Clear";

interface AppModalInterface {
  show: boolean;
  onClose?: any;
  children: any;
  title?: string;
  footer?: any;
  size?: "xl" | "lg" | "md" | "sm" | number;
}

const AppModal: React.FC<AppModalInterface> = ({
  show,
  onClose,
  title,
  footer,
  children,
  size = "lg",
}) => {
  const theme = useTheme();
  const modalSize: any = {
    xl: 920,
    lg: 800,
    md: 600,
    sm: 400,
  };
  return (
    <Modal open={show} onClose={onClose} className="custom-modal">
      <Box
        className="modal-box"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          width: `${modalSize[size] ?? size}px`,
        }}
      >
        {title && (
          <Box>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant="h6">{title}</Typography>
              <IconButton onClick={onClose}>
                <ClearIcon />
              </IconButton>
            </Stack>
          </Box>
        )}
        <Box sx={{ marginBlock: "20px" }}>{children}</Box>
        {footer && <Box>{footer}</Box>}
      </Box>
    </Modal>
  );
};

export default AppModal;
