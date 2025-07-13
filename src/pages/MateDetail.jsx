import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBell, FaComment, FaVideo, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import MeetingModalForm from '../components/SetMeeting';
import { deleteMeetingFromState, failureForMate, getMeetings, setMeetingToState } from '../redux/slices/matesSlice';
import ConfirmationModal from '../components/ConfirmationModal';
import { useSocket } from '../utils/socketContext';
import { fetchWithAuth } from '../utils/refreshToken';

const MateDetails = () => {
    const {loading , error, notifications} = useSelector(state => state.notifications)
    const {mates} = useSelector(state => state.mates);
    const location = useLocation()
    const dispatch = useDispatch()
    const mateId = location.state.mateId
    const navigate = useNavigate()
    const [showMeetingForm, setShowMeetingForm] = useState(false)
    const mate = mates.filter(mate => mate._id === mateId)[0]
    const meetings = mate.meetings
    const notificationsForUser = notifications?.filter(notification => notification.from !== mate.user._id)[0]
    const {currentUser} = useSelector(state => state.user)
    const [showModal, setShowModal] = useState(false);
    const socket = useSocket()

    console.log('MATE.MEETINGS', mate.meetings)

 
    
  const formattedTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    // Check if the message date is yesterday
    const isYesterday =
      date.getDate() === now.getDate() - 1 &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    // Format the time
    let timeString = "";
    if (isYesterday) {
      timeString = "Yesterday";
    } else {
      timeString = `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    return timeString;
  };


  const note = `Meeting scheduled at ${formattedTime(new Date())} by ${currentUser.username}`



    const getAllMeetings = async () => {
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/meetings/${mateId}`, {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }, dispatch)

            

            const result = await res.json();

            if(result.statusCode !== 200){
                dispatch(failureForMate(result.message));
                return
            }


            dispatch(getMeetings({meetings: result.data, mateId: mateId})); 

        } catch (error) {
            dispatch(failureForMate(error.message))
        }
    }

    const saveNotifications = async(message) => {
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/notifications/set-notification`, {
                method: 'PUT',
                headers:{
                   'Content-Type':'application/json'
                } ,
                body: JSON.stringify({type: 'scheduled_meeting', note: message, to: mate.user._id}),
                credentials: 'include'
            },dispatch)
    
            const result = await res.json() 
        } catch (error) {
          console.log(error.message)
        }
    }

    const onChat = () => {
        navigate( `/mates/chat/${mate._id}`, {state: {mateId: mate._id}})
    }

    const onSetMeeting = async(data) => {


        const {topic, time} = data;
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/set-meeting/${mate._id}`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({topic, time}),
                credentials: 'include'
            }, dispatch)

            

            const result = await res.json();
            console.log(result.data, 'MEETINGS');

            if(result.statusCode !== 200){
                dispatch(failureForMate(result.message))
            }
            dispatch(setMeetingToState({meeting:result.data, mateId : mate._id}))
            // await saveNotifications(`Meeting scheduled at ${formattedTime(result.data.time)} by ${currentUser.username}`)
            socket.emit('notification', {type: 'scheduled_meeting',from: currentUser._id, to:mate.user._id, note })
        } catch (error) {
            dispatch(failureForMate(error.message))
            
        }
    }


      const joinMeeting = useCallback(
        (meeting) => {
            socket.emit('room:join', {user: currentUser.username, roomId: meeting._id})
        },
        [socket]
      );

      const handleJoinRoom = useCallback(
        (data) => {
          const { user, roomId} = data;
        //   console.log('room id', roomId)
          navigate(`/videoCall/${roomId}`, {state: {mateId: mate._id, meetingId : roomId }});
        },
        [navigate]
      );
    
    
      useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        return () => {
          socket.off("room:join", handleJoinRoom);
        };
      }, [socket, handleJoinRoom]);


    const cancelMeetingConfirmation = () => {
        setShowModal(true)
    }

    const cancelMeeting = async(meetingId) => {
       try {
        console.log('meeting id', meetingId)

         const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/cancel-meeting/${mate._id}`, {
             method: 'DELETE',
             headers: {
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({meetingId}),
             credentials:'include'
    }, dispatch)


 
         const result = await res.json()
         console.log(result)
         if(result.statusCode !== 200){
             dispatch(failureForMate(result.message));
             return
         }
 
         dispatch(deleteMeetingFromState({mateId: mateId, meetings: result.data}))
       } catch (error) {
        dispatch(failureForMate(error.message));
        
       }
       setShowModal(false)
    }



    const handleShowMeetingForm = () => {
        setShowMeetingForm(true)
    } 

    const closeMeetingForm = () => {
        setShowMeetingForm(false)
    }



    useEffect(() => {

       getAllMeetings()

    }, [showMeetingForm])

    
    return (
        <div className="flex flex-col h-screen w-full mx-auto border rounded-lg shadow-lg bg-gray-100 p-4">
   
        <div className="flex flex-grow space-x-6">
         
           

            <div className="flex flex-col w-full bg-white rounded-lg shadow p-6 mb-6 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-slate-600">Scheduled Meetings</h3>
                {meetings?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meetings.map((meeting, index) => (
                            <div key={index} className="flex flex-col mb-4 p-4 bg-gray-100 border-gray-400 rounded-lg">
                                <p className="text-xl my-3">
                                    Meeting Scheduled By <span className='font-bold font-serif'>{meeting?.scheduledBy._id === currentUser?._id ? meeting?.scheduledWith.username: meeting?.scheduledBy.username}</span> at <span className="text-lg text-blue-600">{new Date(meeting?.time).toLocaleString()}</span>
                                </p>
                              
                                <p className="text-bold my-2">Topic: {meeting?.topic}</p>

                                <div className="py-5 flex items-center justify-between">
                                    <button
                                        onClick={() => joinMeeting(meeting)}
                                        className="flex items-center justify-center bg-violet-500 text-white px-4 py-2 rounded-lg shadow hover:bg-violet-700 focus:outline-none transition duration-200 ease-in-out"
                                    >
                                        <FaVideo className="mr-2" /> Join Meeting
                                    </button>
                                    <button
                                        onClick={cancelMeetingConfirmation}
                                        className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 focus:outline-none transition duration-200 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                    <ConfirmationModal
                                    isOpen={showModal}
                                    onClose={() => setShowModal(false)}
                                    onConfirm={() => cancelMeeting(meeting?._id)}
                                    message={`Do you want to Cancel this meeting`}
                                    />
                                    

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-500">No meetings scheduled</span>
                )}
            </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-around p-4 bg-slate-300 border-slate-700 rounded-lg shadow fixed bottom-0 left-0 right-0">
            <button
                onClick={onChat}
                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:outline-none transition duration-200 ease-in-out"
            >
                <FaComment className="mr-2" /> Chat
            </button>
            <button
                onClick={handleShowMeetingForm}
                className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none transition duration-200 ease-in-out"
            >
                <FaCalendarAlt className="mr-2" /> Schedule a Meeting
            </button>
            <button
                onClick={() => navigate(`/match/${mate.matchRefId}`)}
                className="flex items-center justify-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600 focus:outline-none transition duration-200 ease-in-out"
            >
                <FaUser className="mr-2" /> Show Profile
            </button>
        </div>


        <MeetingModalForm
        show = {showMeetingForm}
        handleClose={closeMeetingForm}
        handleSave={onSetMeeting}
        />
        {/* <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => cancelMeeting()}
        message={`Do you want to Cancel this meeting`}
        /> */}
    </div>
    );
};

export default MateDetails;
