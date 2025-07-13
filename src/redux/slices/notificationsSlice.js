import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        setNotificationStart: (state) => {
            state.loading = true
        },
        
        notificationsFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        reinitializeNotifications:(state)=> {
            state.notifications= [],
            state.loading= false,
            state.error= null
        },
    

        setNotificationToState: (state, action) => {
            state.loading = false, 
            state.notifications = [action.payload, ...state.notifications]
            state.error = null
        }, 
        setNotificationsToState: (state, action) => {
            state.loading = false, 
            state.notifications = [...action.payload, ...state.notifications]
            state.error = null
        }, 
        removeNotificationFromState: (state, action) => {
            const {type, from , to } = action.payload
            return {
                //['scheduled_meeting, review, request, new_message]
                ...state,
                loading : false,
                error: null,
                notifications : state.notifications.filter(notification => {
                  
                        if(type === 'scheduled_meeting' && from === notification.from){
                            return false

                        }else if(type === 'new_message' && from === notification.from){
                            return false
                        }else if(type === 'review' && from === notification.from){
                            return false
                        }else if(type === 'request' && from === notification.from ) {
                            return false 
                        }
                        return true
                    
                } )
            }
        }
        
    
}});

export const {setNotificationStart, notificationsFailure,setNotificationToState,reinitializeNotifications, setNotificationsToState, removeNotificationFromState} = notificationSlice.actions 



export default notificationSlice.reducer