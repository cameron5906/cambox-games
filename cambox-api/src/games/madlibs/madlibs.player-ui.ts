import UiBuilder from "@cambox/common/util/UiBuilder";
import { fillPrompt, getNextWordForPlayer, getFirstPlace, hasVoted } from "./madlibs.logic";
import { UiListItem } from "@cambox/common/types/interfaces/ui";
import { UiElement } from "@cambox/common/types/types/UiElement";
import { MadlibsGameState, Phase, Inputs, PlayerVariable } from "./madlibs.types";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";

export default ( room: IRoom, player: IPlayer ): UiElement[] => {
    const state = room.getState<MadlibsGameState>();

    let ui = UiBuilder.create();
    switch( state.phase ) {
        case Phase.WinScreen:
            return winScreen( player, ui, room, state ).build();
        case Phase.WritingPeriod:
            return writingPeriod( player, ui, room ).build();
        case Phase.VotingPeriod:
            return votingPeriod( player, ui, room ).build();
    }
}

const winScreen = ( player: IPlayer, ui: UiBuilder, room: IRoom, { winScreenCountdown }: MadlibsGameState ) =>
    ui.if(
        () => getFirstPlace( room ) === player,
        then => then.text( 'You won!' ),
        otherwise => 
            otherwise
                .text( `${getFirstPlace( room ).getName()} wins!` )
                .text( 'Better luck next time...' )
    )
    .text( `Next game begins in ${winScreenCountdown} seconds` )
        .withSize( 14 )
        .withAlignment( 'center' )
        .marginTop( '2em' );

const writingPeriod = ( player: IPlayer, ui: UiBuilder, room: IRoom ) =>
    ui.if(
        () => getNextWordForPlayer( room, player ) === null,
        then => then.text( 'Waiting for other players to finish' ),
        otherwise => 
            otherwise
                .text( `Write a ${getNextWordForPlayer( room, player )}` )
                .input( Inputs.WordInput, 'text', '' )
    )

const votingPeriod = ( player: IPlayer, ui: UiBuilder, room: IRoom ) =>
    ui
        .if(
            () => !hasVoted( room, player ),
            then =>
                then
                    .text( 'Select the winning prompt' )
                    .withSize( 24 )
                    .bold()
                    .list( 'options' )
                    .withItems(
                        room.getPlayers().map( ( ply: IPlayer, idx: number ) => ({
                            id: idx,
                            prompt: fillPrompt( room, ply.get<string[]>( PlayerVariable.Answers ) )
                        }))
                        .map( ({ id, prompt }) =>
                            UiBuilder.create()
                                .item( `Prompt #${( id + 1 )}`, `option_${id}` )
                                    .withBorderColor( 'black' )
                                    .withBorderWidth( 2 )
                                    .padding( '0.5em' )
                                    .marginBottom( '0.3em' )
                                    .withSize( 22 )
                                .get<UiListItem>( 'list_item' )
                        )
                    )
                    .italic(),
            otherwise =>
                otherwise
                        .text( 'Waiting for other players to vote' )
                            .withAlignment( 'center' )
                            .withSize( 32 )
        )