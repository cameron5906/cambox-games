export const SET_PROFILE_DETAILS = 'SET_PROFILE_DETAILS';
export const setProfileDetails = ( firstName: string, imageUrl: string ) => ({
    type: SET_PROFILE_DETAILS,
    payload: { firstName, imageUrl }
});