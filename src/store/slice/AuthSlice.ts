import { createSlice } from '@reduxjs/toolkit';
interface UserInfoInterface {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phone: string;
    role: 'USER';
}

interface AuthState {
    userInfo: UserInfoInterface | null;
}

const initialState: AuthState = {
    userInfo: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload }) => {
            state.userInfo = payload.data;
        },
        logout: (state) => {
            state.userInfo = null;
        },
        updateUserInfo: (state, { payload }) => {
            if (state.userInfo) {
                state.userInfo = {
                    ...state.userInfo,
                    ...payload
                };
            }
        }
    }
});

export const { login, logout, updateUserInfo } = authSlice.actions;

export default authSlice.reducer;
