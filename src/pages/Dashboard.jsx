import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllMatesSuccess, failureForMate } from '../redux/slices/matesSlice';
import { start, failure, findMatchesSuccess } from '../redux/slices/matchesSlice';
import { HiChatAlt2, HiUserRemove } from 'react-icons/hi';
import { Link as ScrollLink, Element } from 'react-scroll';
import { setMeetings } from '../redux/slices/userSlice';
import { useSocket } from '../utils/socketContext.jsx';
import { setNotificationStart, setNotificationsToState, notificationsFailure } from '../redux/slices/notificationsSlice.js';
import { fetchWithAuth } from '../utils/refreshToken.jsx';
import { FaSearch } from 'react-icons/fa';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { matches } = useSelector(state => state.matches);
    const [filteredMates, setFilteredMates] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [activeSection, setActiveSection] = useState('meetings');
    const { loading, error, currentUser, meetings } = useSelector(state => state.user);
    const { mates } = useSelector(state => state.mates);
    const socket = useSocket();
    const [search, setSearch] = useState('')

    useEffect(() => {
        getNotifications();
    }, [currentUser]);

    useEffect(() => {
        findMatches();
        fetchMeetings();
    }, [dispatch]);

    useEffect(() => {
        filterData();
    }, [matches]);

    const filterData = () => {
        const filteredMatches = matches.filter(match =>
            match.matchStatus === 'accepted' &&
            match.yourStatus === 'pending'
        );
        setFilteredMatches(filteredMatches);
    };

    const searchUser = () =>{
        navigate('/search', {state: {username: search}})
    }

    const getNotifications = async () => {
        dispatch(setNotificationStart());
        try {
            const res = await fetchWithAuth(
                `${import.meta.env.VITE_API_URI}/api/v1/notifications/get-notifications`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                }, dispatch
            );

            const result = await res.json();

            if (result.statusCode !== 200) {
                dispatch(notificationsFailure(result.message));
            }

            dispatch(setNotificationsToState(result.data));
        } catch (error) {
            dispatch(notificationsFailure(error.message));
        }
    };

    const findMatches = async () => {
        try {
            dispatch(start());
            const response = await fetchWithAuth(
                `${import.meta.env.VITE_API_URI}/api/v1/matches/find-matches`,
                {
                    credentials: "include",
                }, dispatch
            );

            if (!response.ok) throw new Error("Failed to find matches");
            const result = await response.json();
            dispatch(findMatchesSuccess(result.data));
        } catch (error) {
            console.error("Error finding matches:", error);
            dispatch(failure(error.message));
        }
    };

    const formattedTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();

        const ifTomorrow =
            date.getDate() === now.getDate() + 1 &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        const hours = date.getHours().toString().padStart(2, '0');

        let timeString = "";
        if (ifTomorrow) {
            timeString = `Tomorrow at ${hours > 12 ? hours - 12 : hours}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")} ${date.getHours() < 12 ? " am" : ' pm'}`;
        } else {
            timeString = `at ${date.getHours().toString().padStart(2, "0")}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
        }

        return timeString;
    };

    const handleRequest = async (match, body) => {
        try {
          const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/matches/update-match-status/${match._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
          },dispatch);
    
          if (!res.ok) throw new Error('Failed to Request');
    
          console.log('matchuserId', match.user._id)
    
          const result = await res.json();
          dispatch(requestSuccess(result.data));
          socket.emit('notification', {type: 'request', from : currentUser._id, to : match.user._id, note: `${currentUser.username} has ${body.action} `})
          
        } catch (error) {
          dispatch(failure(error.message));
        }
      };

    const fetchMeetings = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URI}/api/v1/mates/get-all-meetings/${currentUser._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const result = await res.json();

            if (result.statusCode !== 200) {
                return;
            }

            dispatch(setMeetings(result.data));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    const handleJoinMeeting = (meeting) => {
        let mateUserId = meeting?.scheduledBy._id === currentUser?._id ? meeting.scheduledWith?._id : meeting.scheduledBy._id;
        const mateId = mates.filter(mate => mate.user?._id === mateUserId)[0]._id;

        navigate(`/mates/${mateId}`, { state: { mateId } });
    };

    return (
        <div className="pt-20">
           

            <Element name="meetings" className="px-2 mt-2">
                <div className="p-4 bg-white shadow-lg rounded-md min-h-screen overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Meetings</h2>
                    {meetings?.length === 0 ? (
                        <p>No Meetings Scheduled.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {meetings?.map(meeting => (
                                <div key={meeting?._id} className="p-4 bg-gray-50 rounded-md shadow-sm">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            className="w-12 h-12 rounded-full"
                                            src={meeting?.scheduledBy?._id === currentUser?._id ? meeting?.scheduledWith?.profilePicture : meeting?.scheduledBy?.profilePicture}
                                            alt={meeting?.scheduledBy?._id === currentUser?._id ? meeting?.scheduledWith?.username : meeting?.scheduledBy?.username}
                                        />
                                        <div>
                                            <p>Meeting with <span className="font-bold">{meeting?.scheduledBy?._id === currentUser?._id ? meeting?.scheduledWith?.username : meeting?.scheduledBy?.username}</span></p>
                                            <p>{formattedTime(meeting?.time)}</p>
                                        </div>
                                        <button
                                            className="ml-auto px-2 py-1 bg-blue-500 text-white rounded-md"
                                            onClick={() => handleJoinMeeting(meeting)}
                                        >
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Element>

            <Element name="requests" className="px-2 mt-2">
                <div className="p-4 bg-white shadow-lg rounded-md min-h-screen overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">Requests</h2>
                    {filteredMatches?.length === 0 ? (
                        <p>No pending requests found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredMatches?.map(match => (
                                <div key={match._id} onClick={() => navigate('/match')} className="p-4 bg-gray-50 rounded-md shadow-sm">
                                    <div className="flex items-center justify-between space-x-4">
                                        <img
                                            className="w-12 h-12 rounded-full"
                                            src={match?.user?.profilePicture}
                                            alt={match?.user?.username}
                                        />
                                        <p className='text-xl font-bold'>Request from {match?.user?.username}</p>
                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Element>

            <div className="fixed bottom-0 left-0 right-0 bg-gray-100 shadow-lg">
                <div className="flex justify-around py-4">
                    <ScrollLink
                        to="meetings"
                        smooth={true}
                        duration={300}
                        spy={true}
                        offset={-80}
                        className={`cursor-pointer ${activeSection === 'meetings' ? 'font-bold text-lg' : 'text-gray-700'}`}
                        onClick={() => handleSectionClick('meetings')}
                    >
                        Meetings
                    </ScrollLink>
                    <ScrollLink
                        to="requests"
                        smooth={true}
                        duration={300}
                        spy={true}
                        offset={-80}
                        className={`cursor-pointer ${activeSection === 'requests' ? 'font-bold text-lg' : 'text-gray-700'}`}
                        onClick={() => handleSectionClick('requests')}
                    >
                        Requests
                    </ScrollLink>
                    <div className="px-4 flex">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300  rounded-l-md"
                            placeholder="Search a User..."
                            value={search}
                            onChange={(e) => {setSearch(e.target.value)}}
                        />
                        <button
                            onClick={searchUser}
                            className="bg-slate-700 text-white p-2 rounded-r-lg hover:bg-slate-900 focus:outline-none"
                        >
                            <FaSearch/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
