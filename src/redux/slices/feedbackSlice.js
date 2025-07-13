import { createSlice } from '@reduxjs/toolkit';


// Matches slice
const feedbackSlice = createSlice({
    name: 'feedbacks',
    initialState: {
        feedbacks: [],
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
        reinitializeFeedBack: (state) => {
            state.feedbacks= []
            state.loading= false
            state.error=null
        },
        getFeedbackSuccess: (state, action) => {
            state.loading = false
            state.feedbacks = action.payload || []
            state.error = null
        },
        addFeedbackSuccess: (state, action) => {
            state.loading = false,
            state.feedbacks = [...state.feedbacks, action.payload];
            state.error = null
        },

        deleteFeedbackSuccess: (state, action) => {
            state.loading = false;
            state.feedbacks = state.feedbacks.filter(feedback => 
                feedback._id !== action.payload
            );
            state.error = null;
          
        },

        updateFeedbackSuccess: (state, action) => {
            state.loading = false;
            state.feedbacks = state.feedbacks.map(feedback => {
                return feedback._id === action.payload._id ? {...feedback, rating: action.payload.rating, review: action.payload.review }: feedback
            })

            state.error = null;
        }
    }
    
});

export const {start, failure, getFeedbackSuccess, addFeedbackSuccess,reinitializeFeedBack, deleteFeedbackSuccess, updateFeedbackSuccess} = feedbackSlice.actions


export default feedbackSlice.reducer;
