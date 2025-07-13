import { configureStore } from '@reduxjs/toolkit';
import {persistStore, persistReducer} from "redux-persist"
import userReducer from './slices/userSlice';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import matchesReducer from './slices/matchesSlice'
import skillsReducer from './slices/skillsSlice'
import feedbackReducer from './slices/feedbackSlice'
import mateReducer from './slices/matesSlice'
import meetingReducer from './slices/videoCallSlice'
import notificationReducer from './slices/notificationsSlice'

const rootReducer = combineReducers({ user: userReducer, skills: skillsReducer, matches: matchesReducer, feedbacks: feedbackReducer, mates: mateReducer, meeting: meetingReducer, notifications: notificationReducer });


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  };

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
    reducer: persistedReducer,
    middleware:  (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
