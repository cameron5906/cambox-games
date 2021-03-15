import { Player } from "../../types/interfaces/room/Player";

export const CREATE_ROOM = 'CREATE_ROOM';
export const createRoom = () => ({
    type: CREATE_ROOM
})

export const JOIN_ROOM = 'JOIN_ROOM';
export const joinRoom = ( roomCode: string ) => ({
    type: JOIN_ROOM,
    payload: { roomCode }
});

export const SET_ROOM_CODE = 'SET_ROOM_CODE';
export const setRoomCode = ( roomCode: string ) => ({
    type: SET_ROOM_CODE,
    payload: { roomCode }
})

export const SET_PLAYER_ROSTER = 'SET_PLAYER_ROSTER';
export const setPlayerRoster = ( players: Player[] ) => ({
    type: SET_PLAYER_ROSTER,
    payload: { players }
})

export const SET_ROOM_READY = 'SET_ROOM_READY';
export const setRoomReady = ( isReady: boolean ) => ({
    type: SET_ROOM_READY,
    payload: { isReady }
})

export const LEAVE_ROOM = 'LEAVE_ROOM';
export const leaveRoom = () => ({
    type: LEAVE_ROOM
})