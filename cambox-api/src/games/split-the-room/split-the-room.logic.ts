import Room from "src/types/classes/Room";
import { SplitTheRoomGameState, Phase, Task, PlayerVariable } from "./split-the-room.types";
import Player from "src/types/classes/Player";
import splitTheRoomPrompts from "./split-the-room.prompts";

export const getCurrentPlayer = ( room: Room ) =>
    room.getState<SplitTheRoomGameState>().currentPlayer;

export const isPositiveVoteMajority = ( room: Room ) => 
    getVotes( room ).filter( v => v.isYes ).length > getVotes( room ).filter( v => !v.isYes ).length;

export const hasEveryoneVoted = ( room: Room ) => 
    getVotes( room ).length === ( room.getPlayers().length - 1 );

export const hasVoted = ( room: Room, player: Player ) =>
    getVotes( room ).some( v => v.player === player );

export const castVote = ( room: Room, player: Player, isYes: boolean ) => {
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

export const getVoteSplit = ( room: Room ) => 
    ({
        yes: getVotes( room ).filter( v => v.isYes ),
        no: getVotes( room ).filter( v => !v.isYes )
    });

export const getNoVotes = ( room: Room ) => 
    getVotes( room ).filter( v => !v.isYes );

export const getVotes = ( room: Room ) => {
    const { votes } = room.getState<SplitTheRoomGameState>();
    return votes;
}

export const beginPromptPhase = ( room: Room ) => {
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

export const beginVoting = ( room: Room ) => {
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

export const showResults = ( room: Room ) => {
    const state = room.getState<SplitTheRoomGameState>();
    room.setState<SplitTheRoomGameState>({ ...state, phase: Phase.Results });

    room.cancelRecurringTask( Task.VotingCooldown );

    room.registerDelayedTask( () => {
        completeRound( room );
    }, 8000 );
}

export const completeRound = ( room: Room ) => {
    const { currentPlayer, chosenPlayerIndex, promptIndex } = room.getState<SplitTheRoomGameState>();
    let nextIndex = chosenPlayerIndex > room.getPlayers().length - 2 ? chosenPlayerIndex + 1 : 0;
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
        chosenPlayerIndex: nextIndex,
        promptIndex: 0
    });

    beginPromptPhase( room );
}

export const getBlankPrompt = ( room: Room ) =>
    room.getState<SplitTheRoomGameState>().currentPrompt.text.replace( '^', '____' );

export const getCompletedPrompt = ( room: Room ) => {
    const { currentPrompt, word } = room.getState<SplitTheRoomGameState>();
    return currentPrompt.text.replace( '^', word );
}

export const calculateScore = ( room: Room ) => {
    const maxPoints = 5000;
    const { yes, no } = getVoteSplit( room );
    return Math.floor( ( yes.length / ( yes.length + no.length ) ) * maxPoints );
}