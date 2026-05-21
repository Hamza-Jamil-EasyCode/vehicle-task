import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DrawerState {
  openDrawer: boolean;
  isIconOnly: boolean;
  isSmallScreen: boolean;
}

const initialState: DrawerState = {
  openDrawer: true,
  isIconOnly: false,
  isSmallScreen: false,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.openDrawer = action.payload;
    },
    setIsIconOnly(state, action: PayloadAction<boolean>) {
      state.isIconOnly = action.payload;
    },
    setIsSmallScreen(state, action: PayloadAction<boolean>) {
      state.isSmallScreen = action.payload;
    },
  },
});

export const { setDrawerOpen, setIsIconOnly, setIsSmallScreen } =
  drawerSlice.actions;
export default drawerSlice.reducer;
