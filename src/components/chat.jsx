import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../utils/socketContext';
import { useSelector } from 'react-redux';

const ChatCompoent = ({ mateId }) => {
  const socket = useSocket();
  const {currentUser} = useSelector(state => state.user)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (messageData) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
      console.log('messages')
    });

    // Scroll to the bottom of the chat whenever a new message is received
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  console.log(messages)

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const messageData = {
        message: newMessage,
        sender: currentUser._id, // Replace with actual sender name or ID
        date: new Date(),
      };

      socket.emit('sendMessage', { messageData, mateId });
      setMessages(prevMessages => [...prevMessages, messageData]);
      setNewMessage('');
    }
  };

  return (
    <div className="p-4 bg-white h-full flex flex-col">
    <h6 className="text-lg font-medium">Chat</h6>
    <div className="flex-grow overflow-y-auto mb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div
            className={`${
              msg.sender === currentUser._id ? 'bg-cyan-500 text-black' : 'bg-gray-500 text-white'
            } rounded-md p-2 max-w-[80%]`}
          >
            {/* Hidden sender info, you can remove this if not needed */}
            <p className="text-base">{msg.message}</p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
    <div className="flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-grow border border-gray-300 rounded-md p-2 outline-none"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSendMessage}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Send
      </button>
    </div>
  </div>
  
  );
};

export default ChatCompoent;
