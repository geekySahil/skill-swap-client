import { current } from "@reduxjs/toolkit";
import { useState, useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMeetings, signOut } from "../redux/slices/userSlice";
import { getInterests, getSkills } from "../redux/slices/skillsSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiCircle, FiDroplet } from "react-icons/fi";
import { findMatchesSuccess } from "../redux/slices/matchesSlice";
import { getFeedbackSuccess } from "../redux/slices/feedbackSlice";
import { getAllMatesSuccess } from "../redux/slices/matesSlice";
import { GiSwapBag } from "react-icons/gi";

import {
  setNotificationStart,
  setNotificationToState,
  notificationsFailure,
  removeNotificationFromState
} from "../redux/slices/notificationsSlice";
import {
  setAudioMutedStream,
  setChatMessages,
  setExpandedStream,
  setIsStarted,
  setMyStream,
  setRemoteStream,
  setVideoMutedStream,
} from "../redux/slices/videoCallSlice";
import { SlArrowRight, SlArrowDown } from "react-icons/sl";
import { Badge, IconButton, Menu,MenuItem,Popover,Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
// import { useSocket } from "../utils/socketContext";
import { FaBell } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi2";


const Header = () => {
  // const socket = useSocket()
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser.profilePicture)
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isMatchesOpen, setIsMatchesOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications } = useSelector((state) => state.notifications);
  const { mates } = useSelector((state) => state.mates);
  const navigate = useNavigate();




  // useEffect(() => {

  //   if(currentUser) {
  //     socket.on('recievenotification', (data) => {
  //       console.log('EXECUTED.......', data)
  //       dispatch(setNotificationToState(data))
  //     })
  //     return ()=> {
  //     socket.off('recievenotification')

  //     }
 
  //   }
   
  // }, []);

  // console.log('all notifications ', notifications)


  const toggleMenu = () => {
    // if(currentUser){
      setIsOpen(!isOpen);

    // }
  };

  const toggleMatches = () => {
    setIsMatchesOpen(!isMatchesOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleOpenNotification = async (notification) => {

      dispatch(removeNotificationFromState(notification));
 

    setShowNotifications(false);
    const fromId = notification.from

    console.log("fromId", fromId);

    const mate = mates.map((mate) =>
      mate.user._id === fromId ? mate : null
   
    )[0]

    console.log( 'mate= ', mate);

    if (notification.type === "new_message") {
      navigate(`/mates/chat/${mate._id}`, { state: { mateId: mate._id } });
    }  if(notification.type === 'scheduled_meeting'){
      navigate(`/mates/${mate._id}`, { state: { mateId: mate._id } });
    } if(notification.type === 'request'){
      navigate(`/match`)
    } if(notification.type === 'review'){
      navigate(`/feedbacks`)
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/user/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      dispatch(signOut());
      dispatch(getSkills([]));
      dispatch(getInterests([]));
      dispatch(findMatchesSuccess([]));
      dispatch(getFeedbackSuccess([]));
      dispatch(getAllMatesSuccess([]));
      dispatch(setNotificationsToState([]));
      dispatch(setIsStarted(false));
      dispatch(setChatMessages([]));
      dispatch(setMeetings([]))
      dispatch(setIsStarted(false));
      dispatch(setExpandedStream([]))
      dispatch(setAudioMutedStream([]))
      dispatch(setVideoMutedStream([]))
      dispatch(setIsStarted(false))
      dispatch(setMyStream(null))
      dispatch(setRemoteStream(null))
      navigate('/sign-in')
    } catch (error) {
      console.log(error);
    }
  };

  const truncateNote = (note) => {
    const words = note.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return note;
  };



  const path = window.location.pathname

  if( path.startsWith('/mates/chat') ) return null
  if(path.startsWith('/videoCall')) return null

  return (
    <div className={`fixed w-full bg-gradient-to-r from-cyan-700 via-cyan-500 to-slate-600 text-white p-4 flex items-center justify-between shadow-lg z-50`}>
      <div className="flex items-center">
        <button onClick={toggleMenu} className="mr-4 focus:outline-none">
          {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
        <span className="font-serif">Skills</span>
        <span className="text-3xl"><GiSwapBag /></span>
        <span className="font-serif">Swap</span>
      </div>
         
          {currentUser? <div key = {Date.now()} className="ml-auto pr-2">
        <IconButton color="inherit" onClick={toggleNotifications}>
          <Badge badgeContent={notifications?.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
        className=" mt-9 mr-2"
        anchorEl={showNotifications}
        open={Boolean(showNotifications)}
        onClose={toggleNotifications}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {notifications?.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={Date.now()} 
              onClick={() => {
                handleOpenNotification(notification);
              }}
            >
              <HiArrowRight className="mr-3"/> {notification?.note}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={toggleNotifications}>
            No notifications
          </MenuItem>
        )}
      </Popover>

      </div>: <div className=" space-x-4 ml-auto pr-3">
        <Link to={'/sign-in'}>
          Log In
        </Link>
        <Link to={'/sign-up'}>
          Sign Up
        </Link>
        </div>}
      <div className={` inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed top-0 left-0 w-64 h-full bg-cyan-500 shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <button onClick={toggleMenu} className="focus:outline-none">
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <ul  className="mt-4">
            <li onClick= {toggleMenu}>
              <Link to="/" className="flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200">
                <FiCircle className="w-3 h-3 mr-2 my-auto" />
                Home
              </Link>
            </li>
            <li onClick= {toggleMenu}>
              <Link to="/dashboard" className="flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200">
                <FiCircle className="w-3 h-3 mr-2 my-auto" />
                Dashboard
              </Link>
            </li>
            <li>
              <button className="flex w-full text-left px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none" onClick={toggleMatches}>
                {isMatchesOpen ? <SlArrowDown /> : <SlArrowRight />}
                <p className='px-3'>User</p>
              </button>
              {isMatchesOpen && (
                <ul className="pl-4">
                  <li>
                    <Link onClick= {toggleMenu} to="/skills-interests" className="flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200">
                      <FiCircle className="w-3 h-3 mr-2" />
                      Skills & Interests
                    </Link>
                  </li>
                  <li>
                    <Link onClick= {toggleMenu} to="/match" className="flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200">
                      <FiCircle className="w-3 h-3 mr-2" />
                      Matches
                    </Link>
                  </li>
                  <li>
                    <Link onClick= {toggleMenu} to="/mates" className="flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200">
                      <FiCircle className="w-3 h-3 mr-2" />
                      Learning Mates
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {currentUser? <li onClick= {toggleMenu}>
              <Link to="/profile" className="flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200">
                <FiCircle className="w-3 h-3 mr-2" />
                My Account
              </Link>
            </li>:null}
            {currentUser? <li onClick= {toggleMenu}>
              <button onClick={handleLogout} className='flex items-center px-4 py-2 text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none'>
                <FiCircle className='w-3 h-3 mr-2' />
                Logout
              </button>
            </li>: null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
