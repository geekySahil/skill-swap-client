import React, { useEffect, useCallback, useState, useRef } from 'react';
import peer from '../services/peer';
import { useSocket } from '../utils/socketContext';
import { useDispatch, useSelector } from 'react-redux';
import { setExpandedStream, setRemoteSocketId } from '../redux/slices/videoCallSlice';
import Video from '../components/Video';
import ChatComponent from '../components/chat';
import { useMediaStream } from '../utils/meadiaStreamContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { fetchWithAuth } from '../utils/refreshToken';


function VideoCall() {
  const socket = useSocket();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation()
  const {mateId, meetingId } = location.state
  const { remoteSocketId } = useSelector((state) => state.meeting);
  const [expandedStream, setExpandedStream] = useState(null);
  const { myStream, setMyStream, remoteStream, setRemoteStream, toggleJoin, setToggleJoin } = useMediaStream();
  const myStreamRef = useRef(myStream);
  const remoteStreamRef = useRef(remoteStream);
  const streamsSentRef = useRef(false);
  const [audioMutedStream, setAudioMutedStream] = useState([]);
  const [videoMutedStream, setVideoMutedStream] = useState([]);
  const [leaveConfirmation, setLeaveConfirmation] = useState(false)

  useEffect(() => {
    myStreamRef.current = myStream;
    remoteStreamRef.current = remoteStream;
    setAudioMutedStream([myStream]);
  }, [myStream, remoteStream]);

  // console.log('myStreamRef.current', myStream)

  useEffect(() => {
    if (myStream && !toggleJoin) {
      setToggleJoin(true);
    }
  }, [myStream]);

  const clearMeeting = async () => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/cancel-meeting/${mateId}`, {
       method: 'DELETE',
       headers: {
          'Content-Type': 'application/json'
      },
       body: JSON.stringify({meetingId}),
       credentials:'include'
   }, dispatch)
     } catch (error) {
      console.log(error)
     }
  
  }

  
  const handleUserJoined = useCallback(async ({ user, id }) => {
    console.log(`${user} joined room with socket id: ${id}`);
    dispatch(setRemoteSocketId(id));
  });

  const handleUserLeft = ({ from }) => {
    // console.log(`${from} left the meeting`);

    setLeaveConfirmation(true);
  };

  const confirmCloseMeeting = () => {
   handleLeaveMeeting()

   peer.closeConnection()

   
  }

   
  const handleCallUser = useCallback(async () => {
    console.log('HANDLE CALL USER TRIGGERED')
    if (myStream) {
      setToggleJoin(!toggleJoin);
      return;
    }
    setToggleJoin(!toggleJoin);
   try {
     const stream = await navigator.mediaDevices.getUserMedia({
       audio: true,
       video: true,
     });
 
     setMyStream(stream);
 
     const offer = await peer.getOffer();
     console.log(offer, 'OFFER')
     socket.emit('user:call', { to: remoteSocketId, offer });
   } catch (error) {
    console.log('ERROR HANDLE CALL USER ', error)
   }
  }, [socket, remoteSocketId]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    dispatch(setRemoteSocketId(from));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
  
      setMyStream(stream);
      const answer = await peer.getAnswer(offer);
  
      socket.emit('call:accepted', { answer, to: from });
    } catch (error) {
      console.log('ERRROR', error)
    }
  }, []);

  const sendStreams = useCallback(async () => {
    if (streamsSentRef.current) return;

    for (const track of myStreamRef.current.getTracks()) {
      peer.peer.addTrack(track, myStreamRef.current);
      // console.log('track event triggered ')
    }

    streamsSentRef.current = true;
  }, [myStream]);

  const handleAcceptCall = useCallback(async (answer) => {
    peer.setLocal(answer.answer);
    sendStreams();
  }, [sendStreams]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit('peer:nego:needed', { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleIceCandidata = useCallback(async (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', { candidate: event.candidate, to: remoteSocketId });
    }
  }, [remoteSocketId, socket]);

  const addCandidate = useCallback(async ({ candidate }) => {
    try {
      await peer.peer.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding received ICE candidate', error);
    }
  }, []);

  const handleConnectionStateChange = useCallback(() => {
    if (peer.peer.connectionState === 'failed') {
      console.error('Connection state is failed.');
    }
  }, []);

  useEffect(() => {
    peer.peer?.addEventListener('negotiationneeded', handleNegoNeeded);
    peer.peer?.addEventListener('connectionstatechange', handleConnectionStateChange);
    return () => {
      peer.peer?.removeEventListener('negotiationneeded', handleNegoNeeded);
      peer.peer?.removeEventListener('connectionstatechange', handleConnectionStateChange);
    };
  }, [handleNegoNeeded, handleConnectionStateChange]);

  useEffect(() => {
    peer.peer?.addEventListener('icecandidate', handleIceCandidata);

    return () => {
      peer.peer?.removeEventListener('icecandidate', handleIceCandidata);
    };
  }, [handleIceCandidata]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit('peer:nego:done', { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocal(ans);
  }, []);

  
  
  

  useEffect(() => {
    const handleTrackEvent = (ev) => {
      const remoteStream = ev.streams[0];
      setRemoteStream(remoteStream);
      sendStreams();
    };
    peer?.peer?.addEventListener('track', handleTrackEvent);
    return () => {
      peer?.peer?.removeEventListener('track', handleTrackEvent);
    };
  }, [sendStreams]);



  const handleLeaveMeeting = useCallback(() => {
    dispatch(setRemoteSocketId(null));
    
    setToggleJoin(false);
  
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    

    
    setMyStream(null);
    setRemoteStream(null);
    streamsSentRef.current = false;
    navigate(-1);

  }, [socket, dispatch, navigate]);
  
  const handleLeaveMeetingButton = () => {
    socket.emit('user:left', {from: socket.id, to:remoteSocketId})

    handleLeaveMeeting()

    clearMeeting()


  }

  const handleToggleAudio = async (stream) => {
    setAudioMutedStream((prev) => {
      if (prev.includes(stream)) {
        return prev.filter((s) => s !== stream);
      } else {
        return [...prev, stream];
      }
    });
  };

  
  

  const handleToggleVideo = (stream) => {
    setVideoMutedStream((prev) => {
      if (prev.includes(stream)) {
        if (stream === myStream) {
          myStream.getVideoTracks().forEach((track) => {
            track.enabled = true;
          });
        }
        return prev.filter((s) => s !== stream);
      } else {
        if (stream === myStream) {
          myStream.getVideoTracks().forEach((track) => {
            track.enabled = false;
          });
        }
        return [...prev, stream];
      }
    });
  };

  const handleScreenSize = (stream) => {
    if (expandedStream === stream) {
      setExpandedStream(null);
      return;
    }
    setExpandedStream(stream);
  };

  useEffect(() => {
    socket.on('user:joined', handleUserJoined);
    socket.on('incoming:call', handleIncomingCall);
    socket.on('call:accepted', handleAcceptCall);
    socket.on('peer:nego:needed', handleNegoNeedIncomming);
    socket.on('peer:nego:final', handleNegoNeedFinal);
    socket.on('ice-candidate', addCandidate);
    socket.on('user:left', handleUserLeft)

    return () => {
      socket.off('user:joined', handleUserJoined);
      socket.off('incoming:call', handleIncomingCall);
      socket.off('call:accepted', handleAcceptCall);
      socket.off('peer:nego:needed', handleNegoNeedIncomming);
      socket.off('peer:nego:final', handleNegoNeedFinal);
      socket.off('ice-candidate', addCandidate);
      socket.on('user:left', handleUserLeft)


    };
  }, [socket, handleUserJoined, handleIncomingCall, handleAcceptCall]);

  console.log('remotesocket id ', remoteSocketId)
  // console.log('remoteStream', remoteStream)
  // console.log('myStream', myStream)
  // console.log('peer.peer', peer.peer?.remoteDescription)
  // console.log('toggle join', toggleJoin)


  if (!toggleJoin) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-900">
        {remoteSocketId ? (
          <div className="text-white text-center">
            <p>Your Learning Mate Has Joined The Meeting. Now you can Join</p>
            <button className="bg-blue-600 px-4 py-2 mt-3 text-xl text-white rounded" onClick={handleCallUser}>
              Join
            </button>
          </div>
        ) : (
          <p className="text-white text-center">Waiting for the Mate to join...</p>
        )}
      </div>
    );
  }
  

  return (
    <div className="flex w-screen h-screen bg-gray-300 overflow-hidden">
      {expandedStream ? (
        <div className="flex w-full h-full">
            <Video
              stream={expandedStream}
              handleLeaveMeeting={handleLeaveMeetingButton}
              handleToggleAudio={handleToggleAudio}
              handleToggleVideo={handleToggleVideo}
              handleScreenSize={handleScreenSize}
              videoMutedStream={videoMutedStream}
              audioMutedStream={audioMutedStream}
              isExpanded
            />
        </div>
      ) : (
        <div className="flex w-full">
          <div className="flex flex-col h-1/2 w-1/2 justify-around">
            <Video
              stream={myStream}
              handleLeaveMeeting={handleLeaveMeetingButton}
              handleToggleAudio={handleToggleAudio}
              handleToggleVideo={handleToggleVideo}
              handleScreenSize={handleScreenSize}
              videoMutedStream={videoMutedStream}
              audioMutedStream={audioMutedStream}
              isMyStream
            />
            <Video
              stream={remoteStream}
              handleLeaveMeeting={null}
              handleToggleAudio={handleToggleAudio}
              handleToggleVideo={handleToggleVideo}
              handleScreenSize={handleScreenSize}
              videoMutedStream={videoMutedStream}
              audioMutedStream={audioMutedStream}
            />
          </div>
          <div className="flex-grow h-screen overflow-hidden">
            <ChatComponent mateId={remoteSocketId} />
          </div>
        </div>
      )}
      <Modal
      isOpen={leaveConfirmation}
      onClose={confirmCloseMeeting}
      message= {`User left the meeting`}
      />
    </div>
  );
}

export default VideoCall;
