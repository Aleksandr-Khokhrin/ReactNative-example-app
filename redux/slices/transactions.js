import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchStartTransaction = createAsyncThunk('transaction/fetchStartTransaction', async (payload) => {
    try {
        const { data } = await axios.post('/api/v1/manager/Transaction', payload);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error);
    }
});

export const fetchStopTransaction = createAsyncThunk('transaction/fetchStopTransaction', async (payload) => {
    try {
        const { data } = await axios.post(`/api/v1/manager/Transaction/${payload.transaction_id}/stop`, { charge_point: payload.charge_point });
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error);
    }
});

export const fetchGetTransactionState = createAsyncThunk('manager/fetchGetTransactionState', async (transaction_id) => {
    const { data } = await axios.get(`/api/v1/manager/Transaction/${transaction_id}`);
    return data;
});

const initialState = {
    data: null,
    startTransactionStatus: 'idle',
    stopTransactionStatus: 'idle',
    transactionStateStatus: 'idle',
    error: null
};

const transactionsSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.startTransactionStatus = 'idle';
            state.stopTransactionStatus = 'idle';
            state.transactionStateStatus = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStartTransaction.pending, (state) => {
                state.startTransactionStatus = 'loading';
            })
            .addCase(fetchStartTransaction.fulfilled, (state, action) => {
                state.startTransactionStatus = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchStartTransaction.rejected, (state, action) => {
                state.startTransactionStatus = 'error';
                state.error = action.error.message;
                state.data = null;
            })
            .addCase(fetchStopTransaction.pending, (state) => {
                state.stopTransactionStatus = 'loading';
            })
            .addCase(fetchStopTransaction.fulfilled, (state, action) => {
                state.stopTransactionStatus = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchStopTransaction.rejected, (state, action) => {
                state.stopTransactionStatus = 'error';
                state.error = action.error.message;
                state.data = null;
            })
            .addCase(fetchGetTransactionState.pending, (state) => {
                state.transactionStateStatus = 'loading';
            })
            .addCase(fetchGetTransactionState.fulfilled, (state, action) => {
                state.transactionStateStatus = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchGetTransactionState.rejected, (state, action) => {
                state.transactionStateStatus = 'error';
                state.error = action.error.message;
                state.data = null;
            });
    },
});

export const { reducer: transactionsReducer, actions: { logout } } = transactionsSlice;
