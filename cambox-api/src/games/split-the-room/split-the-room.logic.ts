import { SplitTheRoomGameState, Phase, Task, PlayerVariable } from "./split-the-room.types";
import splitTheRoomPrompts from "./split-the-room.prompts";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

export const getCurrentPlayer = ( room: IRoom ) =>
    room.getState<SplitTheRoomGameState>().currentPlayer;

export const isPositiveVoteMajority = ( room: IRoom ) => 
    getVotes( room ).filter( v => v.isYes ).length > getVotes( room ).filter( v => !v.isYes ).length;

export const hasEveryoneVoted = ( room: IRoom ) => 
    getVotes( room ).length === ( room.getPlayers().length - 1 );

export const hasVoted = ( room: IRoom, player: IPlayer ) =>
    getVotes( room ).some( v => v.player === player );

export const getYesPercent = ( room: IRoom ) =>
    `${Math.floor( ( getVoteSplit( room ).yes.length / getVotes( room ).length ) * 100 )}%`;

export const getNoPercent = ( room: IRoom ) =>
    `${Math.floor( ( getVoteSplit( room).no.length / getVotes( room ).length ) * 100 )}%`

export const castVote = ( room: IRoom, player: IPlayer, isYes: boolean ) => {
    const state = room.getState<SplitTheRoomGameState>();
    room.setState<SplitTheRoomGameState>({
        ...state,
        votes: [
            ...state.votes,
            { player, isYes }
        ] 
    });

    if( hasEveryoneVoted( room ) ) {
        //TODO: Next stage
    }
}

export const getVoteSplit = ( room: IRoom ) => 
    ({
        yes: getVotes( room ).filter( v => v.isYes ),
        no: getVotes( room ).filter( v => !v.isYes )
    });

export const getNoVotes = ( room: IRoom ) => 
    getVotes( room ).filter( v => !v.isYes );

export const getVotes = ( room: IRoom ) => {
    const { votes } = room.getState<SplitTheRoomGameState>();
    return votes;
}

export const beginPromptPhase = ( room: IRoom ) => {
    room.registerRecurringTask( Task.PromptCooldown, () => {
        const state = room.getState<SplitTheRoomGameState>();

        if( state.promptCooldown === 1 ) {
            room.cancelRecurringTask( Task.PromptCooldown );

            room.setState<SplitTheRoomGameState>({
                ...state,
                currentPlayer: room.getRandomPlayer(),
                word: '',
                currentPrompt: splitTheRoomPrompts[0],
                votes: [],
                promptCooldown: 30,
                votingCooldown: 30
            });

            beginPromptPhase( room );
        } else {
            room.setState<SplitTheRoomGameState>({ ...state, promptCooldown: state.promptCooldown - 1 });
        }
    }, 1000 );
}

export const beginVoting = ( room: IRoom ) => {
    const state = room.getState<SplitTheRoomGameState>();
    room.setState<SplitTheRoomGameState>({ ...state, phase: Phase.Voting });

    room.cancelRecurringTask( Task.PromptCooldown );

    room.registerRecurringTask( Task.VotingCooldown, () => {
        const roomState = room.getState<SplitTheRoomGameState>();

        if( roomState.votingCooldown === 1 ) {
            showResults( room );
        } else {
            room.setState<SplitTheRoomGameState>({ ...roomState, votingCooldown: roomState.votingCooldown - 1 });
        }
    }, 1000 );
}

export const showResults = ( room: IRoom ) => {
    const state = room.getState<SplitTheRoomGameState>();
    room.setState<SplitTheRoomGameState>({ ...state, phase: Phase.Results });

    room.cancelRecurringTask( Task.VotingCooldown );

    room.registerDelayedTask( () => {
        completeRound( room );
    }, 8000 );
}

export const completeRound = ( room: IRoom ) => {
    const { currentPlayer, promptIndex } = room.getState<SplitTheRoomGameState>();
    let nextIndex = room.getPlayers().findIndex( p => p === currentPlayer ) + 1;

    if( nextIndex >= room.getPlayers().length ) {
        nextIndex = 0;
    }

    const nextPlayer = room.getPlayers()[ nextIndex ];

    currentPlayer.set<number>( 
        PlayerVariable.Score, 
        currentPlayer.get<number>( PlayerVariable.Score ) + calculateScore( room ) 
    );

    room.setState<SplitTheRoomGameState>({
        phase: Phase.WritingPrompt,
        currentPlayer: nextPlayer,
        currentPrompt: promptIndex + 1 === splitTheRoomPrompts.length ? splitTheRoomPrompts[0] : splitTheRoomPrompts[promptIndex + 1],
        votes: [],
        word: '',
        votingCooldown: 30,
        promptCooldown: 30,
        promptIndex: 0
    });

    beginPromptPhase( room );
}

export const getBlankPrompt = ( room: IRoom ) =>
    room.getState<SplitTheRoomGameState>().currentPrompt.text.replace( '^', '____' );

export const getCompletedPrompt = ( room: IRoom ) => {
    const { currentPrompt, word } = room.getState<SplitTheRoomGameState>();
    return currentPrompt.text.replace( '^', word );
}

export const calculateScore = ( room: IRoom ) => {
    const maxPoints = 5000;
    const { yes, no } = getVoteSplit( room );
    return Math.floor( ( yes.length / ( yes.length + no.length ) ) * maxPoints );
}