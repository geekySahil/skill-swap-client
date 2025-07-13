// SocketContext.js

import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);




export const SocketProvider = ({ children }) => {

    const {currentUser} = useSelector(state => state.user)
    
    const socket = useMemo(() => io(`${import.meta.env.VITE_API_URI}`), []);


    if(currentUser){
        socket.emit('newUser', currentUser?._id);

    }


    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
