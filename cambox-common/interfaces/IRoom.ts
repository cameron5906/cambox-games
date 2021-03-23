import { IPlayer } from "./IPlayer";
import { IGameService } from "./IGameService";
import { Command } from "../commands";
import { GameDetails } from "../models/GameDetails";

export interface IRoom {
    /**
     * [Internal]
     * Called when a player is added to a room
     */
    addPlayer: ( player: IPlayer ) => void;

    /**
     * [Internal]
     * Called when a room is ready to select a game
     */
    ready: () => void;

    /**
     * [Internal]
     * Called to select a game
     */
    startGame: ( gameMode: GameDetails, gameHandler: IGameService ) => void;
    
    /**
     * [Internal]
     * Call to stop the current game
     */
    stopGame: () => void;

    /**
     * Retrieves all players in a Room, excluding the Host
     */
    getPlayers: () => IPlayer[];

    /**
     * Helper function for selecting a random player in the room
     */
    getRandomPlayer: () => IPlayer;

    /**
     * Retrieves the Host for the Room
     */
    getHost: () => IPlayer;

    /**
     * [Internal]
     * Check whether the room has a game in progress
     */
    isInProgress: () => boolean;

    /**
     * Retrieves the room code
     */
    getRoomCode: () => string;

    /**
     * Saves state information to the Room for the current game
     * @param gameState The game state to set
     * @param hostInitiated Whether or not the host initiated this state change. If true, the new state is not sent to the host.
     */
    setState<T>( gameState: T, hostInitiated?: boolean ): void;

    /**
     * Retrieves the current game state for the Room
     */
    getState<T>(): T;

    /**
     * Called when a Player issues a command to a game
     */
    onPlayerCommand: ( player: IPlayer, command: Command<any> ) => void;

    /**
     * Called when a Host issues a command to a game
     */
    onHostCommand: ( command: Command<any> ) => void;

    /**
     * Called when a Player leaves the game/room
     */
    onPlayerDisconnected: ( player: IPlayer ) => void;

    /**
     * Used to set up a function to call at a regular interval
     */
    registerRecurringTask: ( id: any, callback: CallableFunction, ms: number ) => void;

    /**
     * Call to cancel an ongoing recurring task
     */
    cancelRecurringTask: ( id: any ) => void;

    /**
     * Used to set up a function to call after a delay
     */
    registerDelayedTask: ( callback: CallableFunction, ms: number, id?: any ) => void;

    /**
     * Used to retrieve remote JSON data from an API (rate-limited)
     */
    httpGet: ( url: string, headers?: Object ) => any;

    /**
     * Used POST a JSON payload and retrieve a JSON response from an API (rate-limited)
     */
    httpPost: ( url: string, payload: any, headers?: Object ) => any;
}