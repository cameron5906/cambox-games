import { Injectable } from '@nestjs/common';
import Player from 'src/types/classes/Player';
import { GameService } from 'src/types/interfaces/GameService';
import { Command } from '@cambox/common/types/models/Command';
import Room from 'src/types/classes/Room';
import { UiElement } from '@cambox/common/types/types/UiElement';
import { SplitTheRoomGameState, Phase, PlayerVariable } from './split-the-room.types';
import splitTheRoomPlayerUi from './split-the-room.player-ui';
import UiBuilder from 'src/types/classes/UiBuilder';
import splitTheRoomHostUi from './split-the-room.host-ui';
import splitTheRoomPrompts from './split-the-room.prompts';
import { CommandType } from '@cambox/common/types/enums';
import { getCurrentPlayer, beginPromptPhase } from './split-the-room.logic';
import { handlePromptSubmission, handleVoteSubmission } from './split-the-room.commands';

@Injectable()
export class SplitTheRoomGame implements GameService {
    onGameStart( room: Room ) {
        room.setState<SplitTheRoomGameState>({
            currentPrompt: splitTheRoomPrompts[0],
            currentPlayer: room.getRandomPlayer(),
            word: '',
            votes: [],
            votingCooldown: 30,
            promptCooldown: 30,
            phase: Phase.WritingPrompt
        });

        beginPromptPhase( room );
    }

    onGameEnd( room: Room ) {

    }

    onPlayerJoin( room: Room, player: Player ) {
        player.set( PlayerVariable.Score, 0 );
    }

    onPlayerLeave( room: Room, player: Player ) {

    }

    onPlayerCommand( room: Room, player: Player, command: Command<any> ) {
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

    onHostCommand(room: Room, command: Command<any>) {

    }

    async buildPlayerUi( room: Room, player: Player ): Promise<UiElement[]> {
        return splitTheRoomPlayerUi( UiBuilder.create(), room, player );
    }

    async buildHostUi( room: Room ): Promise<UiElement[]> {
        return splitTheRoomHostUi( UiBuilder.create(), room );
    }
}
