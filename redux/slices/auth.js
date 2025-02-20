import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk('users/login/', async (payload) => {
    try {
        const { data } = await axios.post('/api/v1/users/login/', payload);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});

export const fetchCode = createAsyncThunk('users/verify/', async (payload) => {
    try {
        const { data } = await axios.post('/api/v1/users/verify/', payload);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});

export const fetchUpdate = createAsyncThunk('users/update/', async (payload) => {
    try {
        const { data } = await axios.patch('/api/v1/users/update/', payload);
        return data;
    } catch (error) {
        throw Error(error);
    }
});

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    try {
        const { data } = await axios.get('/api/v1/users/me/');
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});
export const fetchDelete = createAsyncThunk('auth/fetchDelete', async () => {
    try {
        const { data } = await axios.delete('/api/v1/users/delete/');
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});

export const fetchRegister = createAsyncThunk('users/new/', async (payload) => {
    try {
        const { data } = await axios.post('/api/v1/users/new/', payload);
        return data;
    } catch (error) {
        throw Error(error.response.data.message);
    }
});

const initialState = {
    data: null,
    status: 'idle'
};

const authSlice = createSlice({
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
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchRegister.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            })
            .addCase(fetchUpdate.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUpdate.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchUpdate.rejected, (state) => {
                state.status = 'error';
                state.data = null;
            });
    },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const { reducer: authReducer, actions: { logout } } = authSlice;
