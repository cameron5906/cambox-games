import React from 'react';
import { connect } from "react-redux";
import Header from './components/header/Header';
import DevToolsPage from './pages/developer-tools/DevToolsPage';
import Game from './pages/game/Game';
import LandingPage from './pages/landing/LandingPage';
import Room from './pages/room/Room';
import { Page } from './types/enums/Page';
import { RootState } from './types/interfaces/state/RootState';

export default connect( ( state: RootState ) => ({ ...state}) )
(( { app, room, game, profile }: RootState ) => {
    if( !room.roomCode ) {
        return (
            <>
                {profile.authToken && <Header />}
                {app.page === Page.Main && <LandingPage />}
                {app.page === Page.DeveloperTools && <DevToolsPage />}
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