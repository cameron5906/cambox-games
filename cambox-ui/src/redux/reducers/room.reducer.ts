import { AnyAction } from "redux";
import { RoomState } from "../../types/interfaces/state/RoomState";
import { CREATE_ROOM, JOIN_ROOM, SET_PLAYER_ROSTER, SET_ROOM_CODE, SET_ROOM_READY, LEAVE_ROOM } from "../actions/room.actions";

const defaultState: RoomState = {
    roomCode: null,
    isHost: false,
    isReady: false,
    players: []
}

export default ( state: RoomState = defaultState, action: AnyAction ): RoomState => {
    switch( action.type ) {
        case SET_ROOM_CODE:
            const setRoomCode = action.payload;
            return {
                ...state,
                roomCode: setRoomCode.roomCode,
                isReady: false
            }
        case LEAVE_ROOM:
            return { ...defaultState };
        case SET_PLAYER_ROSTER:
            const roster = action.payload;
            return {
                ...state,
                players: roster.players
            }
        case CREATE_ROOM:
            return {
                ...state,
                isHost: true
            }
        case JOIN_ROOM:
            return {
                ...state,
                isHost: false
            }
        case SET_ROOM_READY:
            return {
                ...state,
                isReady: action.payload.isReady
            }
    }

    return { ...state };
}