
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Address } from '../../types';

interface AddressState {
  addresses: Address[];
}

const initialState: AddressState = {
  addresses: [
    { id: '1', label: 'Home', fullAddress: '123 Food Street, Delicious City, 90210', phone: '+1 234 567 890', isDefault: true }
  ],
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action: PayloadAction<Omit<Address, 'id'>>) => {
      const newAddr = { ...action.payload, id: Math.random().toString(36).substr(2, 9) };
      if (newAddr.isDefault) {
        state.addresses.forEach(a => a.isDefault = false);
      }
      state.addresses.push(newAddr);
      AsyncStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
    updateAddress: (state, action: PayloadAction<{ id: string; data: Omit<Address, 'id'> }>) => {
      const index = state.addresses.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        if (action.payload.data.isDefault) {
          state.addresses.forEach(a => a.isDefault = false);
        }
        state.addresses[index] = { ...action.payload.data, id: action.payload.id };
        AsyncStorage.setItem('addresses', JSON.stringify(state.addresses));
      }
    },
    deleteAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      AsyncStorage.setItem('addresses', JSON.stringify(state.addresses));
    },
  },
});

export const { addAddress, updateAddress, deleteAddress, setAddresses } = addressSlice.actions;
export default addressSlice.reducer;
