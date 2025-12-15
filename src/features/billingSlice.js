import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  corporateBills: [
    {
      id: "CORP-0001",
      corporateName: "X Ltd",
      contactPerson: "XYZ",
      contactNo: "0178888",
      billingDate: "2025-01-04",
      billingType: "Corporate",
      totalPackages: 60,
      lineItems: [
        {
          id: 1,
          serviceDate: "2025-01-01",
          packageType: "standard",
          persons: 50,
          unitPrice: 200,
          lineTotal: 10000
        }
      ],
      totalAmount: 10000,
      amountInWords: "BDT Ten Thousand Only"
    }
  ],
  eventBills: [
    {
      id: "EVT-0001",
      eventName: "X Event",
      contactPerson: "XYZ",
      contactNo: "0178888",
      eventDate: "2025-01-04",
      billingType: "Event",
      totalPackages: 60,
      packages: [
        {
          id: 1,
          packageName: "Package-1",
          packageType: "economy",
          foodItems: "Rice, Chicken, Salad",
          persons: 30,
          unitPrice: 200,
          lineTotal: 6000
        }
      ],
      totalAmount: 6000,
      amountInWords: "BDT Six Thousand Only"
    }
  ]
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    addCorporateBill: (state, action) => {
      const newBill = {
        ...action.payload,
        id: `CORP-${Date.now()}`
      };
      state.corporateBills.push(newBill);
      localStorage.setItem('cloudKitchenBills', JSON.stringify(state));
    },
    addEventBill: (state, action) => {
      const newBill = {
        ...action.payload,
        id: `EVT-${Date.now()}`
      };
      state.eventBills.push(newBill);
      localStorage.setItem('cloudKitchenBills', JSON.stringify(state));
    },
    deleteCorporateBill: (state, action) => {
      state.corporateBills = state.corporateBills.filter(bill => bill.id !== action.payload);
      localStorage.setItem('cloudKitchenBills', JSON.stringify(state));
    },
    deleteEventBill: (state, action) => {
      state.eventBills = state.eventBills.filter(bill => bill.id !== action.payload);
      localStorage.setItem('cloudKitchenBills', JSON.stringify(state));
    },
    updateCorporateBill: (state, action) => {
      const index = state.corporateBills.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) state.corporateBills[index] = action.payload;
      localStorage.setItem('cloudKitchenBills', JSON.stringify(state));
    },
    updateEventBill: (state, action) => {
      const index = state.eventBills.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) state.eventBills[index] = action.payload;
      localStorage.setItem('cloudKitchenBills', JSON.stringify(state));
    }
  }
});

export const {
  addCorporateBill,
  addEventBill,
  deleteCorporateBill,
  deleteEventBill,
  updateCorporateBill,
  updateEventBill
} = billingSlice.actions;

export default billingSlice.reducer;