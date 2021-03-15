import { GameDetails } from "@cambox/common/types/models/GameDetails";
import { Command } from "@cambox/common/types/models/Command";
import { IGameService } from "../../../../cambox-common/types/interfaces/api/IGameService";
import { GameState } from "../interfaces/GameState";
import Player from "./Player";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";

class Room implements IRoom {    
    private roomCode: string;
    private players: IPlayer[];
    private inProgress: boolean;
    private recurringTasks: { [id: string]: number };
    private delayedTasks: { [id: string]: number };

    private gameState: GameState | null;
    private gameHandler: IGameService | null;

    constructor( roomCode: string ) {
        this.roomCode = roomCode;
        this.players = [];
        this.gameHandler = null;
        this.gameState = null;
        this.inProgress = false;
        this.recurringTasks = {};
        this.delayedTasks = {};
    }

    public addPlayer( player: Player ) {
        this.players.push( player );
        this.sendPlayerRoster();
    }
    
    public ready() {
        this.inProgress = true;
        this.broadcastToPlayers( 'room_ready', true );
    }

    public startGame( gameMode: GameDetails, gameHandler: IGameService ) {
        this.gameHandler = gameHandler;

        for( const player of this.players )
            this.gameHandler.onPlayerJoin( this, player );
        
        this.gameHandler.onGameStart( this );
        this.broadcastToPlayers( 'game', gameMode );
        this.sendUi();
    }

    public stopGame() {
        this.gameHandler?.onGameEnd( this );

        for( const player of this.players )
            player.clearGameData();

        for( const task of Object.keys( this.recurringTasks ) ) {
            console.log( `Clearing recurring task '${task}' for room ${this.roomCode}` );
            clearInterval( this.recurringTasks[ task ] );
        }

        this.gameHandler = null;
        this.gameState = null;
        this.inProgress = false;
        this.broadcastToPlayers( 'room_ready', false );
        this.sendPlayerRoster();
    }

    public getPlayers(): IPlayer[] {
        return this.players.filter( p => !p.isHosting() );
    }

    public getRandomPlayer(): IPlayer {
        return this.getPlayers()[ Math.floor( Math.random() * this.getPlayers().length ) ];
    }

    public getHost(): IPlayer {
        return this.players.find( p => p.isHosting() );
    }

    public isInProgress(): boolean {
        return this.inProgress;
    }

    public getRoomCode(): string {
        return this.roomCode;
    }

    public setState<T>( gameState: T ) {
        this.gameState = { ...(this.gameState || {}), ...gameState };
        this.sendUi();
    }

    public getState<T>(): T {
        return this.gameState as T;
    }

    public onPlayerCommand( player: Player, command: Command<any> ) {
        this.gameHandler?.onPlayerCommand( this, player, command );
    }

    public onHostCommand( command: Command<any> ) {
        this.gameHandler?.onHostCommand( this, command );
    }

    public onPlayerDisconnected( player: Player ) {
        this.players = this.players.filter( ply => 
            ply !== player
        );

        this.gameHandler?.onPlayerLeave( this, player );
        this.sendPlayerRoster();
        this.sendUi();
    }

    public registerRecurringTask( id: any, callback: CallableFunction, ms: number ) {
        this.recurringTasks[id] = setInterval( callback, ms );
    }

    public cancelRecurringTask( id: any ) {
        if( this.recurringTasks[id] ) {
            clearInterval( this.recurringTasks[id] );
            delete this.recurringTasks[id];
        }
    }

    public registerDelayedTask( callback: CallableFunction, ms: number, id?: any ) {
        if( id ) {
            clearTimeout( this.delayedTasks[ id ] );
        }
        
        const handle = setTimeout( () => {
            if( this.gameHandler )
                callback();
        }, ms ) as any;

        if( id ) {
            this.delayedTasks[ id ] = handle;
        }
    }

    private sendPlayerRoster() {
        for( const player of this.players ) {
            player.getSocket()?.emit( 
                'roster', 
                this.players.map( ply => ( 
                    {
                        name: ply.getName(),
                        avatar: ply.getAvatar()
                    } 
                ) ) 
            );
        }
    }

    private async sendUi() {
        if( !this.gameHandler || !this.gameState ) return;

        for( const player of this.players ) {
            if( player.isHosting() ) {
                player.getSocket()?.emit( 'ui', await this.gameHandler.buildHostUi( this ) );
            } else {
                player.getSocket()?.emit( 'ui', await this.gameHandler.buildPlayerUi( this, player ) );
            }
        }
    }

    private broadcastToPlayers( event: string, data?: any ) {
        for( const player of this.players ) {
            player.getSocket()?.emit( event, data );
        }
    }
}

export default Room;