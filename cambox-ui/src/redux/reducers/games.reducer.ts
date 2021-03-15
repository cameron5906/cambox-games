import { AnyAction } from "redux";
import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { SET_GAMES } from "../actions/game.actions";

export default ( state: GameDetails[] = [], action: AnyAction ): GameDetails[] => {
    switch( action.type ) {
        case SET_GAMES:
            return action.payload.games;
    }

    return state;
}