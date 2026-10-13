import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dataItem } from "../src/types";

interface RecentlyViewedState {
  items: dataItem[];
  maxItems: number;
}

const initialState: RecentlyViewedState = {
  items: [],
  maxItems: 20,
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addToRecentlyViewed: (state, action: PayloadAction<dataItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
      }
      state.items.unshift(action.payload);
      if (state.items.length > state.maxItems) {
        state.items = state.items.slice(0, state.maxItems);
      }
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
    },
  },
});

export const { addToRecentlyViewed, clearRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
