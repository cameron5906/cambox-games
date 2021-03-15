import React from 'react';
import { connect } from "react-redux";
import Header from './components/header/Header';
import Game from './pages/game/Game';
import LandingPage from './pages/landing/LandingPage';
import Room from './pages/room/Room';
import { RootState } from './types/interfaces/state/RootState';

export default connect( ( state: RootState ) => ({ ...state}) )
(( { room, game, profile }: RootState ) => {
    if( !room.roomCode ) {
        return (
            <>
                {profile.authToken && <Header />}
                <LandingPage />
            </>
        );
    } else if( room.roomCode && !game.details ) {
        return (
            <>
                <Header />
                <Room />
            </>
        );
    } else if( game.details) {
        return (
            <>
                <Header />
                <Game />
            </>
        );
    } else {
        return null;
    }
})