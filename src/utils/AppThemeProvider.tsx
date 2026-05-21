"use client";
import { ThemeProvider } from "@emotion/react";
import { createTheme, PaletteMode } from "@mui/material";
import colors from "@common/colors";
import { useSelector } from "react-redux";
import { useMemo } from "react";

// Augment the palette to include a violet color
declare module "@mui/material/styles" {
  interface Palette {
    secondary: Palette["secondary"];
    black: Palette["primary"];
    white: Palette["primary"];
  }

  interface PaletteOptions {
    secondary?: PaletteOptions["secondary"];
    black?: PaletteOptions["primary"];
    white?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include a black option
// Update the Button's color options to include a white option
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondary: true;
    black: true;
    white: true;
  }
}

const baseTypography = {
  htmlFontSize: 16,
  fontSize: 14,
  fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
  h1: {
    fontFamily: '"Gilroy", "Helvetica", "Arial", sans-serif',
  },
  h2: {
    fontFamily: '"Gilroy", "Helvetica", "Arial", sans-serif',
  },
  h3: {
    fontFamily: '"Gilroy", "Helvetica", "Arial", sans-serif',
  },
  h4: {
    fontFamily: '"Gilroy", "Helvetica", "Arial", sans-serif',
  },
  h5: {
    fontFamily: '"Gilroy", "Helvetica", "Arial", sans-serif',
  },
  h6: {
    fontFamily: '"Gilroy", "Helvetica", "Arial", sans-serif',
  },
  body1: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
  },
  body2: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
  },
  subtitle1: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
  },
  subtitle2: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
  },
};

const commonThemeSettings = {
  components: {
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          height: 46,
        },
        sizeSmall: {
          height: 40,
        },
        root: {
          borderRadius: 10,
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgb(99, 99, 99)",
        },
      },
    },
  },
  typography: baseTypography,
};

const lightTheme = {
  palette: {
    mode: "light" as PaletteMode,
    primary: {
      main: colors.primaryColor,
    },
    secondary: {
      main: colors.secondaryColor,
    },
    background: {
      paper: colors.lightPaperColor,
      main: colors.lightBackgroundColor,
    },
    black: {
      main: "#000",
      light: "#000",
      dark: "#000",
      contrastText: "#fff",
    },
    white: {
      main: "#fff",
      light: "#fff",
      dark: "#fff",
      contrastText: "#000",
    },
  },
  ...commonThemeSettings,
};

const darkTheme = {
  palette: {
    mode: "dark" as PaletteMode,
    primary: {
      main: colors.primaryColor,
    },
    secondary: {
      main: colors.secondaryColor,
    },
    background: {
      paper: colors.darkPaperColor,
      main: colors.darkBackgroundColor,
    },
    black: {
      main: "#fff",
      light: "#fff",
      dark: "#fff",
      contrastText: "#000",
    },
    white: {
      main: "#000",
      light: "#000",
      dark: "#000",
      contrastText: "#fff",
    },
  },
  ...commonThemeSettings,
};

const AppThemeProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { lightTheme: lightThemeMode } = useSelector(
    (state: any) => state.theme,
  );
  const theme = useMemo(
    () => createTheme(lightThemeMode ? lightTheme : darkTheme),
    [lightThemeMode],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;
