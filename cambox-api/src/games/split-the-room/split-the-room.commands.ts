import { UiInputSubmitCommand, UiClickCommand } from "@cambox/common/types/interfaces/ui";
import { Command } from "@cambox/common/types/models/Command";
import { Inputs, SplitTheRoomGameState } from "./split-the-room.types";
import { castVote, hasEveryoneVoted, beginVoting, showResults } from "./split-the-room.logic";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

export const handlePromptSubmission = ( room: IRoom, command: Command<UiInputSubmitCommand> ) => {
    const { data: { value } } = command;
    const state = room.getState<SplitTheRoomGameState>();
    room.setState<SplitTheRoomGameState>({
        ...state,
        word: value
    });
    beginVoting( room );
}

export const handleVoteSubmission = ( room: IRoom, player: IPlayer, command: Command<UiClickCommand> ) => {
    const { data: { id } } = command;
    castVote( room, player, id === Inputs.Yes );

    if( hasEveryoneVoted( room ) ) {
        showResults( room );
    }
}