import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import MySkillsAndInterests from './pages/MySkillsAndInterests';
import Dashboard from './pages/Dashboard'
import AddInterest from './pages/AddInterest';
import SkillDescription from './pages/SkillDescription';
import Mates from './pages/Mates';
import MatchDetail from './pages/MatchDetail';
import Chat from './pages/Chat';
import MateDetails from './pages/MateDetail';
import VideoCall from './pages/VideoCall';
import AddSkill from './pages/AddSkill.jsx';
import {io} from 'socket.io-client'
import theme from './theme';
import CssBaseline from '@mui/material/CssBaseline';
import { SocketProvider, useSocket } from './utils/socketContext.jsx';
import { MediaStreamProvider } from './utils/meadiaStreamContext.jsx';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './components/Modal.jsx';
import { handleTokenExpiration } from './utils/refreshToken.jsx';
import RatingsPage from './pages/myRatings.jsx';
import UserSearch from './pages/SearchUser.jsx';


export default function App() {

  const {reauthenticationRequired} = useSelector(state => state.user)
  const dispatch = useDispatch()

 
  return (

    <SocketProvider>
      <MediaStreamProvider>
    <Router>
        <Header/>
      <Routes>
     
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element= {<PrivateRoute/>} >
          <Route path='/profile' element={<Profile />} />
          <Route path= '/match' element={<Matches/>}/>
          <Route path= '/dashboard' element={<Dashboard/>}/>
          <Route path= '/skills-interests' element={<MySkillsAndInterests/>}/>
          <Route path= '/add-skills' element={<AddSkill/>}/>
          <Route path= '/add-interests' element={<AddInterest/>}/>
          <Route path='/skill-description' element={<SkillDescription/>}/>
          <Route path='/feedbacks' element={<RatingsPage/>} />
          <Route path='/mates' element={<Mates/>}/>
          <Route path="/match/:id" element={<MatchDetail/>} />
          <Route path='/search' element={<UserSearch/>}/>
          <Route path="/mates/chat/:mateId" element={<Chat/>} />
          <Route path="/mates/:mateId" element={<MateDetails/>} />
          <Route path="/videoCall/:meetingId" element= {<VideoCall/>}/>
        </Route>
      </Routes>

    </Router>
      <Modal
      isOpen={reauthenticationRequired}
      onClose={() => handleTokenExpiration(dispatch)}
      message={`Session expired please log in again`}
      />
      </MediaStreamProvider>
    </SocketProvider>

  );
}