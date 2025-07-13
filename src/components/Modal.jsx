// Modal.js
import React from 'react';

const Modal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                <div className="py-4  text-xl text-bold ">
                    <p>{message}</p>
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={onClose} className="bg-orange-500 text-white px-4 py-2 rounded-lg">OK</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
