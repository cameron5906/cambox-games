import { Injectable } from '@nestjs/common';
import { CommandType } from '@cambox/common/types/enums/CommandType';
import { Command } from '@cambox/common/types/models/Command';
import { IGameService } from '@cambox/common/types/interfaces/api/IGameService';
import { UiElement } from '@cambox/common/types/types/UiElement';
import madlibsHostUi from './madlibs.host-ui';
import madlibsPlayerUi from './madlibs.player-ui';
import { handleAnswerSubmission, handlePlayerTyping, handleVote } from './madlibs.commands';
import { MadlibsGameState, Phase, PlayerVariable } from './madlibs.types';
import { UiClickCommand } from '@cambox/common/types/interfaces/ui';
import madlibsPrompts from './madlibs.prompts';
import { IRoom } from '@cambox/common/types/interfaces/api/IRoom';
import { IPlayer } from '@cambox/common/types/interfaces/api/IPlayer';

@Injectable()
export class MadlibsGame implements IGameService {
    async onGameStart( room: IRoom ) {
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
    
    async onGameEnd( room: IRoom ) {

    }

    async onPlayerJoin( room: IRoom, player: IPlayer ) {
        player.set( PlayerVariable.Score, 0 );
        player.set( PlayerVariable.Answers, [] );
        player.set( PlayerVariable.Typing, false );
    }

    async onPlayerLeave( room: IRoom, player: IPlayer ) {

    }

    async onPlayerCommand( room: IRoom, player: IPlayer, command: Command<any> ) {
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

    async onHostCommand( room: IRoom, command: Command<any> ) {
        
    }

    async buildHostUi( room: IRoom ): Promise<UiElement[]> {
        return madlibsHostUi( room );
    }

    async buildPlayerUi( room: IRoom, player: IPlayer ): Promise<UiElement[]> {
        return madlibsPlayerUi( room, player );
    }

    private getState( room: IRoom ): MadlibsGameState {
        return room.getState<MadlibsGameState>();
    }
}
