import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { authenticate, checkIfLoggedIn } from '../../redux/actions/auth.actions';
import { createRoom, joinRoom } from '../../redux/actions/room.actions';
import { RootState } from '../../types/interfaces/state/RootState';
import FacebookLogin, { ReactFacebookFailureResponse } from 'react-facebook-login';
import { SocialNetwork } from '@cambox/common/types/types';
import './LandingPage.scss';
import TwitchLoginButton from '../../components/twitch-login-button/TwitchLoginButton';

type Props = RootState & {
    authenticate: ( platform: SocialNetwork, accessToken: string ) => void;
    createRoom: () => void;
    joinRoom: ( roomCode: string ) => void;
    checkIfLoggedIn: () => void;
}

const LandingPage = ( { authenticate, createRoom, joinRoom, checkIfLoggedIn, profile }: Props ) => {
    const [ code, setCode ] = useState( '' );

    useEffect( () => {
        checkIfLoggedIn();
    }, [] );

    const doJoinRoom = () => {
        if( code.length === 0 ) return;

        joinRoom( code );
    }

    const facebookLoginResponse = ( { accessToken, email, userID, name, picture: { data: { url } } } ) => {
        authenticate( 'facebook', accessToken );
    }

    const twitchLoginResponse = ( accessToken: string ) => {
        authenticate( 'twitch', accessToken );
    }

    const renderAuthentication = () => (
        <>
            <p>Sign into one of the social networks below to play</p>
            <FacebookLogin
                appId={"702921570376546"}
                autoLoad={false}
                textButton={""}
                fields="name,email,picture"
                callback={(data: any) => facebookLoginResponse( data )}
                cssClass="facebook-button"
            />
            <TwitchLoginButton callback={twitchLoginResponse} />
        </>
    )

    const renderJoinRoom = () => (
        <>
            <p>Enter a room code to join, or create one</p>
            <input 
                type="text" 
                maxLength={4} 
                value={code} 
                onChange={evt => setCode( evt.target.value )}
                onKeyUp={evt => evt.key === 'Enter' && doJoinRoom()} 
            />
            <button onClick={doJoinRoom}>Join</button>
            <button onClick={createRoom}>Create</button>
        </>
    )

    return (
        <div className="landing page">
            <h1 className="bold">Cambox Games</h1>
            <div className="landing-container">
                {profile.authToken && renderJoinRoom()}
                {!profile.authToken && renderAuthentication()}
            </div>
        </div>
    );
}

export default connect(
    ( state: RootState) => state,
    ( dispatch: Dispatch ) => ({
        authenticate: ( platform: SocialNetwork, accessToken: string ) => dispatch( authenticate( platform, accessToken ) ),
        createRoom: () => dispatch( createRoom() ),
        joinRoom: ( roomCode: string ) => dispatch( joinRoom( roomCode ) ),
        checkIfLoggedIn: () => dispatch( checkIfLoggedIn() )
    })
)( LandingPage );