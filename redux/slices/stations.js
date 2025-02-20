import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";


export const fetchStations = createAsyncThunk('manager/ChargePoints', async () => {
    const { data } = await axios.get(`/api/v1/manager/ChargePoint`);
    return data;
})
export const fetchStation = createAsyncThunk('manager/ChargePoint', async (id) => {
    const { data } = await axios.get(`/api/v1/manager/ChargePoint/${id}`);
    return data;
})
export const fetchStationSearch = createAsyncThunk('manager/ChargePoint/search', async (value) => {
    const { data } = await axios.get(`/api/v1/manager/ChargePoint?q=${value}`);
    return data;
})


const initialState = {
    stations: {
        items: [],
        status: 'loading',
    },
    station: {
        item: [],
        status: 'loading',
    },
}

const stationsSlice = createSlice({
    name: 'stations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //Получение всех станций
            .addCase(fetchStations.pending, (state) => {
                state.stations.items = [];
                state.stations.status = 'loading';
            })
            .addCase(fetchStations.fulfilled, (state, action) => {
                state.stations.items = action.payload;
                state.stations.status = 'loaded';
            })
            .addCase(fetchStations.rejected, (state) => {
                state.stations.items = [];
                state.stations.status = 'error';
            })
            //Получение одной станции
            .addCase(fetchStation.pending, (state) => {
                state.station.item = [];
                state.station.status = 'loading';
            })
            .addCase(fetchStation.fulfilled, (state, action) => {
                state.station.item = action.payload;
                state.station.status = 'loaded';
            })
            .addCase(fetchStation.rejected, (state) => {
                state.station.item = [];
                state.station.status = 'error';
            })
            //Поиск
            .addCase(fetchStationSearch.pending, (state) => {
                state.stations.items = [];
                state.stations.status = 'loading';
            })
            .addCase(fetchStationSearch.fulfilled, (state, action) => {
                state.stations.items = action.payload;
                state.stations.status = 'loaded';
            })
            .addCase(fetchStationSearch.rejected, (state) => {
                state.stations.items = [];
                state.stations.status = 'error';
            })
    },
});

export const { reducer: stationsReducer } = stationsSlice; // Export the postsReducer
