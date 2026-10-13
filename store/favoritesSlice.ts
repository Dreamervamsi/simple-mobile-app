import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dataItem } from "../src/types";

interface FavoritesState {
  items: dataItem[];
  sharedWishlists: SharedWishlist[];
}

interface SharedWishlist {
  id: string;
  name: string;
  items: dataItem[];
  sharedBy: string;
  createdAt: string;
}

const initialState: FavoritesState = {
  items: [],
  sharedWishlists: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<dataItem>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
    addSharedWishlist: (state, action: PayloadAction<SharedWishlist>) => {
      state.sharedWishlists.push(action.payload);
    },
    removeSharedWishlist: (state, action: PayloadAction<string>) => {
      state.sharedWishlists = state.sharedWishlists.filter(w => w.id !== action.payload);
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites, addSharedWishlist, removeSharedWishlist } = favoritesSlice.actions;
export default favoritesSlice.reducer;
