import { AnyAction } from "redux";
import { Page } from "../../types/enums/Page";
import { AppState } from "../../types/interfaces/state/AppState";
import { CHANGE_PAGE } from "../actions/app.actions";

const defaultState: AppState = {
    page: Page.Main
}

export default ( state: AppState = defaultState, action: AnyAction ): AppState => {
    switch( action.type ) {
        case CHANGE_PAGE:
            return { ...state, page: action.payload.page };
        default:
            return { ...state };
    }
}