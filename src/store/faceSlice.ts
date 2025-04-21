// src/store/faceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FaceData {
  age: number;
  gender: string;
  expression?: string;
  box: FaceBox;
}

interface FaceState {
  faces: FaceData[];
}

const initialState: FaceState = {
  faces: [],
};

const faceSlice = createSlice({
  name: 'face',
  initialState,
  reducers: {
    setFaces: (state, action: PayloadAction<FaceData[]>) => {
      state.faces = action.payload;
    },
  },
});

export const { setFaces } = faceSlice.actions;
export default faceSlice.reducer;
