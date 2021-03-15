import { AnyAction } from "redux";
import { UiState } from "../../types/interfaces/state/UiState";
import { SET_UI } from "../actions/ui.actions";
import { LEAVE_ROOM } from "../actions/room.actions";

const defaultState: UiState = {
    elements: []
}

export default ( state: UiState = defaultState, action: AnyAction ): UiState => {
    switch( action.type ) {
        case SET_UI:
            const setUi = action.payload;
            return {
                ...state,
                elements: setUi.elements
            }
        case LEAVE_ROOM:
            return { ...defaultState };
    }
    return { ...state };
}