import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dataItem } from "../src/types";

interface ComparisonState {
  items: dataItem[];
  maxItems: number;
}

const initialState: ComparisonState = {
  items: [],
  maxItems: 4,
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison: (state, action: PayloadAction<dataItem>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists && state.items.length < state.maxItems) {
        state.items.push(action.payload);
      }
    },
    removeFromComparison: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearComparison: (state) => {
      state.items = [];
    },
  },
});

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions;
export default comparisonSlice.reducer;
