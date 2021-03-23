export const SET_PROFILE_DETAILS = 'SET_PROFILE_DETAILS';
export const setProfileDetails = ( name: string, imageUrl: string ) => ({
    type: SET_PROFILE_DETAILS,
    payload: { name, imageUrl }
});

export const LOAD_DEV_KEY = 'LOAD_DEV_KEY';
export const loadDeveloperKey = () => ({
    type: LOAD_DEV_KEY
})

export const LOAD_DEVELOPED_GAMES = 'LOAD_DEVELOPED_GAMES';
export const loadDevelopedGames = () => ({
    type: LOAD_DEVELOPED_GAMES
})