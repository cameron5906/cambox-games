import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { authenticate } from '../../redux/actions/auth.actions';
import { createRoom, joinRoom } from '../../redux/actions/room.actions';
import { RootState } from '../../types/interfaces/state/RootState';
import './LandingPage.scss';

type Props = RootState & {
    authenticateAction: ( email: string ) => void;
    createRoomAction: () => void;
    joinRoomAction: ( roomCode: string ) => void;
}

const LandingPage = ( { authenticateAction, createRoomAction, joinRoomAction, profile }: Props ) => {
    const [ email, setEmail ] = useState( profile.lastAuthenticatedEmail ); 
    const [ code, setCode ] = useState( '' );

    const doJoinRoom = () => {
        if( code.length === 0 ) return;

        joinRoomAction( code );
    }

    const renderAuthentication = () => (
        <>
            <p>Enter your RSI email to play</p>
            <input type="email" placeholder="Enter your RSI email" value={email} onChange={evt => setEmail( evt.target.value )} />
            <button onClick={() => authenticateAction( email )}>Start</button>
        </>
    )

    const renderJoinRoom = () => (
        <>
            <p>Enter a room code to join, or create one</p>
            <input type="text" maxLength={4} value={code} onChange={evt => setCode( evt.target.value )} />
            <button onClick={doJoinRoom}>Join</button>
            <button onClick={createRoomAction}>Create</button>
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
        authenticateAction: ( email: string ) => dispatch( authenticate( email ) ),
        createRoomAction: () => dispatch( createRoom() ),
        joinRoomAction: ( roomCode: string ) => dispatch( joinRoom( roomCode ) )
    })
)( LandingPage );