
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '../../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      const user: User = {
        id: 'u1',
        name: action.payload.name,
        email: action.payload.email,
        avatar: `https://i.pravatar.cc/150?u=${action.payload.email}`,
      };
      state.user = user;
      state.isAuthenticated = true;
      AsyncStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('user');
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
