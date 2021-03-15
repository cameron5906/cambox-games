import { UiElement } from "@cambox/common/types/types/UiElement";
import { Command } from "@cambox/common/types/models/Command";
import { IRoom } from "./IRoom";
import { IPlayer } from "./IPlayer";

export interface IGameService {
    onGameStart: ( room: IRoom ) => void;
    onGameEnd: ( room: IRoom ) => void;
    onPlayerJoin: ( room: IRoom, player: IPlayer ) => void;
    onPlayerLeave: ( room: IRoom, player: IPlayer ) => void;
    onPlayerCommand: ( room: IRoom, player: IPlayer, command: Command<any>) => void;
    onHostCommand: ( room: IRoom, command: Command<any> ) => void;
    buildPlayerUi: ( room: IRoom, player: IPlayer ) => Promise<UiElement[]>;
    buildHostUi: ( room: IRoom ) => Promise<UiElement[]>;
}