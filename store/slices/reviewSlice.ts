
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review } from '../../types';

interface ReviewState {
  reviews: Review[];
}

const initialState: ReviewState = {
  reviews: [
    {
      id: 'rev1',
      restaurantId: '1',
      userName: 'Alice Smith',
      userAvatar: 'https://i.pravatar.cc/150?u=alice',
      rating: 5,
      comment: 'The best burgers in town! The wagyu patty was perfectly cooked.',
      date: '2023-10-25T14:30:00.000Z'
    }
  ],
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
    addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'date'>>) => {
      const newReview: Review = {
        ...action.payload,
        id: `rev-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
      };
      state.reviews = [newReview, ...state.reviews];
      AsyncStorage.setItem('reviews', JSON.stringify(state.reviews));
    },
  },
});

export const { addReview, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
