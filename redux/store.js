import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from './slices/auth'
import { stationsReducer } from "./slices/stations";
import imageUploadSlice from "./slices/imageUploadSlice";
import { favouriteReducer } from "./slices/favourites";
import { faqReducer } from "./slices/faq";
import { payReducer } from "./slices/pay";
import { chargeReducer } from "./slices/charge";
import { transactionsReducer } from "./slices/transactions";

const store = configureStore({
    reducer: {
        auth: authReducer,
        stations: stationsReducer,
        imageUpload: imageUploadSlice,
        favourites: favouriteReducer,
        questions: faqReducer,
        pay: payReducer,
        charge: chargeReducer,
        transaction: transactionsReducer,
    }
});

export default store;
