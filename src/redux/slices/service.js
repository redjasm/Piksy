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
  services: [],
  selectedServiceId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'services',
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

    // GET SERVICES
    getServicesSuccess(state, action) {
      state.isLoading = false;
      state.services = action.payload;
    },

    // CREATE SERVICE
    createServiceSuccess(state, action) {
      const newService = action.payload;
      state.isLoading = false;
      state.services = [...state.services, newService];
    },

    // UPDATE SERVICE
    updateServiceSuccess(state, action) {
      const service = action.payload;
      const updateService = state.services.map((_service) => {
        if (_service.id === service.id) {
          return service;
        }
        return _service;
      });

      state.isLoading = false;
      state.services = updateService;
    },

    // DELETE SERVICE
    deleteServiceSuccess(state, action) {
      const { serviceId } = action.payload;
      const deleteService = state.services.filter((service) => service.id !== serviceId);
      state.services = deleteService;
    },

    // SELECT SERVICE
    selectService(state, action) {
      const serviceId = action.payload;
      state.selectedServiceId = serviceId;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { selectService } = slice.actions;

// ----------------------------------------------------------------------

export function getServices() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const services = [];
      (await getDocs(query(collection(db, 'services')))).forEach((doc) => {
        services.push({ ...doc.data(), id: doc.id });
      });
      dispatch(slice.actions.getServicesSuccess(services));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createService(newService) {
  addDoc(collection(db, 'services'), newService);
}
// ----------------------------------------------------------------------

export function updateService(service) {
  updateDoc(doc(db, 'services', `${service.id}`), service);
}
// ----------------------------------------------------------------------

export function deleteService(serviceId) {
  deleteDoc(doc(db, 'services', serviceId));
}
