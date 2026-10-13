import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Review {
  id: string;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsState {
  reviews: Review[];
}

const initialState: ReviewsState = {
  reviews: [],
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Review>) => {
      state.reviews.push(action.payload);
    },
  },
});

export const { addReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
