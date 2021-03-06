import { createStore, combineReducers, applyMiddleware } from 'redux';
import authMiddleware from './middleware/auth.middleware';
import gameMiddleware from './middleware/game.middleware';
import profileMiddleware from './middleware/profile.middleware';
import roomMiddleware from './middleware/room.middleware';
import appReducer from './reducers/app.reducer';
import gameReducer from './reducers/game.reducer';
import gamesReducer from './reducers/games.reducer';
import profileReducer from './reducers/profile.reducer';
import roomReducer from './reducers/room.reducer';
import uiReducer from './reducers/ui.reducer';

export default createStore(
    combineReducers({
        app: appReducer,
        ui: uiReducer,
        profile: profileReducer,
        room: roomReducer,
        game: gameReducer,
        games: gamesReducer
    }),
    applyMiddleware(
        authMiddleware as any,
        gameMiddleware as any,
        roomMiddleware as any,
        profileMiddleware as any
    )
);