import { SocialNetwork } from "@cambox/common/dist/types";

export const AUTHENTICATE = 'AUTHENTICATE';
export const authenticate = ( platform: SocialNetwork, accessToken: string ) => ({
    type: AUTHENTICATE,
    payload: { platform, accessToken }
});

export const CHECK_LOGGED_IN = 'CHECK_LOGGED_IN';
export const checkIfLoggedIn = () => ({
    type: CHECK_LOGGED_IN
})

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const setAuthToken = ( token: string ) => ({
    type: SET_AUTH_TOKEN,
    payload: { token }
})