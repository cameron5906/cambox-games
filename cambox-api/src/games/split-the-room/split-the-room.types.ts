import Player from "src/types/classes/Player";

export interface SplitTheRoomGameState {
    currentPrompt: {
        text: string;
        question: string;
    };
    currentPlayer: Player;
    word: string;
    votes: { player: Player, isYes: boolean }[],
    votingCooldown: number;
    promptCooldown: number;
    phase: Phase;
    chosenPlayerIndex: number;
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