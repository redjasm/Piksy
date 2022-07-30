import { createSlice } from '@reduxjs/toolkit';
// firebase
import { initializeApp } from 'firebase/app';
import {
  query,
  onSnapshot,
  getFirestore,
  addDoc,
  getDocs,
  collection,
  orderBy,
  startAt,
  endAt,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import { FIREBASE_API } from '../../config';
// utils
import axios from '../../utils/axios';
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
  events: [],
  isOpenModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'calendar',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;
      const updateEvent = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });

      state.isLoading = false;
      state.events = updateEvent;
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      const { eventId } = action.payload;
      const deleteEvent = state.events.filter((event) => event.id !== eventId);
      state.events = deleteEvent;
    },

    // SELECT EVENT
    selectEvent(state, action) {
      const eventId = action.payload;
      state.isOpenModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.isOpenModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent } = slice.actions;

// ----------------------------------------------------------------------

export function getEvents() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const events = [];
      (await getDocs(query(collection(db, "DanielTestEvents")))).forEach((doc) => {
        events.push({ ...doc.data(), id: doc.id });
      });
      dispatch(slice.actions.getEventsSuccess(events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(newEvent) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      (await addDoc(collection(db, "DanielTestEvents"), newEvent));
      // newEvent.id =  await doc().id;
      dispatch(slice.actions.createEventSuccess(newEvent));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
    // add doc.id to newEvent
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, updateEvent) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await updateDoc(doc(db, "DanielTestEvents", `${eventId}` ), updateEvent);
      dispatch(slice.actions.updateEventSuccess({ ...updateEvent, id: eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await deleteDoc(doc(db, "DanielTestEvents", `${eventId}` ))
      dispatch(slice.actions.deleteEventSuccess({ eventId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function selectRange(start, end) {
  return async () => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime(),
      })
    );
  };
}
