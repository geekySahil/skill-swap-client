import { useDispatch } from "react-redux";
import { reinitializeUserState, setMeetings, setReauthenticationRequired, signOut } from "../redux/slices/userSlice";
import { getInterests, getSkills } from "../redux/slices/skillsSlice";
import { findMatchesSuccess } from "../redux/slices/matchesSlice";
import { getFeedbackSuccess } from "../redux/slices/feedbackSlice";
import { getAllMatesSuccess } from "../redux/slices/matesSlice";

import { reinitializeNotifications } from "../redux/slices/notificationsSlice";
import { reinitializeMeetingState } from "../redux/slices/videoCallSlice";
import { useNavigate } from "react-router-dom";


export const fetchWithAuth = async (url, options = {}, dispatch) => {
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',  // Automatically includes HttpOnly cookies with the request
        });

        if (response.status === 401) { // Unauthorized, possibly due to expired token
            console.log('Access token expired, attempting to refresh...');
            const refreshResponse = await refreshToken();
            console.log('refreshResponse', refreshResponse)
            if (!refreshResponse.ok) {

                toggleReauthenticationRequired(dispatch)
                // handleTokenExpiration(dispatch) // Handle case where both access and refresh tokens are expired
                throw new Error('Session expired, please log in again.');
            }
            // Retry original request after successful token refresh
            return await fetch(url, {
                ...options,
                credentials: 'include',
            });
        }

        return response;
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
};

export const refreshToken = async () => {
    return await fetch(`${import.meta.env.VITE_API_URI}/api/v1/user/refresh`, {
        method: 'POST',
        credentials: 'include',  // Send the HttpOnly refresh token with the request
    });
};

const toggleReauthenticationRequired = (dispatch) =>{
    dispatch(setReauthenticationRequired(true))

}



export const handleTokenExpiration = (dispatch) => {


    // window.location.href = '/sign-in'; // Redirect to login page
    dispatch(setReauthenticationRequired(false))
    dispatch(reinitializeUserState())
    dispatch(getSkills([]));
    dispatch(getInterests([]));
    dispatch(findMatchesSuccess([]));
    dispatch(getFeedbackSuccess([]));
    dispatch(getAllMatesSuccess([]));
    dispatch(reinitializeNotifications());
    dispatch(reinitializeMeetingState())


};


