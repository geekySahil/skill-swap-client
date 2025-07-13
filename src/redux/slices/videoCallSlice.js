import { createSlice } from '@reduxjs/toolkit';

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        isStarted: false,
        myStream: null,
        remoteSocketId: null,
        remoteStream: null,
        videoMutedStream:[] ,
        audioMutedStream: [] ,
        chatMessages: [],
        expandedStream: null

    },
    reducers: {
       setExpandedStream: (state, action) => {
        state.expandedStream = action.payload
       },
       setAudioMutedStream: (state, action) => {
        const stream = action.payload;
        if (state.audioMutedStream?.includes(stream)) {
            state.audioMutedStream = state.audioMutedStream.filter((str) => str !== stream);
        } else {
            state.audioMutedStream = [...state.audioMutedStream, stream];
        }
       },
       reinitializeMeetingState : (state) => {
        return {
            ...state,
            isStarted: false,
            myStream: null,
            remoteSocketId: null,
            remoteStream: null,
            videoMutedStream:[] ,
            audioMutedStream: [] ,
            chatMessages: [],
            expandedStream: null
        }
       },
       setIsStarted: (state, action) => {
            state.isStarted = action.payload
       },
       setMyStream: (state, action) => {
            // console.log('action.payload/ stream', action.payload)
            state.myStream = action.payload
            // console.log('New state.myStream:', state.myStream);
       },
       setRemoteStream:(state, action) => {
            state.remoteStream = action.payload
       },
       setRemoteSocketId: (state, action) => {
        state.remoteSocketId = action.payload
       },
       setVideoMutedStream: (state, action) => {
        const stream = action.payload;
            if (state.videoMutedStream.includes(stream)) {
                state.videoMutedStream = state.videoMutedStream.filter((str) => str !== stream);
            } else {
                state.videoMutedStream = [...state.videoMutedStream, stream];
            }

       },
       setChatMessages: (state, action) => {
        state.chatMessages.push(action.payload)
       },
       deleteChat: (state) => {
        state.chatMessages = []
       }
    }
    
});

export const {setExpandedStream, setIsStarted,setMyStream, setRemoteSocketId,reinitializeMeetingState,  setRemoteStream, setAudioMutedStream,setVideoMutedStream,setChatMessages } = meetingSlice.actions


export default meetingSlice.reducer;
