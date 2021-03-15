import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

export interface SplitTheRoomGameState {
    currentPrompt: {
        text: string;
        question: string;
    };
    currentPlayer: IPlayer;
    word: string;
    votes: { player: IPlayer, isYes: boolean }[],
    votingCooldown: number;
    promptCooldown: number;
    phase: Phase;
    promptIndex: number;
}

export enum Phase {
    WritingPrompt,
    Voting,
    Results
}

export enum PlayerVariable {
    Score
}

export enum Inputs {
    Prompt = "prompt",
    Yes = "yes",
    No = "no"
}

export enum Task {
    VotingCooldown,
    PromptCooldown
}