import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { loadGames, startGame } from '../../redux/actions/game.actions';
import { setRoomReady } from '../../redux/actions/room.actions';
import { RootState } from '../../types/interfaces/state/RootState';
import GameTile from './GameTile';
import PlayerTile from './PlayerTile';
import './Room.scss';

type Props = RootState & {
    loadGamesAction: () => void;
    setRoomReadyAction: () => void;
    startGameAction: ( gameId: string ) => void;
}

const Room = ( { room, games, loadGamesAction, setRoomReadyAction, startGameAction }: Props ) => {

    const doReadyUp = () => {
        setRoomReadyAction();
        loadGamesAction();
    }

    const startGame = ( gameId: string ) => {
        startGameAction( gameId );
    }

    const renderPlayers = () => (
        <div className="players-container">
            {!room.isReady && <h1 className="bold">Waiting for more players</h1>}
            {room.isReady && !room.isHost && <h1>Host is selecting a game</h1>}
            
            {room.players.map( ply =>
                <PlayerTile 
                    name={ply.name}
                    avatarUrl={ply.avatar} 
                />
            )}
        </div>
    );

    const renderGames = () => (
        <div className="games-container">
            <h1 className="bold">Select a game</h1>

            {games.map( game => 
                <GameTile 
                    {...game} 
                    onSelect={(gameId: string) => startGame( gameId )} 
                />
            )}
        </div>
    )

    return (
        <div className="room page">
            <div className="room-container">
                {( !room.isReady || !room.isHost ) && renderPlayers()}
                {room.isReady && room.isHost && renderGames()}
                {room.isHost && !room.isReady && <button className="start-button" onClick={doReadyUp}>Start</button>}
            </div>
        </div>
    )
}

export default connect(
    ( state: RootState ) => state,
    ( dispatch: Dispatch ) => ({
        loadGamesAction: () => dispatch( loadGames() ),
        setRoomReadyAction: () => dispatch( setRoomReady( true ) ),
        startGameAction: ( gameId: string ) => dispatch( startGame( gameId ) )
    })
)( Room );