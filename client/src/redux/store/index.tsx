import {configureStore} from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import collectionSlice from '../features/collectionSlice'
import itemSlice from '../features/itemSlice'
import searchSlice from '../features/searchSlice'
export const store = configureStore({
    reducer:{
        auth: authSlice,
        collections: collectionSlice,
        items: itemSlice,
        search: searchSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch