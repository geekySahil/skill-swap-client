import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/refreshToken";
import { useDispatch } from "react-redux";

const UserSearch = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation()
  const username = location.state.username
  const dispatch = useDispatch()
  const navigate = useNavigate()
  console.log(username)

  useEffect(()=> {
    handleSearch()
  },[])

  console.log(results[0])

  const handleSearch = async () => {
    try {
      const response = await fetchWithAuth(`http://localhost:4000/api/v1/user/search/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'

      }, dispatch);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setResults(data);
      setError(""); // Clear any previous errors
    } catch (err) {
      setResults([]);
      setError(err.message);
    }
  };

  const handleClick = async (user) => {
    navigate(`match/${user._id}`)
  }

  return (
    <div className="p-4 pt-20">
        <h2 className="font-bold ">   results for {username}</h2>

      {results.length > 0 ? (
        <ul className="border-black p-4">
          {results.map((user) => (
            <li onClick={() => handleClick(user)} key={user._id} className="border-b-2 p-2 py-6 m-5 flex ">
              <img src={user.profilePicture} alt={user.username} className="h-12 w-12 items-center rounded-full"/>
              <div className="flex flex-col ml-3 ">
              <strong className="font-serif">{user.username}</strong> 
              <p>{user.email}</p> 
              </div>
              
              {/* Add other user details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        !error && <p>No users found.</p>
      )}
    </div>
  );
};

export default UserSearch;
