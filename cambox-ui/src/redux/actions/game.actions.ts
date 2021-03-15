import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { Command } from '@cambox/common/types/models/Command';

export const LOAD_GAMES = 'LOAD_GAMES';
export const loadGames = () => ({
    type: LOAD_GAMES
})

export const SET_GAMES = 'SET_GAMES';
export const setGames = ( games: GameDetails[] ) => ({
    type: SET_GAMES,
    payload: { games } 
})

export const START_GAME = 'START_GAME';
export const startGame = ( gameId: string ) => ({
    type: START_GAME,
    payload: { gameId }
})

export const STOP_GAME = 'STOP_GAME';
export const stopGame = () => ({
    type: STOP_GAME
})

export const SET_GAME_DETAILS = 'SET_GAME_DETAILS';
export const setGameDetails = ( details: GameDetails ) => ({
    type: SET_GAME_DETAILS,
    payload: { details }
})

export const SEND_COMMAND = 'SEND_COMMAND';
export const sendCommand = ( command: Command<any> ) => ({
    type: SEND_COMMAND,
    payload: { command }
})