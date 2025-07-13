import { createSlice } from "@reduxjs/toolkit";


const matesSlice = createSlice({
    name: 'mates',
    initialState: {
        mates: [],
        loading: false,
        error: null,
    },
    reducers: {
        startForMate: (state) => {
            state.loading = true
        },
        
        failureForMate: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        reinitializeMates: (state) => {
            state.mates = [],
            state.loading = false,
            state.error = null
        },
     
        createMatesSuccess: (state, action) => {
            state.loading = false
            state.mates = action.payload
            state.error = null
        },
        deleteMatesSuccess: (state, action) => {
            state.loading = false,
            state.mates = state.mates.filter(mate => mate._id !== action.payload)
            state.error = null
        },

        getAllMatesSuccess: (state, action) => {
            state.loading = false;
            state.mates = action.payload
            state.error = null;
          
        },

        
        getMessagesSuccess: (state, action) =>{ 
            const { mateId, messages } = action.payload;
            return {
                ...state,
                loading: false,
                mates: state.mates.map(mate =>
                    mate._id === mateId ? {
                        ...mate,
                        messages: messages
                    } : mate
                ),
                error: null
            };
        },


        setMessageSuccess:(state, action) => {
            const { message, mateId } = action.payload;
            return {
                ...state,
                loading: false,
                mates: state.mates.map(mate =>
                    mate._id === mateId ? {
                        ...mate,
                        messages: [...mate.messages, message]
                    } : mate
                ),
                error: null
            };
        },

        deleteMessagesSuccess: (state, action) => {
            const {mateId, messageId} = action.payload

            state.loading = false, 
            state.mates = state.mates.map((mate) => {
                if (mate._id === mateId) {
                    return {
                        ...mate,
                        messages: mate.messages.filter(message => message._id !== messageId)
                    };
                }
                return mate;
            });
            state.error = null
        },

        setMeetingToState: (state, action) => {
            const {mateId, meeting} = action.payload
            return {
                ...state,
                loading: false,
                mates: state.mates.map(mate =>
                    mate._id === mateId ? {
                        ...mate,
                        meetings: [...mate.meetings, meeting]
                    } : mate
                ),
                error: null
            };
        },

        deleteMeetingFromState: (state, action) => {
            const {mateId, meetings} = action.payload

            return {
                ...state,
                loading: false,
                mates: state.mates.map(mate =>
                    mate._id === mateId ? {
                        ...mate,
                        meetings: meetings
                    } : mate
                ),
                error: null
            };
        },

        getMeetings: (state, action) => {
            const { mateId, meetings } = action.payload;
            return {
                ...state,
                loading: false,
                mates: state.mates.map(mate =>
                    mate._id === mateId ? {
                        ...mate,
                        meetings: meetings
                    } : mate
                ),
                error: null
            };
        }
    
    
}});


export const {reinitializeMates,startForMate, failureForMate,setSocket, createMatesSuccess, deleteMatesSuccess, getAllMatesSuccess, setMessageSuccess, getMessagesSuccess,deleteMessagesSuccess, setMeetingToState, deleteMeetingFromState, getMeetings} = matesSlice.actions

export default matesSlice.reducer