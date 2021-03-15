import UiBuilder from "@cambox/common/util/UiBuilder";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { SplitTheRoomGameState, Phase } from "./split-the-room.types";
import { getCurrentPlayer, getVotes, isPositiveVoteMajority, getVoteSplit, getCompletedPrompt, calculateScore, getYesPercent, getNoPercent } from "./split-the-room.logic";
import { UiStyleProperty } from "@cambox/common/types/enums";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";

export default ( ui: UiBuilder, room: IRoom ): UiElement[] => {
    const state = room.getState<SplitTheRoomGameState>();

    return (() => {
        switch( state.phase ) {
            case Phase.Results:
                return resultsPhase( ui, room, state );
            case Phase.Voting:
                return votingPhase( ui, room, state );
            case Phase.WritingPrompt:
                return writingPromptPhase( ui, room, state );
        }
    } )().build()
}

const writingPromptPhase = ( ui: UiBuilder, room: IRoom, { promptCooldown }: SplitTheRoomGameState ) =>
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
                        .marginLeft( '0.8em' )
                        .withColor( '#1d3557' )
                        .bold()
            )
        .text( `${promptCooldown} seconds remaining` )
            .withSize( 20 )
            .italic()
            .marginTop( '1.5em' );

const votingPhase = ( ui: UiBuilder, room: IRoom, { votingCooldown, currentPrompt: { question } }: SplitTheRoomGameState ) =>
    ui
        .text( getCompletedPrompt( room ) )
            .withSize( 30 )
            .withColor( '#1d3557' )
        .text( question )
            .withSize( 26 )
            .withColor( '#1d3557' )
            .marginBottom( '1.5em' )
        .text( `${getVotes( room ).length}/${room.getPlayers().length} votes have been cast` )
            .withSize( 24 )
            .marginLeft( '3em' )
            .marginRight( '3em' )
            .bold()
            .marginBottom( '0.5em' )
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
        .text( `${votingCooldown} seconds remaining` )
            .withSize( 18 )
            .italic()
            .marginTop( '1em' )

const resultsPhase = ( ui: UiBuilder, room: IRoom, { currentPlayer }: SplitTheRoomGameState ) =>
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
                        .padding( '1em' )
                        .withWidth( 300 )
                        .withChildren( yesColumn =>
                            yesColumn
                                .text( `YES (${getYesPercent( room )})` )
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
                        .withStyle( UiStyleProperty.AlignItems, 'flex-end' )
                        .padding( '1em' )
                        .withWidth( 300 )
                        .withChildren( noColumn =>
                            noColumn
                                .text( `NO (${getNoPercent( room )})` )
                                    .withAlignment( 'center' )
                                    .bold()
                                    .underline()
                                    .marginBottom( '1em' )
                                .container()
                                    .vertical()
                                    .withChildren( noPlayers =>
                                        getVoteSplit( room ).no.reduce( ( no: UiBuilder, vote ) =>
                                            no.image( '', vote.player.getAvatar() )
                                                .withWidth( 48 )
                                                .withHeight( 48 )
                                                .asCircular()
                                                .marginBottom( '0.8em' )
                                        , noPlayers )
                                    )
                        )
            )
        .text( `+${calculateScore( room ).toLocaleString()}pts to ${currentPlayer.getName()}!` )
            .withSize( 18 )
            .italic()
            .marginTop( '1.5em' )