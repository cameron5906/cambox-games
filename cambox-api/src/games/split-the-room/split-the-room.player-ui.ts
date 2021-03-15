import UiBuilder from "src/types/classes/UiBuilder";
import Room from "src/types/classes/Room";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { SplitTheRoomGameState, Phase, Inputs } from "./split-the-room.types";
import { getCurrentPlayer, isPositiveVoteMajority, getBlankPrompt } from "./split-the-room.logic";
import Player from "src/types/classes/Player";

export default ( ui: UiBuilder, room: Room, player: Player ): UiElement[] => {
    const state = room.getState<SplitTheRoomGameState>();

    return ( () => {
        switch( state.phase ) {
            case Phase.Results:
                return resultsPhase( ui, room );
            case Phase.Voting:
                return votingPhase( ui, room, player, state );
            case Phase.WritingPrompt:
                return writingPromptPhase( ui, room, player, state );
        }
    } )().build();
}

const writingPromptPhase = ( 
    ui: UiBuilder, 
    room: Room, 
    player: Player, 
    { currentPrompt: { text: prompt, question } }: SplitTheRoomGameState 
) =>
    ui
        .if(
            () => getCurrentPlayer( room ) === player,
            then => 
                then
                    .text( getBlankPrompt( room ) )
                        .withSize( 28 )
                        .bold()
                        .marginBottom( '0.5em' )
                    .text( question )
                        .withSize( 20 )
                        .italic()
                    .input( Inputs.Prompt, 'text', '' )
                        .marginTop( '1em' )
            , otherwise =>
                otherwise
                    .text( `Waiting for ${getCurrentPlayer( room ).getName()}...` )
                        .withSize( 32 )
                        .bold()
        )

const votingPhase = ( 
    ui: UiBuilder, 
    room: Room,
    player: Player,
    { currentPrompt: { text: prompt, question } }: SplitTheRoomGameState 
) =>
    ui
        .if(
            () => getCurrentPlayer( room ) === player,
            then =>
                then
                    .text( question )
                        .withSize( 24 )
                        .marginBottom( '0.5em' )
                        .bold()
                        .italic()
                    .container()
                        .marginTop( '1em' )
                        .horizontal()
                        .spaceEvenly()
                        .withChildren( yesNoContainer =>
                            yesNoContainer
                                .button( Inputs.Yes, 'Yes' )
                                    .marginRight( '0.5em' )
                                .button( Inputs.No, 'No' )
                                    .marginLeft( '0.5em' )
                        )
            , otherwise =>
                otherwise
                    .text( `Waiting for votes...` )
                    .withSize( 32 )
                    .bold()
        )

const resultsPhase = ( ui: UiBuilder, room: Room ) =>
    ui
        .text( `${isPositiveVoteMajority( room ) ? 'YES' : 'NO'} wins!` )
            .withSize( 38 )
            .margin( '2em' )
            .marginLeft( '4em' )
            .marginRight( '4em' )
            .bold()
            .italic()