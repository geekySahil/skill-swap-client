import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaUpload } from 'react-icons/fa';
import { getFeedbackSuccess, failure, addFeedbackSuccess, updateFeedbackSuccess, deleteFeedbackSuccess } from '../redux/slices/feedbackSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';
import  {requestSuccess} from "../redux/slices/matchesSlice";
import { useSocket } from '../utils/socketContext';
import { fetchWithAuth } from '../utils/refreshToken';

const MatchDetail = () => {

  useEffect(() => {
    // getReviews()
  },[])


  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);
  const { id } = useParams();
  const {currentUser} = useSelector(state => state.user)
  const {feedbacks=[], loading, error} = useSelector(state => state.feedbacks)
  const {matches} = useSelector(state => state.matches)
  const {mates} = useSelector(state => state.mates)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const socket = useSocket()

  const matchFilter = matches.filter(match => id === match._id )


  const match = matchFilter[0]


  const mateFilter = mates.filter(mate => match._id === mate.matchRefId )

  // console.log('mateFilter', mateFilter)

  const mate = mateFilter[0]

  // console.log('------', mate)


  // console.log(editingReview)


  const handleRequest = async (matchId, body) => {
  
    try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_API_URI}/api/v1/matches//update-match-status/${matchId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        }, dispatch)

        if(!res.ok) throw new Error('Failed to Request')

        const result = await res.json()

        // console.log(result.data)


       dispatch(requestSuccess(result.data))

       socket.emit('notification', {type: 'request', from : currentUser._id, to : mate.user._id, note: `${currentUser.username} has ${body.action} `})

        


    } catch (error) {
        dispatch(failure(error.message))
    }
  }


 


  const handleAddReview = async(body) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URI}/api/v1/feedback/add-feedback/${match.user._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          credentials: "include",
        }, dispatch
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const result = await res.json()
      console.log("result", result)

      if(result.statusCode !== 201){
        dispatch(failure(result.message))
        setNewRating(0)
        setNewReview("")
        return
      }

      dispatch(addFeedbackSuccess(result.data));
      socket.emit('notification', {type: 'review', from : currentUser._id, to : mate.user._id, note: `you've got feedback from ${currentUser.username} `})
      console.log('Notification event emitted')


      setNewRating(0)
      setNewReview("")
      setShowAllReviews(true)

      

    } catch (error) {
      // console.log(error)
      dispatch(failure(error.message))
      setNewRating(0)
      setNewReview("")
    }
  }


  const handleUpdateReview = async(reviewId, body) => {
     setEditingReview(null)
     try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URI}/api/v1/feedback/update-feedback/${reviewId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          credentials: "include",
        }, dispatch
      );

      const result = await res.json()

      console.log(result);
      if(result.statusCode !== 201){
        dispatch(failure(result.message));
        setNewRating(0)
        setNewReview("")
        return
      }

      dispatch(updateFeedbackSuccess(result.data))
      setNewRating(0)
      setNewReview("")

     } catch (error) {
      dispatch(failure(error.message))
      setNewRating(0)
      setNewReview("")
     }
  };

  
  const handleDeleteReview = async(reviewId) => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URI}/api/v1/feedback/delete-feedback/${reviewId}`,
        {
          method: 'DELETE',
          credentials: "include",
        }, dispatch
      );

      const result = await res.json()

      console.log(result);
      if(result.statusCode !== 200){
        dispatch(failure(result.message));
        return
      }

      dispatch(deleteFeedbackSuccess(result.data))
     } catch (error) {
      dispatch(failure(error.message))
     }
  };
  



    let gross=0, count =0
    for(let i = 0 ; i<feedbacks?.length; i++){
      gross += feedbacks[i].rating
      count++

    }

    const grossRating = gross/count


  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {[...Array(fullStars)]?.map((_, index) => <FaStar key={index} className="text-yellow-500" />)}
        {[...Array(halfStars)]?.map((_, index) => <FaStarHalfAlt key={index} className="text-yellow-500" />)}
        {[...Array(emptyStars)]?.map((_, index) => <FaRegStar key={index} className="text-yellow-500" />)}
      </>
    );
  };


  return(
    <div className="p-8 max-w-4xl mx-auto">
    <button
      onClick={() => navigate(-1)}
      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300 mb-6"
    >
      Back
    </button>
    <div className="border bg-white p-8 rounded-lg shadow-lg">
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={match.user?.profilePicture || "https://via.placeholder.com/150"}
          alt={match.user?.username}
          className="w-24 h-24 rounded-full shadow-md"
        />
        <div className="text-lg">
          <p><strong>Username:</strong> {match.user?.username}</p>
          <p><strong>Email:</strong> {match.user?.email}</p>
          <p><strong>Location:</strong> {match.user?.location}</p>
        </div>
      </div>
      <div className="text-lg mb-6">
        <p><strong>Skillset:</strong> {match.user.skills_collection.map(skill => skill.name).join(', ')}</p>
        <p><strong>Interests:</strong> {match.user.skills_wanted.map(skill => skill.name).join(', ')}</p>
      </div>
      <div className="text-lg mb-6">
        <p><strong>Availability:</strong> {match.user.availability || 'Not specified'}</p>
      </div>
      <div className="text-lg mb-6">
        <span className='flex items-center'>
          <strong className='mr-3'>Gross Rating:</strong>
          {feedbacks.length ? renderStars(grossRating) : <p className='text-yellow-500 font-bold mr-3'>no ratings</p>}
          ({grossRating.toFixed(1)} out of 5)
        </span>
      </div>
      <div className="text-lg mb-6">
        <p><strong>Reviews:</strong></p>
        {feedbacks && feedbacks.length > 0 ? (
          <>
            {!showAllReviews && feedbacks.slice(0, 1).map((review, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">{review.rating} out of 5</span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <img className="w-8 h-8 rounded-2xl mr-3" src={review?.from_user_id?.profilePicture} alt={review.from_user_id?.username} />
                    <p className="text-gray-800"><strong>{review?.from_user_id?.username}</strong></p>
                  </div>
                  {review.from_user_id?._id === currentUser._id && (
                    <div className='flex space-x-2'>
                      <FaEdit className='text-blue-500 cursor-pointer' onClick={() => handleUpdateReview(review._id)} />
                      <FaTrash className='text-red-500 cursor-pointer' onClick={() => handleDeleteReview(review._id)} />
                    </div>
                  )}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
            {showAllReviews && feedbacks.map((review, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm bg-gray-50">
                {editingReview === review._id? <div className="flex items-center mb-2">
                  <select
                  className="p-2 border rounded mb-2"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  >
                  <option value="0">Rating</option>
                  {[...Array(5)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} Star{(i + 1) > 1 && 's'}</option>
                  ))}
                </select>
                </div> : <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">{review.rating} out of 5</span>
                </div>}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <img className="w-8 h-8 rounded-2xl mr-3" src={review.from_user_id?.profilePicture} alt={review.from_user_id?.username} />
                    <p className="text-gray-800"><strong>{review.from_user_id?.username}</strong></p>
                  </div>
                  {review.from_user_id?._id === currentUser._id && (
                    <div className='flex space-x-2'>
                      {editingReview === review._id? <FaUpload onClick={() => handleUpdateReview(review._id, {rating: newRating, review: newReview})}/> : <FaEdit className='text-blue-500 cursor-pointer' onClick={() => setEditingReview(review._id)} />}
                      <FaTrash className='text-red-500 cursor-pointer' onClick={() => handleDeleteReview(review._id)} />

                    </div>
                    
                  )}
                  
                  
                </div>
                  {editingReview===review._id? <textarea
                  className="p-2 border rounded my-2"
                  placeholder="Update Review..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  />: <p className="text-gray-600">{review.comment}</p>}
            </div>
            ))}
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300 mt-2"
            >
              {showAllReviews ? 'Show Less' : 'Show More'}
            </button>
          </>
        ) : (
          <p className='text-gray-500 mr-3'>No reviews available</p>
        )}
      </div>
      <div className="flex flex-col mb-6">
        <textarea
          className="p-2 border rounded mb-2"
          placeholder="Write your review..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <select
          className="p-2 border rounded mb-2"
          value={newRating}
          onChange={(e) => setNewRating(e.target.value)}
        >
          <option value="0">Rating</option>
          {[...Array(5)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} Star{(i + 1) > 1 && 's'}</option>
          ))}
        </select>
        <button
            onClick={() => handleAddReview({ rating: newRating, review: newReview })}
            className={`bg-blue-500 text-white px-4 py-2 rounded shadow transition duration-300 ${!newRating || !newReview ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-600'}`}
            disabled={!newRating || !newReview}
        >
            Submit Review
        </button>

      </div>
      <div className="flex justify-end space-x-4">
        {(match.yourStatus === "pending" && match.matchStatus === "pending") ?  (
          <button onClick={() => handleRequest(match._id, {status: "accepted", action: 'requested You to become learning mates'})} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-300">
            Request
          </button>
        ): match.yourStatus === "accepted" && match.matchStatus === "pending" ? <button onClick={() => handleRequest(match._id, {status: "pending", action: 'reverted its request'})} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-300">
            Revert
      </button> : match.yourStatus === "pending" && match.matchStatus === "accepted" ? <>
            <button onClick={() => handleRequest(match._id, {status: "accepted", action: 'accepted your request '})} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition duration-300">
              Accept
            </button>
            <button onClick={() => handleRequest(match._id, {status: "declined", action: 'blocked your request'})} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-300">
              Decline
            </button>
          </> : match.yourStatus === "declined" ? <button onClick={() => handleRequest(match._id, {status: "pending", action: 'unblocked your request '})} className="bg-red-900 text-white p-1 rounded mr-1">
                    Undo Decline
            </button> : null}
       
      </div>
    </div>
  </div>
  

  );
}

export default MatchDetail;
