import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useColorScheme } from 'react-native';

interface ThemeState {
  isDarkMode: boolean;
  systemTheme: 'light' | 'dark' | null;
}

const initialState: ThemeState = {
  isDarkMode: false,
  systemTheme: null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setSystemTheme: (state, action: PayloadAction<'light' | 'dark' | null>) => {
      state.systemTheme = action.payload;
    },
    followSystemTheme: (state) => {
      if (state.systemTheme) {
        state.isDarkMode = state.systemTheme === 'dark';
      }
    },
  },
});

export const { setDarkMode, toggleTheme, setSystemTheme, followSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;
