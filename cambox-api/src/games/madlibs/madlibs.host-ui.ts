import UiBuilder from "src/types/classes/UiBuilder";
import { UiStyleProperty } from "@cambox/common/types/enums";
import { fillPrompt, getFirstPlace, getVotesFor } from "./madlibs.logic";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { MadlibsGameState, Phase, PlayerVariable } from "./madlibs.types";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

export default ( room: IRoom ): UiElement[] => {
    const state = room.getState<MadlibsGameState>();
    let ui = UiBuilder.create();

    switch( state.phase ) {
        case Phase.VotingPeriod:
            return votingPeriod( ui, room, state ).build();
        case Phase.WinScreen:
            return winScreen( ui, room ).build();
        default:
            return mainUi( ui, room ).build();
    }
}

const votingPeriod = ( ui: UiBuilder, room: IRoom, { showcaseIndex, votingCountdown }: MadlibsGameState ) =>
    ui
        .text( `Prompt #${( showcaseIndex + 1 )}` )
            .bold()
            .italic()
            .withSize( 30 )
            .withColor( '#1d3557' )
            .withStyle( UiStyleProperty.Margin, '0px' )
        .text( fillPrompt( room, room.getPlayers()[ showcaseIndex ].get<string[]>( PlayerVariable.Answers ) ) )
            .withSize( 32 )
        .text( `Voting ends in ${votingCountdown} seconds` )
            .marginTop( '1em' )

const winScreen = ( ui: UiBuilder, room: IRoom ) =>
    ui
        .image( '', getFirstPlace( room ).getAvatar() )
            .withWidth( 128 ).withHeight( 128 )
            .asCircular()
        .text( `${getFirstPlace( room ).getName()} wins with ${getVotesFor( room, getFirstPlace( room ) ).length} votes!` )
            .withSize( 28 )
            .marginTop( '1.2em' )
        .container()
            .horizontal()
            .withChildren( voters =>
                getVotesFor( room, getFirstPlace( room ) ).reduce( ( subUi: UiBuilder, vote ) =>
                    subUi
                        .image( '', vote.from.getAvatar() )
                            .withStyle( UiStyleProperty.JustifyContent, 'center' )
                            .withWidth( 48 ).withHeight( 48 )
                            .asCircular()
                            .margin( '0.8em' )
                , voters )
            )
        .text( `Next game starting momentarily...` )
            .withSize( 24 )
            .marginTop( '2em' )
            .italic();

const mainUi = ( ui: UiBuilder, room: IRoom ) =>
    ui
        .text( 'Awaiting submissions' )
            .withSize( 38 )
            .bold()
        .container()
            .horizontal()
            .withChildren( playerContainer =>
                room.getPlayers().reduce( (subUi: UiBuilder, ply: IPlayer ) => {
                    return subUi
                        .container()
                        .vertical()
                        .margin( '1em' )
                        .withAlignment( 'center' )
                        .withChildren( () =>
                            playerTile( ply )
                        )
                }, 
                playerContainer
            )
        );

const playerTile = ( ply: IPlayer ) =>
    UiBuilder.create()
        .image(ply.getName(), ply.getAvatar())
            .asCircular()
            .withWidth( 64 )
            .withHeight( 64 )
            .withBorderWidth( 2 )
            .animated( 0.15 )
            .if(
                () => ply.get<boolean>( PlayerVariable.Typing ),
                then => then.withBorderColor( 'lightgreen' ),
                otherwise => otherwise.withBorderColor( 'transparent' )
            )
        .text( ply.getName() )
            .margin( '0px' )
            .withSize( 18 )
        .text( `Score: ${ply.get( PlayerVariable.Score )}` )
            .margin( '0px' );