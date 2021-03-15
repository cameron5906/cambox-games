import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../types/interfaces/state/RootState';
import GameUI from '../../components/game-ui/GameUI';
import './Game.scss';
import { Command } from '@cambox/common/types/models/Command';
import { Dispatch } from 'redux';
import { sendCommand, stopGame } from '../../redux/actions/game.actions';
import { leaveRoom } from '../../redux/actions/room.actions';

type Props = RootState & {
    sendCommandAction: ( command: Command<any> ) => void;
    stopGameAction: () => void;
    leaveRoomAction: () => void;
}

const Game = ( { room, sendCommandAction, stopGameAction, leaveRoomAction }: Props ) => {
    return (
        <div className="game page">
            {room.isHost && <button className="stop-game--btn" onClick={stopGameAction}>Switch Games</button>}
            {!room.isHost && <button className="leave-game--btn" onClick={leaveRoomAction}>Leave</button>}
            <GameUI onCommand={sendCommandAction} />
        </div>
    )
}

export default connect(
    ( state: RootState ) => state,
    ( dispatch: Dispatch ) => ({
        sendCommandAction: ( command: Command<any> ) => dispatch( sendCommand( command ) ),
        stopGameAction: () => dispatch( stopGame() ),
        leaveRoomAction: () => dispatch( leaveRoom() )
    })
)( Game );