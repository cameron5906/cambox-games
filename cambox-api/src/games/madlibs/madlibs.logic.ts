import { MadlibsGameState, PlayerVariable, Phase, Task } from "./madlibs.types";
import madlibsPrompts from "./madlibs.prompts";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

/////Scoring//////
export const getFirstPlace = ( room: IRoom ): IPlayer => {
    const { votes } = room.getState<MadlibsGameState>();

    return room.getPlayers().sort( ( p1, p2 ) =>
        votes.filter( p => p.to === p1 ).length > votes.filter( p => p.to === p2 ).length ? -1 : 1
    )[0];
}

export const recordVote = ( room: IRoom, from: IPlayer, to: IPlayer ) => {
    const { votes } = room.getState<MadlibsGameState>();
    room.setState({
        votes: [ ...votes, { from, to } ]
    });

    if( areAllVotesSubmitted( room ) ) {
        room.registerDelayedTask( () => showWinner( room ), 1000 );
    }
}

export const getVotesFor = ( room: IRoom, ply: IPlayer ) => {
    const { votes } = room.getState<MadlibsGameState>();
    return votes.filter( v => v.to === ply );
}

export const hasVoted = ( room: IRoom, ply: IPlayer ) => {
    const { votes } = room.getState<MadlibsGameState>();
    return votes.some( p => p.from === ply );
}

export const incrementScore = ( ply: IPlayer ) => {
    ply.set( PlayerVariable.Score, ply.get<number>(PlayerVariable.Score) + 1 );
}

////Player state//////////
export const getNextWordForPlayer = ( room: IRoom, player: IPlayer ): string | null => {
    const { currentPrompt } = room.getState<MadlibsGameState>();
    const playerSubmissions = player.get<string[]>( PlayerVariable.Answers );

    if( playerSubmissions.length === currentPrompt.words.length ) return null;
    return currentPrompt.words[ playerSubmissions.length ];
}

/////Game state//////
export const areAllAnswersSubmitted = ( room: IRoom ) => {
    const { currentPrompt: { words } } = room.getState<MadlibsGameState>();
    return room.getPlayers().every( ply => 
        ply.get<string[]>( PlayerVariable.Answers ).length === words.length 
    );
}

export const areAllVotesSubmitted = ( room: IRoom ) => {
    const { votes } = room.getState<MadlibsGameState>();
    return votes.length === room.getPlayers().length;
}

export const startVotingPhase = ( room: IRoom ) => {
    room.setState({ 
        phase: Phase.VotingPeriod,
        votingCountdown: calculateVotingCountdown( room ) 
    });

    room.registerRecurringTask( Task.ShowcaseCarousel, () => {
        const roomState = room.getState<MadlibsGameState>();
        room.setState({ 
            showcaseIndex: ( roomState.showcaseIndex + 1 ) % room.getPlayers().length
        })
    }, calculateShowcaseTransition( room ) );

    room.registerRecurringTask( Task.VotingCountdown, () => {
        const roomState = room.getState<MadlibsGameState>();
        
        if( roomState.votingCountdown === 1 ) {
            showWinner( room );
        } else {
            room.setState({ votingCountdown: roomState.votingCountdown - 1 });
        }
    }, 1000 );
}

export const showWinner = ( room: IRoom ) => {
    const { phase } = room.getState<MadlibsGameState>();
    if( phase !== Phase.VotingPeriod ) return;

    room.cancelRecurringTask( Task.VotingCountdown );
    room.cancelRecurringTask( Task.ShowcaseCarousel );

    room.setState({ phase: Phase.WinScreen });
    incrementScore( getFirstPlace( room ) );

    room.registerRecurringTask( Task.WinScreenCountdown, () => {
        const { winScreenCountdown } = room.getState<MadlibsGameState>();

        if( winScreenCountdown === 1 ) {
            completeRound( room );
        } else {
            room.setState({ winScreenCountdown: winScreenCountdown - 1 });
        }
    }, 1000 );
}

export const completeRound = ( room: IRoom ) => {
    room.cancelRecurringTask( Task.WinScreenCountdown );
    room.getPlayers().forEach( ply => ply.set( PlayerVariable.Answers, [] ) );
    room.setState<MadlibsGameState>({
        currentPrompt: madlibsPrompts[0],
        votes: [],
        phase: Phase.WritingPeriod,
        showcaseIndex: 0,
        votingCountdown: 30,
        winScreenCountdown: 8
    });
}

////Util//////
export const fillPrompt = ( room: IRoom, answers: string[] ) => {
    const { currentPrompt: { template } } = room.getState<MadlibsGameState>();

    return answers.reduce( ( prompt: string, answer: string ) =>
        prompt.replace( '_', answer )
    , template);
}

export const calculateVotingCountdown = ( room: IRoom ) => {
    return calculateShowcaseTransition( room ) * room.getPlayers().length;
}

export const calculateShowcaseTransition = ( room: IRoom ) => {
    const { currentPrompt: { template } } = room.getState<MadlibsGameState>();
    return Math.floor( ( template.split(' ').length / 210 ) * 60 ) * 1000; //210 = average words per minute reading speed
}