import React, { useState } from 'react';
import userSlice, { signInStart, signInFailure, signInSuccess } from '../redux/slices/userSlice';
import {useSelector, useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom';


const Signup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const {loading, error, currentUser} = useSelector(state => state.user)

    // console.log(currentUser)
    // console.log(error, loading)

    // const {err, setErr} = useState("")
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        profilePicture: '',
        location: ''
    });

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    const handleChange = (e) => {
        if (e.target.name === 'profilePicture') {
          setFormData({ ...formData, profilePicture: e.target.files[0] });
        } else {
          const { name, value } = e.target;
          setFormData({ ...formData, [name]: value });
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          dispatch(signInStart())
          const formDataToSend = new FormData();
          formDataToSend.append('username', formData.username);
          formDataToSend.append('email', formData.email);
          formDataToSend.append('password', formData.password);
          formDataToSend.append('location', formData.location);
          formDataToSend.append('profilePicture', formData.profilePicture);
      
          const res = await fetch(`${import.meta.env.VITE_API_URI}/api/v1/user/signup`, {
            method: 'POST',
            body: formDataToSend,
            credentials: 'include'
          });
          const result = await res.json();
          console.log(result);
          if(result.statusCode !== 201){
            dispatch(signInFailure(result.message))
            return;
          }
          dispatch(signInSuccess(result.data))

          setTimeout(() => {
            // Redirect to the dashboard page using history.push
            navigate('/dashboard');
          }, 1000)
          
        } catch (error) {
          dispatch(signInFailure(error.message))
          // console.log(error);
        }
      };
      
    return (
        <div className="container p-20 mx-auto mb-10 justify-center">
            <h2 className="text-3xl text-center font-semibold mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-gray-700 font-bold mb-2">Profile Picture</label>
                    <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleChange} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Enter your location (optional)" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
                {loading? (<p>Loading...</p>): (error?(<p className='text-red-700'>{error}</p>): null)}
                <div className='flex justify-between text-blue-600 my-2'>
                  <p className='text-black'>already have an account? </p>
                  <a href="/sign-in">sign in</a>
                </div>
            </form>
        </div>
    );
};

export default Signup;
  