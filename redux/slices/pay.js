import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPayme = createAsyncThunk('user/pay/payme', async (sum) => {
    try {
        const { data } = await axios.post('/api/v1/users/payme/create/', sum);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});


const initialState = {
    data: null,
    status: 'idle'
};

const paySlice = createSlice({
    name: 'pay',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayme.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPayme.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchPayme.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
    },
});


export const { reducer: payReducer, actions: { logout } } = paySlice;
