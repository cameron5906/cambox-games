import Player from "../classes/Player";
import Room from "../classes/Room";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { Command } from "@cambox/common/types/models/Command";

export interface GameService {
    onGameStart: ( room: Room ) => void;
    onGameEnd: ( room: Room ) => void;
    onPlayerJoin: ( room: Room, player: Player ) => void;
    onPlayerLeave: ( room: Room, player: Player ) => void;
    onPlayerCommand: ( room: Room, player: Player, command: Command<any>) => void;
    onHostCommand: ( room: Room, command: Command<any> ) => void;
    buildPlayerUi: ( room: Room, player: Player ) => Promise<UiElement[]>;
    buildHostUi: ( room: Room ) => Promise<UiElement[]>;
}