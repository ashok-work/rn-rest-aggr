
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteState {
  favoriteIds: string[];
}

const initialState: FavoriteState = {
  favoriteIds: [],
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favoriteIds = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter(favId => favId !== id);
      } else {
        state.favoriteIds.push(id);
      }
      AsyncStorage.setItem('favorites', JSON.stringify(state.favoriteIds));
    },
  },
});

export const { toggleFavorite, setFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
