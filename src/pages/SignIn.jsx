import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../redux/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';


const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        
    });
    const dispatch = useDispatch()
    const {loading, error , currentUser} = useSelector(state => state.user)
    // console.log(error)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
       
       try {
         dispatch(signInStart())
         const res = await fetch('http://localhost:4000/api/v1/user/login', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           credentials: 'include',
           body: JSON.stringify(formData),

         });
         const result = await res.json()
 
     

        if(result.statusCode !== 200){
            dispatch(signInFailure(result.message))
            console.log(result)
            return
        }

        console.log(result.data.loggedInUser)


        dispatch(signInSuccess(result.data.loggedInUser))


        setTimeout(() => {
            // Redirect to the dashboard page using history.push
            navigate('/dashboard');
          }, 1000)


       } catch (error) {
         dispatch(signInFailure(error.message))
        //  console.log(error)
       }
    };

    return (
        <div className="container mx-auto pt-20 justify-center">
            <h2 className="text-3xl text-center font-semibold mb-6">Sign In</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign In</button>
                {loading? (<p>Loading...</p>): (error?(<p className='text-red-700'>{error}</p>): null)}
                <div className='flex justify-between text-blue-600 my-2'>
                  <p className='text-black'>don't have an account? </p>
                  <a href="/sign-up">sign up</a>
                </div>
            </form>
            
            
        </div>
    );
};

export default Signin;