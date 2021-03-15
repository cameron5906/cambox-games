import { IPlayer } from "./IPlayer";
import { IGameService } from "./IGameService";
import { Command } from "../../models/Command";
import { GameDetails } from "../../models/GameDetails";

export interface IRoom {
    addPlayer: ( player: IPlayer ) => void;
    ready: () => void;
    startGame: ( gameMode: GameDetails, gameHandler: IGameService ) => void;
    stopGame: () => void;
    getPlayers: () => IPlayer[];
    getRandomPlayer: () => IPlayer;
    getHost: () => IPlayer;
    isInProgress: () => boolean;
    getRoomCode: () => string;
    setState<T>( gameState: T ): void;
    getState<T>(): T;
    onPlayerCommand: ( player: IPlayer, command: Command<any> ) => void;
    onHostCommand: ( command: Command<any> ) => void;
    onPlayerDisconnected: ( player: IPlayer ) => void;
    registerRecurringTask: ( id: any, callback: CallableFunction, ms: number ) => void;
    cancelRecurringTask: ( id: any ) => void;
    registerDelayedTask: ( callback: CallableFunction, ms: number, id?: any ) => void;
}