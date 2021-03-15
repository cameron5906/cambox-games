import { AnyAction } from "redux";
import { ProfileState } from "../../types/interfaces/state/ProfileState";
import { SET_AUTH_TOKEN } from "../actions/auth.actions";
import { SET_PROFILE_DETAILS } from "../actions/profile.actions";

const defaultState: ProfileState = {
    authToken: null,
    firstName: '',
    imageUrl: '',
    lastAuthenticatedEmail: localStorage.getItem( 'email' ) || ''
}

export default ( state: ProfileState = defaultState, action: AnyAction ): ProfileState => {
    switch( action.type ) {
        case SET_PROFILE_DETAILS:
            const profileDetails = action.payload;
            return {
                ...state,
                firstName: profileDetails.firstName,
                imageUrl: profileDetails.imageUrl
            }
        case SET_AUTH_TOKEN:
            const authToken = action.payload;
            return {
                ...state,
                authToken: authToken.token
            }
    }

    return { ...state };
}