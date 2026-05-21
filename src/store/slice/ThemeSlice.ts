import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  lightTheme: boolean;
  systemDefaultOption: boolean;
}

const initialState: ThemeState = {
  lightTheme: true,
  systemDefaultOption: true,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setLightTheme(state, action: PayloadAction<boolean>) {
      state.lightTheme = action.payload;
    },
    setSystemDefaultOption(state, action: PayloadAction<boolean>) {
      state.systemDefaultOption = action.payload;
    },
  },
});

export const { setLightTheme, setSystemDefaultOption } = themeSlice.actions;
export default themeSlice.reducer;
