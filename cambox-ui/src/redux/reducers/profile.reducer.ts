import { AnyAction } from "redux";
import { ProfileState } from "../../types/interfaces/state/ProfileState";
import { SET_AUTH_TOKEN } from "../actions/auth.actions";
import { LOAD_DEVELOPED_GAMES, LOAD_DEV_KEY, SET_PROFILE_DETAILS } from "../actions/profile.actions";

const defaultState: ProfileState = {
    authToken: null,
    name: '',
    imageUrl: '',
    developerKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    games: []
}

export default ( state: ProfileState = defaultState, action: AnyAction ): ProfileState => {
    switch( action.type ) {
        case SET_PROFILE_DETAILS:
            const profileDetails = action.payload;
            return {
                ...state,
                name: profileDetails.name,
                imageUrl: profileDetails.imageUrl
            }
        case SET_AUTH_TOKEN:
            const authToken = action.payload;
            return {
                ...state,
                authToken: authToken.token
            }
        case LOAD_DEV_KEY:
            return {
                ...state,
                developerKey: action.payload.key
            }
        case LOAD_DEVELOPED_GAMES:
            return {
                ...state,
                games: action.payload.games
            }
    }

    return { ...state };
}