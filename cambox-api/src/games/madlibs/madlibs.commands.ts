import { Command } from "@cambox/common/types/models/Command";
import { UiInputSubmitCommand, UiClickCommand } from "@cambox/common/types/interfaces/ui";
import { areAllAnswersSubmitted, hasVoted, recordVote, startVotingPhase } from "./madlibs.logic";
import { Inputs, PlayerVariable } from "./madlibs.types";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

export const handleAnswerSubmission = ( room: IRoom, player: IPlayer, { data }: Command<UiInputSubmitCommand> ) => {
    if( data.id === Inputs.WordInput ) {
        console.log( `${player.getName()} submitted word: ${data.value}` );
        player.set<string[]>( 
            PlayerVariable.Answers, 
            [ ...player.get<string[]>( PlayerVariable.Answers ), data.value ]
        );

        if( areAllAnswersSubmitted( room ) ) {
            startVotingPhase( room );
        }
    }
}

export const handlePlayerTyping = ( room: IRoom, player: IPlayer ) => {
    player.set( PlayerVariable.Typing, true );
    room.registerDelayedTask(
        () => player.set( PlayerVariable.Typing, false ), 
        500, 
        `${player.getName()}_typing` 
    );
}

export const handleVote = ( room: IRoom, player: IPlayer, { data }: Command<UiClickCommand> ) => {
    if( hasVoted( room, player ) ) return; //Already voted this round
    
    const playerIndex = data.id.split( 'option_' )[1];
    const voteFor = room.getPlayers()[ playerIndex ]
    if( !voteFor ) return; //Player not found
    
    recordVote( room, player, voteFor );
}