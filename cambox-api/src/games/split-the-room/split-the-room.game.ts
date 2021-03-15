import { Injectable } from '@nestjs/common';
import { IGameService } from '@cambox/common/types/interfaces/api/IGameService';
import { Command } from '@cambox/common/types/models/Command';
import { UiElement } from '@cambox/common/types/types/UiElement';
import { SplitTheRoomGameState, Phase, PlayerVariable } from './split-the-room.types';
import splitTheRoomPlayerUi from './split-the-room.player-ui';
import UiBuilder from '@cambox/common/util/UiBuilder';
import splitTheRoomHostUi from './split-the-room.host-ui';
import splitTheRoomPrompts from './split-the-room.prompts';
import { CommandType } from '@cambox/common/types/enums';
import { getCurrentPlayer, beginPromptPhase } from './split-the-room.logic';
import { handlePromptSubmission, handleVoteSubmission } from './split-the-room.commands';
import { IRoom } from '@cambox/common/types/interfaces/api/IRoom';
import { IPlayer } from '@cambox/common/types/interfaces/api/IPlayer';

@Injectable()
export class SplitTheRoomGame implements IGameService {
    onGameStart( room: IRoom ) {
        room.setState<SplitTheRoomGameState>({
            currentPrompt: splitTheRoomPrompts[0],
            currentPlayer: room.getRandomPlayer(),
            word: '',
            votes: [],
            votingCooldown: 30,
            promptCooldown: 30,
            phase: Phase.WritingPrompt,
            promptIndex: 0
        });

        beginPromptPhase( room );
    }

    onGameEnd( room: IRoom ) {

    }

    onPlayerJoin( room: IRoom, player: IPlayer ) {
        player.set( PlayerVariable.Score, 0 );
    }

    onPlayerLeave( room: IRoom, player: IPlayer ) {

    }

    onPlayerCommand( room: IRoom, player: IPlayer, command: Command<any> ) {
        const { phase } = room.getState<SplitTheRoomGameState>();

        if( phase === Phase.Voting ) {
            if( command.type === CommandType.UiClick ) {
                if( getCurrentPlayer( room ) !== player ) {
                    handleVoteSubmission( room, player, command );
                }
            }
        } else if( phase === Phase.WritingPrompt ) {
            if( command.type === CommandType.UiInputSubmit ) {
                if( getCurrentPlayer( room ) === player ) {
                    handlePromptSubmission( room, command );
                }
            }
        }
    }

    onHostCommand(room: IRoom, command: Command<any>) {

    }

    async buildPlayerUi( room: IRoom, player: IPlayer ): Promise<UiElement[]> {
        return splitTheRoomPlayerUi( UiBuilder.create(), room, player );
    }

    async buildHostUi( room: IRoom ): Promise<UiElement[]> {
        return splitTheRoomHostUi( UiBuilder.create(), room );
    }
}
