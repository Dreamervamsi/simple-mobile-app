import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './dataSlice';
import cartReducer from './cartSlice';
import favoritesReducer from './favoritesSlice';
import collaborativeCartReducer from './collaborativeCartSlice';
import themeReducer from './themeSlice';
import comparisonReducer from './comparisonSlice';
import recentlyViewedReducer from './recentlyViewedSlice';
import reviewsReducer from './reviewsSlice';

export const store = configureStore({
  reducer: {
    data: dataReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    collaborativeCart: collaborativeCartReducer,
    theme: themeReducer,
    comparison: comparisonReducer,
    recentlyViewed: recentlyViewedReducer,
    reviews: reviewsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
