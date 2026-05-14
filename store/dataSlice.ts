import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { dataItem } from '../src/types';
import { getData, storeData } from '../utils/storage';

interface DataState {
  items: dataItem[];
  loading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  searchQuery: string;
  skip: number;
  total: number;
  limit: number;
}

const initialState: DataState = {
  items: [],
  loading: false,
  isFetchingMore: false,
  error: null,
  searchQuery: '',
  skip: 0,
  total: 0,
  limit: 10,
};

// Async thunk to fetch products with pagination
export const fetchProducts = createAsyncThunk(
  'data/fetchProducts',
  async ({ skip, limit, query }: { skip: number; limit: number; query?: string }, { rejectWithValue }) => {
    try {
      const url = query 
        ? `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return { products: data.products, total: data.total, skip };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to load cached data
export const loadCachedData = createAsyncThunk(
  'data/loadCachedData',
  async () => {
    const cachedData = await getData('cached_products');
    return cachedData || [];
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.skip = 0; // Reset pagination on search
      state.items = []; // Clear items on new search
    },
    resetPagination: (state) => {
      state.skip = 0;
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        if (action.meta.arg.skip === 0) {
          state.loading = true;
        } else {
          state.isFetchingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isFetchingMore = false;
        if (action.payload.skip === 0) {
          state.items = action.payload.products;
        } else {
          state.items = [...state.items, ...action.payload.products];
        }
        state.total = action.payload.total;
        state.skip = action.payload.skip + action.payload.products.length;
        
        // Cache data locally (only first page for now)
        if (action.payload.skip === 0) {
          storeData('cached_products', action.payload.products);
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isFetchingMore = false;
        state.error = action.payload as string;
      })
      .addCase(loadCachedData.fulfilled, (state, action: PayloadAction<dataItem[]>) => {
        if (state.items.length === 0) {
          state.items = action.payload;
        }
      });
  },
});

export const { setSearchQuery, resetPagination } = dataSlice.actions;
export default dataSlice.reducer;

