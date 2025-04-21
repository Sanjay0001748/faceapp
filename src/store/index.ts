import { configureStore } from '@reduxjs/toolkit';
import faceReducer from './faceSlice';

const store = configureStore({
  reducer: {
    face: faceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
