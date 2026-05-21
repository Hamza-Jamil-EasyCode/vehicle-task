"use client";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AuthenticationLayout.scss";
import Assets from "@assets";
import Image from "next/image";
import AppLogo from "@components/AppLogo/AppLogo";
import colors from "@common/colors";
import { useSearchParams } from "next/navigation";
import { logout } from "@store/slice/AuthSlice";

const AuthenticationLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);
  const theme = useTheme();
  const searchParams = useSearchParams();

  // When the middleware redirects here with ?sessionExpired=true it means
  // both tokens are gone. Clear the persisted Redux state so the redirect
  // guard below doesn't bounce the user back to /chat.
  React.useEffect(() => {
    if (searchParams.get('sessionExpired') === 'true') {
      dispatch(logout());
      router.replace('/login');
    }
  }, [searchParams, dispatch, router]);

  React.useEffect(() => {
    if (userInfo && searchParams.get('sessionExpired') !== 'true') {
      router.push("/chat");
    }
  }, [userInfo, router, searchParams]);

  if (userInfo && searchParams.get('sessionExpired') !== 'true') {
    return null;
  }
  return (
    <main>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        className="auth-layout-wrapper"
        sx={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? colors.darkBackgroundColor
              : "#f9f8fe",
        }}
      >
        <Box
          className="auth-layout-children-wrapper"
          style={{ backgroundColor: theme.palette.background.paper }}
        >
          <Stack direction={"row"} alignItems={"center"} gap={1}>
            <AppLogo width={50} height={50} />
          </Stack>
          <Box
            sx={{
              width: {
                md: 480,
              },
            }}
          >
            {children}
          </Box>
        </Box>
        <Box className="auth-layout-slogan-wrapper">
          <Image
            className="slogan-image"
            width={500}
            height={500}
            src={Assets.images.AuthImage2.src}
            alt="Main auth image"
          />
          <Typography variant="h5">Turn Documents into <Typography component="span" color="primary" variant="h5" fontWeight={'bold'}>Intelligent Answers.</Typography></Typography>
        </Box>
      </Stack>
    </main>
  );
};

export default AuthenticationLayout;
