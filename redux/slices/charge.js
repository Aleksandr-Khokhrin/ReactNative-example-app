import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";


export const fetchGetPlans = createAsyncThunk('auth/fetchGetPlans', async () => {
    try {
        const { data } = await axios.get('/api/v1/users/plans/');
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});
export const fetchCheckPlan = createAsyncThunk('auth/fetchCheckPlan', async (payload) => {
    try {
        const { data } = await axios.post('/api/v1/users/check-plan/', payload);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});


const initialState = {
    data: null,
    status: 'idle'
};

const chargeSlice = createSlice({
    name: 'charge',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetPlans.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGetPlans.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchGetPlans.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchCheckPlan.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCheckPlan.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchCheckPlan.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
    },
});


export const { reducer: chargeReducer, actions: { logout } } = chargeSlice;