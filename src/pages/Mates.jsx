import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMatesSuccess, deleteMatesSuccess, failureForMate, getAllMatesSuccess } from '../redux/slices/matesSlice';
import { useNavigate } from 'react-router-dom';
import { HiOutlineDotsVertical, HiChatAlt2, HiUserRemove } from "react-icons/hi";
import { fetchWithAuth } from '../utils/refreshToken';

const Mates = () => {
    const [selectedMate, setSelectedMate] = useState(null);
    const dispatch = useDispatch();
    const { mates, loading, error } = useSelector(state => state.mates);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        fetchMates();
    }, []);

    const fetchMates = async () => {
        try {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/get-mates`, {
                method: 'GET',
                credentials: 'include'
            },dispatch);
            if (!response.ok) throw new Error('Failed to fetch mates');
            const result = await response.json();
            dispatch(getAllMatesSuccess(result.data));
            console.log(result)
        } catch (error) {
            console.error('Error fetching mates:', error);
            dispatch(failureForMate(error.message));
        }
    };

    const handleChat = async (mateId) => {
        setShowMenu(false);
        navigate(`chat/${mateId}/`, { state: { mateId: mateId } });
    };

    const showBreifly = async (mateId) => {
        navigate(`/mates/${mateId}`, { state: { mateId: mateId } });
    };

    const handleUnmate = async (mateId) => {
        setShowMenu(false);
        try {
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/mates/unmate/${mateId}`, {
                method: 'DELETE',
                credentials: 'include'
            },dispatch);
            const result = await res.json();
            if (result.statusCode !== 200) {
                dispatch(failureForMate(result.message));
                return;
            }
            dispatch(deleteMatesSuccess(mateId));
        } catch (error) {
            dispatch(failureForMate(error.message));
        }
    };

    const toggleMateMenu = (mateId) => {
        setSelectedMate(mateId);
        setShowMenu(!showMenu);
    };

    return (
        <div className="container mx-auto py-24 px-4 lg:px-8">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <p className="text-center text-gray-600 text-lg">Loading...</p>
                ) : (
                    mates.length === 0 ? (
                        <p className="text-center text-gray-600 text-lg">No mates found</p>
                    ) : (
                        mates.map((mate) => (
                            <div key={mate._id} className="relative bg-gray-200 border border-gray-300 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
                                <div className="absolute top-4 right-4">
                                    <HiOutlineDotsVertical
                                        onClick={() => toggleMateMenu(mate._id)}
                                        className="cursor-pointer text-2xl text-gray-600 hover:text-gray-800"
                                    />
                                    {showMenu && selectedMate === mate._id && (
                                        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <li
                                                onClick={() => handleChat(mate._id)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-800"
                                            >
                                                <HiChatAlt2 className="mr-2" /> Chat
                                            </li>
                                            <li
                                                onClick={() => handleUnmate(mate._id)}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-800"
                                            >
                                                <HiUserRemove className="mr-2" /> Unmate
                                            </li>
                                        </ul>
                                    )}
                                </div>
                                <div className="flex items-center space-x-6">
                                    <img
                                        src={mate.user?.profilePicture}
                                        alt={mate.user?.username}
                                        className="w-24 h-24 rounded-lg object-cover border-4  shadow-lg"
                                    />
                                    <div className="flex flex-col">
                                        <div onClick={() => showBreifly(mate._id)} className="cursor-pointer">
                                            <p className="text-2xl font-semibold text-gray-800">{mate.user?.username}</p>
                                            <p className="text-gray-600 text-sm">{mate.user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    );
};

export default Mates;
