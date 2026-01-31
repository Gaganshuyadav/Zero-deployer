import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/slices/userSlice";



const store = configureStore({
    reducer:{
        user: userSlice
    }
})



export default store;
export type AppDispatch = typeof store.dispatch;