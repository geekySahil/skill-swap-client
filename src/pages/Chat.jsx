import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
// import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { deleteMessagesSuccess, failureForMate,  getAllMatesSuccess, getMessagesSuccess,setMessageSuccess } from '../redux/slices/matesSlice';
import { FaTrash } from 'react-icons/fa';
import Modal from '../components/Modal';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useSocket } from '../utils/socketContext.jsx';
import { fetchWithAuth } from '../utils/refreshToken.jsx';

const socket = io('http://localhost:4000'); 




const Chat = () => {
    const [activeUsers, setActiveUsers] = useState([])
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState('')
    const [messageToDelete, setMessageToDelete] = useState(null)
    const location = useLocation()
    const {loading, error, mates} = useSelector(state => state.mates);
    const dispatch = useDispatch()
    const mateId = location.state.mateId
    // console.log("mateId", mateId)
    const {currentUser} = useSelector(state => state.user)
    const mate = mates.filter(mate => mate._id === mateId)[0]
    const messages = mate.messages
    const messagesEndRef = useRef(null);
    const navigate = useNavigate()
    const socket = useSocket()

   
    console.log('activeusers', activeUsers)


    useEffect(() => {
        (async () => await getAllMessages())();
        console.log('socket', socket)
    
        socket.emit('joinRoom', { mateId, userId: currentUser._id });
    
        socket.on('activeUsers', (users) => {
          setActiveUsers(users);
          console.log('set', users);
        });
    
        socket.on('receiveMessage', (messageData) => {
          dispatch(setMessageSuccess({ message: messageData, mateId }));
          console.log('messageData', messageData);
        });
    
        return async () => {
          socket.emit('leaveRoom', { mateId, userId: currentUser._id });
        //   socket.disconnect();
          socket.off('receiveMessage');
          socket.off('activeUsers');
        };
      }, [mateId, currentUser._id, dispatch, socket]);


    useEffect(() => {
        scrollToBottom()

    })

    // console.log(mate.messages)
    // console.log("activeUsers", activeUsers)



    const sendMessage = async() => {
        if (message.trim()) {
            const messageData = {
                sender: currentUser._id,
                text: message,
                date: new Date().toISOString()
            };
            socket.emit('sendMessage', {messageData: messageData, mateId: mateId});
            saveMessageToDatabase(messageData)
            console.log(activeUsers.includes(mate.user._id), mate.user._id)
            if(!activeUsers.includes(mate.user._id)){
                socket.emit('notification', {type: 'new_message', to: mate.user._id, from : currentUser._id, note: `message from ${currentUser.username
                }  '${messageData.text}'` })
            }
          
            setMessage('');
        }
    };

    const getAllMessages = async() => {
        try {
            const res = await fetchWithAuth(`http://localhost:4000/api/v1/mates/messages/${mateId}`, {
                method: 'GET',
                credentials: 'include'
            }, dispatch)

            const result = await res.json();

            if(result.statusCode !== 200){
                dispatch(failureForMate(result.message));
                return
            }

            console.log(result.data)

            dispatch(getMessagesSuccess({messages: result.data, mateId: mateId})); 

        } catch (error) {
            dispatch(failureForMate(error.message))
        }
    }

    const saveMessageToDatabase = async(message) => {
        try {
            const res = await fetchWithAuth(`http://localhost:4000/api/v1/mates/save-messages/${mateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({newMessage: message}),
                credentials: 'include'
            }, dispatch)
    

            const result = await res.json()

            // dispatch(setMessageSuccess({message, mateId}))



            if(!res.ok) throw new Error(result.message || 'Failed to save messages');
            
            // console.log(result)

            

            // console.log("saved")


        } catch (error) {
            console.log(error.message)
            dispatch(failureForMate(error.message))
        }


        
    }

    const handleDeleteMessage = async(message) => {
        const currentTime = new Date();
        // Get the time 1 minute before the current time
        const oneMinuteAgo = new Date(currentTime);
        oneMinuteAgo.setMinutes(currentTime.getMinutes() - 1);

        // Convert both dates to milliseconds for comparison
        const messageDate = new Date(message.date).getTime();
        const oneMinuteAgoTime = oneMinuteAgo.getTime();
        if (oneMinuteAgoTime >= messageDate){
            setDeleteError("Its to late to delete this message")
        } else{
            try {
                const res = await fetchWithAuth(`http://localhost:4000/api/v1/mates/delete-message/${mateId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({messageId: message._id}),
                    credentials: 'include'
                }, dispatch)

                if(!res.ok) throw new Error('failed to delete message')  
                    
                const result = await res.json()
                console.log(result)

                dispatch(deleteMessagesSuccess({mateId: mateId,messageId : message._id}))
                setDeleteError("message deleted successfully")
            } catch (error) {
                setDeleteError(error.message)
            }
        }
    setMessageToDelete(null)
    setIsModalOpen(false)
    }

    const saveNotifications = async(message) => {
      try {
          const res = await fetchWithAuth(`http://localhost:4000/api/v1/notifications/set-notification`, {
              method: 'PUT',
              headers:{
                 'Content-Type':'application/json'
              } ,
              body: JSON.stringify({type: 'new_message', note: message, to: mate.user._id}),
              credentials: 'include'
          }, dispatch)
  
          const result = await res.json() 
          console.log(result);
      } catch (error) {
        console.log(error.message)
      }



    }

    

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const groupedMessages = messages.reduce((groups, message) => {
        const date = message.date.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    // console.log(mate)

    const closeModal = () => {
        setIsModalOpen(false)
        setMessageToDelete(null)
    }

    const handleLongPress = (message) => {
        if(message.sender === currentUser._id){
            setMessageToDelete(message._id)
            setIsModalOpen(true)
        }else {
            setDeleteError('you can only delete your messages')
        }
       
    };

    const handleExit = () => {
        navigate(-1)
    }




    return (
    <div className="flex flex-col h-screen max-w-full mx-auto border rounded-lg shadow-lg bg-gray-100">
            <div className="flex items-center justify-left p-2 bg-cyan-600 text-white">
                <button onClick={handleExit} className="flex text-2xl text-white items-center">
                    <FaArrowLeft/>
                </button>
                <div className="ml-3 flex items-center border-white-8">
                <img
                src={mate.user.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2  mr-2"
                />
                <div className="flex flex-col">
                    <span className="font-semibold ml-3 text-2xl">{mate.user.username}</span>
                    {/* You can add additional information like online status here */}
                </div>
                
            </div>
      
            </div>
            
            <div className="flex-1 overflow-y-scroll p-4 bg-gray-200" style={{ backgroundImage: 'url("https://www.toptal.com/designers/subtlepatterns/patterns/dot-grid.png")' }}>
                {Object.keys(groupedMessages).map((date, index) => (
                    <div key={index}>
                        <div className="text-center text-gray-500 mb-4">{formatDate(date)}</div>
                        {groupedMessages[date].map((msg, index) => (
                            <div key={index} className={`flex items-end mb-4 ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                            
                                <div
                                    className={`relative px-3 py-1 max-w-xs rounded-lg shadow-lg ${msg.sender === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        handleLongPress(msg); // Pass messageId to delete
                                    }}
                                >
                                    <p className="text-base">{msg.text}</p>
                                    
                                    <span className="text-xs text-white">{formatTime(msg.date)}</span>
                                    
                                </div>
                                {isModalOpen && (messageToDelete === msg?._id) ? (
                                    <button onClick={() => handleDeleteMessage(msg)} className="text-red-400 hover:red-600">
                                        <FaTrash/>
                                    </button>
                                ): null}
                                
                                {/* {msg.sender === currentUser._id && (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 ml-2 flex-shrink-0"></div>
                                )} */}
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex p-4 bg-gray-300">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 bg-white border rounded-l-lg focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="bg-slate-700 text-white p-2 rounded-r-lg hover:bg-slate-900 focus:outline-none"
                >
                    Send
                </button>
            </div>
            <Modal
                isOpen={deleteError}
                message={deleteError}
                onClose={() => setDeleteError(null)}
            />
    </div>
    );
}

export default Chat;
