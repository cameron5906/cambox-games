import { AnyAction, Store } from "redux";
import apiService from "../../services/api.service";
import { LOAD_GAMES, setGames, START_GAME, SEND_COMMAND, STOP_GAME } from "../actions/game.actions";
import websocketService from "../../services/websocket.service";
import { ApiResponse, GameDetails } from "@cambox/common";

export default ({ dispatch }: Store ) => ( next: any ) => ( action: AnyAction ) => {
    if( action.type === LOAD_GAMES ) {
        apiService.getGames().then( ( { ok, data, error }: ApiResponse<GameDetails[]> ) => {
            if( ok && data ) {
                dispatch( setGames( data ) );
            }
        } );
    }

    if( action.type === START_GAME ) {
        const { gameId } = action.payload;
        apiService.startGame( gameId ).then( ( { ok, error }: ApiResponse<any> ) => {
            //TODO: Error handling
        } );
    }

    if( action.type === STOP_GAME ) {
        apiService.stopGame().then( ( { ok, error }: ApiResponse<any> ) => {
            //TODO: Error handling
        } );
    }

    if( action.type === SEND_COMMAND ) {
        websocketService.sendCommand( action.payload.command );
    }

    return next( action );
}