import UiBuilder from "src/types/classes/UiBuilder";
import Room from "src/types/classes/Room";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { SplitTheRoomGameState, Phase } from "./split-the-room.types";
import { getCurrentPlayer, getVotes, isPositiveVoteMajority, getVoteSplit } from "./split-the-room.logic";
import { UiStyleProperty } from "@cambox/common/types/enums";

export default ( ui: UiBuilder, room: Room ): UiElement[] => {
    const state = room.getState<SplitTheRoomGameState>();

    return (() => {
        switch( state.phase ) {
            case Phase.Results:
                return resultsPhase( ui, room );
            case Phase.Voting:
                return votingPhase( ui, room );
            case Phase.WritingPrompt:
                return writingPromptPhase( ui, room, state );
        }
    } )().build()
}

const writingPromptPhase = ( ui: UiBuilder, room: Room, { promptCooldown }: SplitTheRoomGameState ) =>
    ui
        .container()
            .horizontal()
            .withChildren( writerContainer =>
                writerContainer
                    .image( '', getCurrentPlayer( room ).getAvatar() )
                        .withWidth( 100 )
                        .withHeight( 100 )
                        .asCircular()
                    .text( `${getCurrentPlayer( room ).getName()} is completing the prompt` )
                        .withSize( 30 )
                        .withColor( '#1d3557' )
                        .bold()
            )
        .text( `${promptCooldown} seconds remaining` )
            .withSize( 20 )
            .italic()
            .marginTop( '1.5em' );

const votingPhase = ( ui: UiBuilder, room: Room ) =>
    ui
        .text( `${getVotes( room ).length}/${room.getPlayers().length} votes have been cast` )
            .withSize( 30 )
            .withColor( '#1d3557' )
            .bold()
            .marginBottom( '1em' )
        .container()
            .horizontal()
            .withChildren( voters =>
                getVotes( room ).reduce( ( subUi: UiBuilder, vote ) =>
                    subUi
                        .image( '', vote.player.getAvatar() )
                        .withWidth( 32 )
                        .withHeight( 32 )
                        .asCircular()
                        .margin( '1em' )
                , voters )
            )

const resultsPhase = ( ui: UiBuilder, room: Room ) =>
    ui
        .text( `${isPositiveVoteMajority( room ) ? 'YES' : 'NO'} wins!` )
            .withSize( 30 )
            .bold()
            .withColor( '#1d3557' )
        .container()
            .horizontal()
            .spaceEvenly()
            .withChildren( splitContainer =>
                splitContainer
                    .container()
                        .vertical()
                        .withStyle( UiStyleProperty.AlignContent, 'flex-start' )
                        .withChildren( yesColumn =>
                            yesColumn
                                .text( 'YES' )
                                    .withAlignment( 'center' )
                                    .bold()
                                    .underline()
                                    .marginBottom( '1em' )
                                .container()
                                    .vertical()
                                    .withChildren( yesPlayers =>
                                        getVoteSplit( room ).yes.reduce( ( yes: UiBuilder, vote ) =>
                                            yes.image( '', vote.player.getAvatar() )
                                                .withWidth( 48 )
                                                .withHeight( 48 )
                                                .asCircular()
                                                .marginBottom( '0.8em' )
                                        , yesPlayers )
                                    )
                        )
                    .container()
                        .vertical()
                        .withStyle( UiStyleProperty.AlignContent, 'flex-end' )
                        .withChildren( noColumn =>
                            noColumn
                                .text( 'NO' )
                                    .withAlignment( 'center' )
                                    .bold()
                                    .underline()
                                    .marginBottom( '1em' )
                                .container()
                                    .vertical()
                                    .withChildren( noPlayers =>
                                        getVoteSplit( room ).yes.reduce( ( no: UiBuilder, vote ) =>
                                            no.image( '', vote.player.getAvatar() )
                                                .withWidth( 48 )
                                                .withHeight( 48 )
                                                .asCircular()
                                                .marginBottom( '0.8em' )
                                        , noPlayers )
                                    )
                        )
            )