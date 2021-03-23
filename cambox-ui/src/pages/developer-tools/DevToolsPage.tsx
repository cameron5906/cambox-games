import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../types/interfaces/state/RootState';
import Game from './Game';
import { loadDevelopedGames, loadDeveloperKey } from '../../redux/actions/profile.actions';
import apiService from '../../services/api.service';
import './DevToolsPage.scss';

type Props = RootState & {
    loadDeveloperKey: () => void;
    loadDevelopedGames: () => void;
}

const DevToolsPage = ( { profile: { developerKey, games }, loadDeveloperKey, loadDevelopedGames }: Props ) => {
    useEffect( () => {
        loadDeveloperKey();
        loadDevelopedGames();
    }, [] );

    return (
        <div className="dev-tools page">
            <div className="content-container">
                <h2 className="bold">Your Developer Key</h2>
                <p>Your key is <code>{developerKey}</code></p>
                <p style={{fontSize: '10px'}}><i>DO NOT SHARE YOUR KEY</i></p>


                <h2 className="bold">Quick Start</h2>
                <p>To create your own games, run <code>npm -i -g @cambox/cli</code> to install the CLI tool.</p>
                <p>From there, you may run <code>cambox create</code> in a directory of your choosing to generate a project folder.</p>
                <p>When you are ready to deploy, simply run <code>cambox publish</code> from within your game directory. The game will show up for you when you create a room.</p>

                <h2 className="bold">Your Games</h2>
                <div className="game-list">
                    {games.map( game => <Game {...game} isPublic={false} /> )}
                </div>
            </div>
        </div>
    )
}

export default connect(
    ( state: RootState ) => state,
    ( dispatch: Dispatch ) => ({
        loadDeveloperKey: () => dispatch( loadDeveloperKey() ),
        loadDevelopedGames: () => dispatch( loadDevelopedGames() )
    })
)( DevToolsPage );