
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '../../types';

interface ReviewState {
  reviews: Review[];
}

const savedReviews = localStorage.getItem('reviews');
const initialState: ReviewState = {
  reviews: savedReviews ? JSON.parse(savedReviews) : [
    {
      id: 'rev1',
      restaurantId: '1',
      userName: 'Alice Smith',
      userAvatar: 'https://i.pravatar.cc/150?u=alice',
      rating: 5,
      comment: 'The best burgers in town! The wagyu patty was perfectly cooked.',
      date: '2023-10-25T14:30:00.000Z'
    },
    {
      id: 'rev2',
      restaurantId: '1',
      userName: 'Bob Johnson',
      userAvatar: 'https://i.pravatar.cc/150?u=bob',
      rating: 4,
      comment: 'Great flavor, but delivery took a bit longer than expected.',
      date: '2023-11-02T18:15:00.000Z'
    }
  ],
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'date'>>) => {
      const newReview: Review = {
        ...action.payload,
        id: `rev-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
      };
      state.reviews = [newReview, ...state.reviews];
      localStorage.setItem('reviews', JSON.stringify(state.reviews));
    },
  },
});

export const { addReview } = reviewSlice.actions;
export default reviewSlice.reducer;
