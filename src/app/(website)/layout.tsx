import React from "react";
import HomeLayout from "@layouts/HomeLayout/HomeLayout";
import { Container } from "@mui/material";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <HomeLayout>
      <Container sx={{ paddingBlock: 5, minHeight: '100vh' }}>{children}</Container>
    </HomeLayout>
  );
};

export default Layout;
