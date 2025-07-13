// MediaStreamContext.js
import React, { createContext, useContext, useState } from 'react';

const MediaStreamContext = createContext();

export const useMediaStream = () => useContext(MediaStreamContext);

export const MediaStreamProvider = ({ children }) => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [toggleJoin, setToggleJoin] = useState(false)




  return (
    <MediaStreamContext.Provider value={{ myStream, setMyStream, remoteStream, setRemoteStream, toggleJoin, setToggleJoin
     }}>
      {children}
    </MediaStreamContext.Provider>
  );
};
