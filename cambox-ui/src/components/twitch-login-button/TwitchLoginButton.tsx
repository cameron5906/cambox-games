import React from 'react';
import './TwitchLoginButton.scss';

const CLIENT_ID='my0r3xucv439qqx3xy21koz0pefubv';
const REDIRECT_URI=window.location.origin;

type Props = {
    callback: ( accessToken: string ) => void;
}

const TwitchLoginButton = ( { callback }: Props ) => {
    const click = () => {
        const win = window.open( 
            `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=user:read:email`, 
            'Login with Twitch', 
            'width=600,height=600' 
        );
        
        win.onload = () => {
            const hash = win.location.hash;
            if( hash.indexOf( 'access_token' ) !== -1 ) {
                callback( hash.split( 'access_token=' )[1].split( '&' )[0] );
                win.close();
            }
        }
    }

    return (
        <div className="twitch-login-button" onClick={click}>

        </div>
    );
}

export default TwitchLoginButton;