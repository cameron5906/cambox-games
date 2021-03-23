import { IGameService, IRoom, IPlayer } from "@cambox/common/dist/types/interfaces/api";
import { Command } from "@cambox/common/dist/types/models";
import UiBuilder from "@cambox/common/dist/util/UiBuilder";

class TemplateGame implements IGameService {
    onGameStart(room: IRoom) {

    }

    onGameEnd(room: IRoom) {
        
    }

    onPlayerJoin(room: IRoom, player: IPlayer) {

    }

    onPlayerLeave(room: IRoom, player: IPlayer) {

    }

    onPlayerCommand(room: IRoom, player: IPlayer, command: Command<any>) {

    }

    onHostCommand(room: IRoom, command: Command<any>) {

    }

    buildPlayerUi(room: IRoom, player: IPlayer, ui: UiBuilder) {
        
    }

    buildHostUi(room: IRoom, ui: UiBuilder) {
        
    }
}

export default TemplateGame;