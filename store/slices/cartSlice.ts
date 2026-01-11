
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Dish } from '../../types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ dish: Dish; restaurantId: string }>) => {
      const { dish, restaurantId } = action.payload;
      
      if (state.items.length > 0 && state.items[0].restaurantId !== restaurantId) {
          // In a real Redux app, you'd handle the 'confirm' logic in a component/middleware
          // This reducer assumes the check happened before dispatch if necessary
          state.items = [{ ...dish, quantity: 1, restaurantId }];
          return;
      }

      const existing = state.items.find((item) => item.id === dish.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...dish, quantity: 1, restaurantId });
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; delta: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.delta;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
