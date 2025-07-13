import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
    meetings: [],
    reauthenticationRequired: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart(state, action) {
            state.loading = true
        },
        signInSuccess(state, action) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false
        },
        reinitializeUserState(state) {
          
                state.currentUser= null,
                state.loading= false,
                state.error= null,
                state.meetings= [],
                state.reauthenticationRequired= false
            
        },
        signInFailure(state, action){
            state.loading = false;
            state.error = action.payload
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
            state.meetings= [],
            state.reauthenticationRequired = false
        },
        updateUserStart: (state) => {
            state.loading = true
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = false
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = false
        }, 
        setMeetings:(state, action) => {
            state.meetings = action.payload
        },
        setReauthenticationRequired: (state, action) => {
            state.reauthenticationRequired = action.payload 
        },
        

    },
});

export const { signInSuccess, signInFailure, signInStart,reinitializeUserState, signOut, updateUserStart, updateUserSuccess, updateUserFailure,setMeetings,setReauthenticationRequired } = userSlice.actions;

export default userSlice.reducer;
