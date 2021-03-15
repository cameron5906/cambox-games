import { AnyAction, Store } from "redux";
import apiService from "../../services/api.service";
import { ApiResponse, AuthenticateResponseData } from "@cambox/common/types/models/api";
import { AUTHENTICATE, setAuthToken } from "../actions/auth.actions";
import { setProfileDetails } from "../actions/profile.actions";

export default ( { dispatch }: Store ) => ( next: any ) => ( action: AnyAction ) => {
    if( action.type === AUTHENTICATE ) {
        const { email } = action.payload;

        apiService.authenticate( email ).then( ( { ok, error, data }: ApiResponse<AuthenticateResponseData> ) => {
            if( ok && data ) {
                localStorage.setItem( 'email', email );
                localStorage.setItem( 'token', data.token );
                dispatch( setProfileDetails( data.firstName, data.imageUrl ) );
                dispatch( setAuthToken( data.token ) );
            }
        } );
    }

    return next( action );
}