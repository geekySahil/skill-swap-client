import React, { useState } from 'react';

const MeetingModalForm = ({ show, handleClose, handleSave }) => {
    const [topic, setTopic] = useState('');
    const [time, setTime] = useState('');

    const handleTopicChange = (e) => {
        setTopic(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleSaveMeeting = () => {
        handleSave({ topic, time });
        handleClose();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl mb-4">Set Meeting</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="topic">Topic</label>
                    <input
                        type="text"
                        id="topic"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        value={topic}
                        onChange={handleTopicChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="time">Time</label>
                    <input
                        type="datetime-local"
                        id="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        value={time}
                        onChange={handleTimeChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={handleSaveMeeting}
                    >
                        Save Meeting
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MeetingModalForm