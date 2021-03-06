import { IRoom } from "./IRoom";
import { IPlayer } from "./IPlayer";
import { Command } from "../commands";
import { UiBuilder } from "../ui";

export interface IGameService {
    onGameStart: ( room: IRoom ) => void;
    onGameEnd: ( room: IRoom ) => void;
    onPlayerJoin: ( room: IRoom, player: IPlayer ) => void;
    onPlayerLeave: ( room: IRoom, player: IPlayer ) => void;
    onPlayerCommand: ( room: IRoom, player: IPlayer, command: Command<any>) => void;
    onHostCommand: ( room: IRoom, command: Command<any> ) => void;
    buildPlayerUi: ( room: IRoom, player: IPlayer, ui: UiBuilder ) => void;
    buildHostUi: ( room: IRoom, ui: UiBuilder ) => void;
}