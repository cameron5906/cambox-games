import { AnyAction, Store } from "redux";
import apiService from "../../services/api.service";
import { AUTHENTICATE, checkIfLoggedIn, CHECK_LOGGED_IN, setAuthToken } from "../actions/auth.actions";
import { setProfileDetails } from "../actions/profile.actions";
import * as jwt from 'jsonwebtoken';
import { ApiResponse, AuthenticateResponseData } from "@cambox/common";

export default ( { dispatch }: Store ) => ( next: any ) => ( action: AnyAction ) => {
    if( action.type === AUTHENTICATE ) {
        const { platform, accessToken } = action.payload;

        apiService.authenticate( platform, accessToken ).then( ( { ok, error, data }: ApiResponse<AuthenticateResponseData> ) => {
            if( ok && data ) {
                localStorage.setItem( 'token', data.token );
                dispatch( checkIfLoggedIn() );
            }
        } );
    }

    if( action.type === CHECK_LOGGED_IN ) {
        if( localStorage.getItem( 'token' ) ) {
            //TODO: Check expiration
            const token = localStorage.getItem( 'token' ) as string;
            const { name, imageUrl }: any = jwt.decode( token );
            dispatch( setProfileDetails( name, imageUrl ) );
            dispatch( setAuthToken( token ) );
        }
    }

    return next( action );
}