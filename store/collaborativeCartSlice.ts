import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dataItem } from "../src/types";

interface CollaborativeCartState {
  sharedCarts: SharedCart[];
  currentSharedCart: SharedCart | null;
}

interface SharedCart {
  id: string;
  name: string;
  items: dataItem[];
  participants: string[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

const initialState: CollaborativeCartState = {
  sharedCarts: [],
  currentSharedCart: null,
};

const collaborativeCartSlice = createSlice({
  name: 'collaborativeCart',
  initialState,
  reducers: {
    createSharedCart: (state: CollaborativeCartState, action: PayloadAction<{ name: string; createdBy: string }>) => {
      const newCart: SharedCart = {
        id: Date.now().toString(),
        name: action.payload.name,
        items: [],
        participants: [action.payload.createdBy],
        createdBy: action.payload.createdBy,
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      state.sharedCarts.push(newCart);
      state.currentSharedCart = newCart;
    },
    addToSharedCart: (state: CollaborativeCartState, action: PayloadAction<{ cartId: string; item: dataItem }>) => {
      const cart = state.sharedCarts.find((c: SharedCart) => c.id === action.payload.cartId);
      if (cart) {
        const exists = cart.items.find((item: dataItem) => item.id === action.payload.item.id);
        if (!exists) {
          cart.items.push(action.payload.item);
        }
      }
    },
    removeFromSharedCart: (state: CollaborativeCartState, action: PayloadAction<{ cartId: string; itemId: number }>) => {
      const cart = state.sharedCarts.find((c: SharedCart) => c.id === action.payload.cartId);
      if (cart) {
        cart.items = cart.items.filter((item: dataItem) => item.id !== action.payload.itemId);
      }
    },
    addParticipant: (state: CollaborativeCartState, action: PayloadAction<{ cartId: string; participant: string }>) => {
      const cart = state.sharedCarts.find((c: SharedCart) => c.id === action.payload.cartId);
      if (cart && !cart.participants.includes(action.payload.participant)) {
        cart.participants.push(action.payload.participant);
      }
    },
    setCurrentSharedCart: (state: CollaborativeCartState, action: PayloadAction<SharedCart | null>) => {
      state.currentSharedCart = action.payload;
    },
    deleteSharedCart: (state: CollaborativeCartState, action: PayloadAction<string>) => {
      state.sharedCarts = state.sharedCarts.filter((c: SharedCart) => c.id !== action.payload);
      if (state.currentSharedCart?.id === action.payload) {
        state.currentSharedCart = null;
      }
    },
  },
});

export const { 
  createSharedCart, 
  addToSharedCart, 
  removeFromSharedCart, 
  addParticipant, 
  setCurrentSharedCart,
  deleteSharedCart 
} = collaborativeCartSlice.actions;
export default collaborativeCartSlice.reducer;
