import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@store/slice/AuthSlice";
import themeReducer from "@store/slice/ThemeSlice";
import drawerReducer from "@store/slice/DrawerSlice";
import { persistStore } from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "./storage/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "chat", "drawer", "document"],
};

const reducers = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  drawer: drawerReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useDispatch, useSelector } from "react-redux";
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
