import {combineReducers, configureStore} from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
const rootReducer = combineReducers({
    user:userReducer
});
// const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store=configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    })
});

