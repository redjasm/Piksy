import { createSlice } from '@reduxjs/toolkit';
// firebase
import { initializeApp } from 'firebase/app';
import { query, getFirestore, addDoc, getDocs, collection, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { FIREBASE_API } from '../../config';
//
import { dispatch } from '../store';
// ----------------------------------------------------------------------
// firebase constants
const app = initializeApp(FIREBASE_API);
const db = getFirestore(app);
// ----------------------------------------------------------------------
const initialState = {
  isLoading: false,
  error: null,
  customers: [],
  selectedCustomerId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CUSTOMERS
    getCustomersSuccess(state, action) {
      state.isLoading = false;
      state.customers = action.payload;
    },

    // CREATE CUSTOMER
    createCustomerSuccess(state, action) {
      const newCustomer = action.payload;
      state.isLoading = false;
      state.customers = [...state.customers, newCustomer];
    },

    // UPDATE CUSTOMER
    updateCustomerSuccess(state, action) {
      const customer = action.payload;
      const updateCustomer = state.customers.map((_customer) => {
        if (_customer.id === customer.id) {
          return customer;
        }
        return _customer;
      });

      state.isLoading = false;
      state.customers = updateCustomer;
    },

    // DELETE CUSTOMER
    deleteCustomerSuccess(state, action) {
      const { customerId } = action.payload;
      const deleteCustomer = state.customers.filter((customer) => customer.id !== customerId);
      state.customers = deleteCustomer;
    },

    // SELECT CUSTOMER
    selectCustomer(state, action) {
      const customerId = action.payload;
      state.selectedCustomerId = customerId;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { selectCustomer } = slice.actions;

// ----------------------------------------------------------------------

export function getCustomers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const customers = [];
      (await getDocs(query(collection(db, 'customers')))).forEach((doc) => {
        customers.push({ ...doc.data(), id: doc.id });
      });
      dispatch(slice.actions.getCustomersSuccess(customers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createCustomer(newCustomer) {
  addDoc(collection(db, 'customers'), newCustomer);
}

// ----------------------------------------------------------------------

export function updateCustomer(customer) {
  updateDoc(doc(db, 'customers', `${customer.id}`), customer);
}
// ----------------------------------------------------------------------

export function deleteCustomer(customerId) {
  deleteDoc(doc(db, 'customers', customerId));
}
