export const AUTHENTICATE = 'AUTHENTICATE';
export const authenticate = ( email: string ) => ({
    type: AUTHENTICATE,
    payload: { email }
});

export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const setAuthToken = ( token: string ) => ({
    type: SET_AUTH_TOKEN,
    payload: { token }
})