import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";


export const fetchFaq = createAsyncThunk('other/faq', async () => {
    try {
        const { data } = await axios.get('/api/v1/users/questions/');
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});
export const fetchContact = createAsyncThunk('other/contact', async () => {
    try {
        const { data } = await axios.get('/api/v1/users/contact/');
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});





const initialState = {
    data: null,
    status: 'idle'
};

const FAQSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFaq.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFaq.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchFaq.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchContact.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContact.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchContact.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
    },
});


export const { reducer: faqReducer, actions: { logout } } = FAQSlice;
