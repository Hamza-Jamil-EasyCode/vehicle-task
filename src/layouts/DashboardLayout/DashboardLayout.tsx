"use client";
import Navbar from "@components/Navbar/Navbar";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DashboardLayout.scss";
import AppDrawer, { DRAWER_WIDTH, ICON_ONLY_DRAWER_WIDTH } from "@components/AppDrawer/AppDrawer";
import { easeTransition } from "@common/common";
import { saveChats } from "@store/slice/ChatSlice";
import { saveDocuments } from "@store/slice/DocumentSlice";
import type { ChatSummary, Document } from "@common/types";
import type { RootState } from "@store/store";

const DashboardLayout = ({
  children,
  chats,
  documents,
}: {
  children: React.ReactNode;
  chats: ChatSummary[];
  documents: Document[];
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);
  const theme: any = useTheme();
  const { openDrawer, isIconOnly, isSmallScreen } = useSelector(
    (state: RootState) => state.drawer,
  );

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, [userInfo, router]);

  useEffect(() => {
    dispatch(saveChats({ data: chats }));
  }, [chats]);

  useEffect(() => {
    dispatch(saveDocuments({ data: documents }));
  }, [documents]);

  if (!userInfo) {
    return null;
  }

  return (
    <Box className="main-dashboard-layout-wrapper">
      <AppDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft:
              !isSmallScreen && openDrawer
                ? `${isIconOnly ? ICON_ONLY_DRAWER_WIDTH : DRAWER_WIDTH}px`
                : 0,
            minHeight: "100dvh",
            paddingRight: !isSmallScreen && openDrawer ? "20px" : "0px",

            ...easeTransition(theme, ["margin", "padding"], openDrawer && !isIconOnly),
          }}
        >
          <Navbar />
          <Stack
            sx={{
              padding: "20px",
              backgroundColor: theme.palette.background.main,
              minHeight: "calc(100dvh - 90px)",
              borderRadius: "10px",
              alignItems: "center",
            }}
          >
            <Box sx={{ maxWidth: "1920px", width: "100%" }}>{children}</Box>
          </Stack>
          {/* <Stack
            paddingBlock={"20px"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            paddingInline={!openDrawer ? "20px" : ""}
            sx={{
              ...easeTransition(theme, ["padding"], openDrawer && !isIconOnly),
            }}
          >
            <Typography variant="body2">© All Rights Reserved</Typography>
          </Stack> */}
        </Box>
    </Box>
  );
};

export default DashboardLayout;
