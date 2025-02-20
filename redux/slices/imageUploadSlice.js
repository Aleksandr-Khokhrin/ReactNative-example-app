// src/redux/slices/imageUploadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const uploadImage = createAsyncThunk(
  'imageUpload/uploadImage',
  async (imageData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('picture', {
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.name,
      });

      const response = await axios.patch('/api/v1/users/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const imageUploadSlice = createSlice({
  name: 'imageUpload',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { reset } = imageUploadSlice.actions;
export default imageUploadSlice.reducer;
