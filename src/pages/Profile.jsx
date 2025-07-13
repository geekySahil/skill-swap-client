import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signOut,signInFailure, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/slices/userSlice';
import { fetchWithAuth } from '../utils/refreshToken';

const MyAccount = ({ user }) => {
    const dispatch = useDispatch()
    const {error, loading, currentUser} = useSelector(state => state.user)
    const [formData, setFormData] = useState({
        username: currentUser.username,
        email: currentUser.email,
        password: currentUser.password,
        location: currentUser.location,
        profilePicture: currentUser.profilePicture,
    });

    // console.log(formData.profilePicture)

    useEffect(() => {
        setFormData({
          username: currentUser.username,
          email: currentUser.email,
          password: currentUser.password,
          profilePicture: currentUser.profilePicture,
        });
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleProfileChange = async(e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData({ ...formData, profilePicture: file });

        const data = new FormData();
        data.append('profilePicture', file);

        try {
            dispatch(updateUserStart())
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/user/change-profile`, {
                method: 'POST',
                body: data,
                credentials: 'include'
            },dispatch);
 
               
            const result = await res.json();

            if(result.statusCode !== 201){
                dispatch(updateUserFailure(result.message))
            }
            console.log(result);
            dispatch(updateUserSuccess(result.data))
            
            // Dispatch success action or update local state as needed
        } catch (error) {
            dispatch(updateUserFailure(error.message))
            console.error('Error updating profile picture:', error);
            // Dispatch failure action or update local state as needed
        }
    };

    const handleSubmitForUpdate = async (e) => {
        e.preventDefault();

        // console.log(formData)

        try {
            dispatch(updateUserStart())
            const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/user/update-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),

                credentials: 'include'
            },dispatch);
            const result = await res.json();

            console.log(result)
        
            if (result.statusCode !== 201) {
                dispatch(updateUserFailure(result.message))
            }

            } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    };

    const handleDeleteAccount = async () => {
      try {
          const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/user/delete-user`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you're using a token for authentication
              },
              credentials: 'include'
          },dispatch);

          if (!res.ok) {
              throw new Error('Network response was not ok');
          }

          dispatch(signOut())

          // Redirect to homepage or login page after account deletion
          window.location.href = '/';
      } catch (error) {
          console.error('Error deleting account:', error);
      }
  };


    return (
        <div className="container mx-auto py-20">
            <h2 className="text-3xl font-semibold mb-6">My Account</h2>
            <form onSubmit={handleSubmitForUpdate} className="max-w-md mx-auto">
                <div className="mb-4">
                <div className="relative flex flex-col">
                        <img 
                            src={formData.profilePicture ?(formData.profilePicture) : currentUser.profilePicture} 
                            alt="Profile" 
                            className="rounded-full w-32 h-32 object-cover mx-auto" 
                        />
                        <input 
                            type="file" 
                            id="profilePicture"
                            name="profilePicture" 
                            accept="image/*" 
                            onChange={handleProfileChange} 
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        {loading ? (<p className='m-auto mt-4 text-green-600'>uploading...</p>) : error?(<p className='m-auto mt-4 text-red-600'>{error}</p>):null}
                    </div>
                   
                </div>
                
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-bold mb-2">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="Enter your username" 
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="Enter your email" 
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="Enter your new password" 
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-gray-700 font-bold mb-2">location</label>
                    <input 
                        type="location" 
                        id="location" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="Enter your new location" 
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    />
                </div>
                <div className="flex justify-between items-center">
                  <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Update</button>
                 
                </div>
                
                
            </form>
            <div className='flex justify-end mr-40 '>
                <button 
                    onClick={handleDeleteAccount} 
                    className=" bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Delete 
                </button>
            </div>
           
            
        </div>
    );
};

export default MyAccount;
