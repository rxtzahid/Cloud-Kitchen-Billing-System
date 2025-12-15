import { configureStore, createSlice } from '@reduxjs/toolkit';

const billsSlice = createSlice({
  name: 'bills',
  initialState: {
    items: [
      {
        id: 'EVT-0001',
        name: 'X Event',
        date: '2025-01-04',
        contact: 'XXZ<br>07588888',
        total: 6000,
        type: 'event'
      },
      {
        id: 'CORP-0001',
        name: 'X Ltd',
        date: '2025-01-04',
        contact: 'XYZ<br>0178888',
        total: 10000,
        type: 'corporate'
      }
    ]
  },
  reducers: {
    addBill: (state, action) => {
      state.items.push(action.payload);
    },
    updateBill: (state, action) => {
      const index = state.items.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteBill: (state, action) => {
      state.items = state.items.filter(bill => bill.id !== action.payload);
    },
    resetBills: (state) => {
      state.items = [];
    }
  }
});

export const { addBill, updateBill, deleteBill, resetBills } = billsSlice.actions;

export const store = configureStore({
  reducer: {
    bills: billsSlice.reducer
  }
});