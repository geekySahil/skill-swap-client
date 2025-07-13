import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import React from 'react'


export default function PrivateRoute() {
    const {currentUser, reauthenticationRequired} = useSelector(state => state.user)
    // console.log(currentUser)
  if(reauthenticationRequired) null
  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}