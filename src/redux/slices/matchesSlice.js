import { createSlice } from '@reduxjs/toolkit';
// createAsyncThunk


// Matches slice
const matchesSlice = createSlice({
    name: 'matches',
    initialState: {
        matches: [],
        loading: false,
        error: null,
    },
    reducers: {
        start: (state) => {
            state.loading = true
        },
        
        failure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        findMatchesSuccess: (state, action) => {
            state.loading = false
            state.matches = action.payload
            state.error = null
        },
        reinitializeMatchesState: (state) => {
            state.matches = [],
            state.loading = false,
            state.error = null
        },
        resetState: (state, action) => {
            state.loading = false,
            state.matches = [],
            state.error = null
        },
        requestSuccess: (state, action) => {
            state.loading = false;
            state.matches = state.matches.map(match => 
              match._id === action.payload._id ? { ...match, yourStatus: action.payload.yourStatus } : match
            );
            state.error = null;
          
        },
        // collabSuccess: (state, action) => {
        //     state.loding = false
        //     state.mates.push(action.payload)
        //     state.error = null
        // }
    },
    
});

export const {start, failure, findMatchesSuccess, requestSuccess, collabSuccess, resetState} = matchesSlice.actions


export default matchesSlice.reducer;
