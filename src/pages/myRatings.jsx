import React, { useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithAuth } from '../utils/refreshToken';
import { getFeedbackSuccess } from '../redux/slices/feedbackSlice';

const RatingsPage = () => {
  const { feedbacks } = useSelector((state) => state.feedbacks);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getFeedbacks();
  }, []);

  const getFeedbacks = async () => {
    try {
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_URI}/api/v1/feedback/get-feedbacks/${currentUser._id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
        dispatch
      );

      const result = await res.json();

      if (result.statusCode !== 200) {
        throw new Error('Failed to Request');
      }

      dispatch(getFeedbackSuccess(result.data));
    } catch (error) {
      console.log('error', error);
    }
  };

  console.log(feedbacks)

  // Calculate gross rating
  const grossRating =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) /
        feedbacks.length
      : 0;

  return (
    <div className="p-6 pt-20">
      {/* Profile Section */}
      <div className="flex items-center mb-8">
        <img
          src={currentUser.profilePicture}
          alt="Profile"
          className="w-20 h-20 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-semibold">{currentUser.username}</h1>
          <p className="text-gray-600">{currentUser.email}</p>
          <div className="flex items-center mt-2">
            <span className="text-lg font-medium">Gross Rating:</span>
            <div className="flex ml-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(grossRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="p-4 border rounded-lg bg-gray-50 flex items-start"
            >
              <img
                src={feedback.from_user_id?.profilePicture}
                alt="Reviewer"
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <p className=" font-bold">{feedback.from_user_id?.username}</p>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{feedback.feedback}</p>
                <p className="text-sm text-gray-500">
                  {new Date(feedback.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
