import Player from "src/types/classes/Player";

export interface MadlibsGameState {
    currentPrompt: Prompt;
    phase: Phase;
    votes: { to: Player, from: Player }[];
    showcaseIndex: number;
    votingCountdown: number;
    winScreenCountdown: number;
}

export interface Prompt {
    template: string;
    words: string[];
}

export enum Phase {
    WritingPeriod,
    VotingPeriod,
    WinScreen
}

export enum Inputs {
    WordInput = "word_input"
}

export enum PlayerVariable {
    Answers,
    Typing,
    Score
}

export enum Task {
    VotingCountdown,
    ShowcaseCarousel,
    WinScreenCountdown
}