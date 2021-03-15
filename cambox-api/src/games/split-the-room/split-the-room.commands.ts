import { UiInputSubmitCommand, UiClickCommand } from "@cambox/common/types/interfaces/ui";
import Room from "src/types/classes/Room";
import { Command } from "@cambox/common/types/models/Command";
import { Inputs, SplitTheRoomGameState } from "./split-the-room.types";
import { castVote, hasEveryoneVoted, beginVoting, showResults } from "./split-the-room.logic";
import Player from "src/types/classes/Player";

export const handlePromptSubmission = ( room: Room, command: Command<UiInputSubmitCommand> ) => {
    const { data: { value } } = command;
    const state = room.getState<SplitTheRoomGameState>();
    room.setState<SplitTheRoomGameState>({
        ...state,
        word: value
    });
    beginVoting( room );
}

export const handleVoteSubmission = ( room: Room, player: Player, command: Command<UiClickCommand> ) => {
    const { data: { id } } = command;
    castVote( room, player, id === Inputs.Yes );

    if( hasEveryoneVoted( room ) ) {
        showResults( room );
    }
}