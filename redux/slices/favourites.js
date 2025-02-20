import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchSaveStation = createAsyncThunk('station/save/', async (payload) => {
    try {
        const { data } = await axios.post('/api/v1/users/charge-points/', payload);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});

export const fetchRemoveStation = createAsyncThunk(
    'station/remove/',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete('/api/v1/users/charge-points/', {
                data: payload,
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);





const initialState = {
    data: null,
    status: 'idle'
};

const favouriteSlice = createSlice({
    name: 'favourites',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // save
            .addCase(fetchSaveStation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSaveStation.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchSaveStation.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            // remove
            .addCase(fetchRemoveStation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRemoveStation.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchRemoveStation.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })

    },
});

export const { reducer: favouriteReducer, actions: { logout } } = favouriteSlice;
