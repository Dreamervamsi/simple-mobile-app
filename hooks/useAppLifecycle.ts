import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadCachedData, fetchProducts } from '../store/dataSlice';
import { storeData } from '../utils/storage';

export const useAppLifecycle = () => {
  const appState = useRef(AppState.currentState);
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.data.items);

  useEffect(() => {
    // 1. Initial Load: Try to load from cache first
    dispatch(loadCachedData());
    
    // 2. Fetch fresh data if needed (optional, or triggered by index.tsx)
    // dispatch(fetchProducts());

    // 3. AppState Listener
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        console.log('App has come to the background!');
        // Save current items to storage just in case
        if (items.length > 0) {
          storeData('cached_products', items);
        }
      }

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // You could refresh data here if needed
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch, items]);

  return { appState: appState.current };
};
