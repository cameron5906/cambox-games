import { Injectable } from '@nestjs/common';
import Player from 'src/types/classes/Player';
import Room from 'src/types/classes/Room';
import { CommandType } from '@cambox/common/types/enums/CommandType';
import { Command } from '@cambox/common/types/models/Command';
import { GameService } from 'src/types/interfaces/GameService';
import { UiElement } from '@cambox/common/types/types/UiElement';
import madlibsHostUi from './madlibs.host-ui';
import madlibsPlayerUi from './madlibs.player-ui';
import { handleAnswerSubmission, handlePlayerTyping, handleVote } from './madlibs.commands';
import { MadlibsGameState, Phase, PlayerVariable } from './madlibs.types';
import { UiClickCommand } from '@cambox/common/types/interfaces/ui';
import madlibsPrompts from './madlibs.prompts';

@Injectable()
export class MadlibsGame implements GameService {
    async onGameStart( room: Room ) {
        room.setState<MadlibsGameState>({
            currentPrompt: madlibsPrompts[0],
            votes: [],
            showcaseIndex: 0,
            phase: Phase.WritingPeriod,
            votingCountdown: 30,
            winScreenCountdown: 8 
        });

        room.registerRecurringTask( 'countdown', () => {
            const roomState = room.getState<MadlibsGameState>();
            room.setState({ countdown: roomState.votingCountdown - 1 });

            if( roomState.votingCountdown === 1 )
                room.cancelRecurringTask( 'countdown' );
        }, 1000 );
    }
    
    async onGameEnd( room: Room ) {

    }

    async onPlayerJoin( room: Room, player: Player ) {
        player.set( PlayerVariable.Score, 0 );
        player.set( PlayerVariable.Answers, [] );
        player.set( PlayerVariable.Typing, false );
    }

    async onPlayerLeave( room: Room, player: Player ) {

    }

    async onPlayerCommand( room: Room, player: Player, command: Command<any> ) {
        const { phase } = room.getState<MadlibsGameState>();

        if( phase === Phase.WritingPeriod ) {
            if( command.type === CommandType.UiInputSubmit ) {
                handleAnswerSubmission( room, player, command );
            } else if( command.type === CommandType.UiInputChange ) {
                handlePlayerTyping( room, player );
            }
        } else if( phase === Phase.VotingPeriod ) {
            if( command.type === CommandType.UiClick ) {
                if( ( command as Command<UiClickCommand>).data.id.indexOf( 'option_' ) === 0 ) {
                    handleVote( room, player, command );
                }
            }
        }
    }

    async onHostCommand( room: Room, command: Command<any> ) {
        
    }

    async buildHostUi( room: Room ): Promise<UiElement[]> {
        return madlibsHostUi( room );
    }

    async buildPlayerUi( room: Room, player: Player ): Promise<UiElement[]> {
        return madlibsPlayerUi( room, player );
    }

    private getState( room: Room ): MadlibsGameState {
        return room.getState<MadlibsGameState>();
    }
}
