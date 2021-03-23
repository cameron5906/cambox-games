import { AnyAction, Store } from 'redux';
import apiService from '../../services/api.service';
import websocketService from '../../services/websocket.service';
import { setAuthToken } from '../actions/auth.actions';
import { CREATE_ROOM, JOIN_ROOM, setRoomCode, SET_ROOM_READY, LEAVE_ROOM } from '../actions/room.actions';
import { RootState } from '../../types/interfaces/state/RootState';
import { ApiResponse, CreateRoomResponseData, JoinResponseData } from '@cambox/common';

export default ({ dispatch, getState }: Store ) => ( next: any ) => ( action: AnyAction ) => {
    if( action.type === CREATE_ROOM ) {
        apiService.createRoom().then( ( { ok, error, data }: ApiResponse<CreateRoomResponseData> ) => {
            if( ok && data) {
                localStorage.setItem( 'token', data.token );
                dispatch( setAuthToken( data.token ) );
                dispatch( setRoomCode( data.roomCode ) );
                websocketService.connect( data.roomCode );
            }
        } );
    }

    if( action.type === JOIN_ROOM ) {
        const { roomCode } = action.payload;
        apiService.joinRoom( roomCode ).then( ( { ok, error, data }: ApiResponse<JoinResponseData> ) => {
            if( ok && data ) {
                localStorage.setItem( 'token', data.token );
                dispatch( setAuthToken( data.token ) );
                dispatch( setRoomCode( roomCode ) );
                websocketService.connect( roomCode );
            }
        } );
    }

    if( action.type === SET_ROOM_READY ) {
        const { room: { isHost, isReady } } = getState() as RootState;
        
        if( isHost && !isReady ) {
            apiService.setRoomReady().then( ( { ok, error }: ApiResponse<any> ) => {
                //TODO: Error handling
            } )
        }
    }

    if( action.type === LEAVE_ROOM ) {
        websocketService.disconnect();
    }

    return next( action );
}