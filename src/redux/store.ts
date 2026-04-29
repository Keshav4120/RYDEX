import {configureStore} from '@reduxjs/toolkit'
import userReducer from "./userSlice"
export const store = configureStore({
    reducer: {
        user:userReducer
    },
})
// hook use selector we use this to access the data
export type RootState = ReturnType<typeof store.getState>
// use dispatch we use this to put the data
export type AppDispatch = typeof store.dispatch