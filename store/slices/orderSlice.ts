
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus } from '../../types';

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'status' | 'date'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: `ORD-${Math.floor(Math.random() * 900000) + 100000}`,
        status: OrderStatus.PENDING,
        date: new Date().toISOString(),
      };
      state.orders = [newOrder, ...state.orders];
      AsyncStorage.setItem('orders', JSON.stringify(state.orders));
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        AsyncStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
    cancelOrder: (state, action: PayloadAction<{ id: string; reason: string }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = OrderStatus.CANCELLED;
        order.cancelReason = action.payload.reason;
        AsyncStorage.setItem('orders', JSON.stringify(state.orders));
      }
    },
  },
});

export const { addOrder, updateOrderStatus, cancelOrder, setOrders } = orderSlice.actions;
export default orderSlice.reducer;
