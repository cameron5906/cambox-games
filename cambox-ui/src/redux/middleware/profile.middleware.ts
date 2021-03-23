import { AnyAction, Store } from "redux";
import apiService from "../../services/api.service";
import { LOAD_DEVELOPED_GAMES, LOAD_DEV_KEY } from "../actions/profile.actions";

export default ( { dispatch }: Store ) => ( next: any ) => ( action: AnyAction ) => {
    if( action.type === LOAD_DEV_KEY && !action.payload ) {
        apiService.getDeveloperKey().then(({ ok, error, data }) => {
            if( ok && data ) {
                dispatch({ ...action, payload: { key: data.key }});
            }
        } );

    } else if( action.type === LOAD_DEVELOPED_GAMES && !action.payload ) {
        apiService.getDevelopedGames().then(({ ok, error, data }) => {
            if( ok && data ) {
                dispatch({ ...action, payload: { games: data.games }});
            }
        } );
    } else {
        return next( action );
    }
}