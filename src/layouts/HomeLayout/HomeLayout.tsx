"use client";
import { Paper } from "@mui/material";
import { store, persistor } from "@store/store";
import AppThemeProvider from "@utils/AppThemeProvider";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ProgressBar from "@components/ProgressBar/ProgressBar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppThemeProvider>
          <ProgressBar />
          <Paper elevation={0}>{children}</Paper>
        </AppThemeProvider>
      </PersistGate>
    </Provider>
  );
}
