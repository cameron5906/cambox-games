import { AnyAction } from "redux";
import { GameState } from "../../types/interfaces/state/GameState";
import { SET_GAME_DETAILS } from "../actions/game.actions";
import { SET_ROOM_READY, LEAVE_ROOM } from "../actions/room.actions";

const defaultState: GameState = {
    details: null
}

export default ( state: GameState = defaultState, action: AnyAction ): GameState => {
    switch( action.type ) {
        case SET_GAME_DETAILS:
            return {
                ...state,
                details: action.payload.details
            }
        case SET_ROOM_READY:
            return {
                ...state,
                details: action.payload.isReady ? state.details : null
            }
        case LEAVE_ROOM:
            return {
                ...state,
                details: null
            }
    }

    return { ...state };
}