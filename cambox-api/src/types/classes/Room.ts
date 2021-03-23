import { GameDetails } from "@cambox/common/types/models/GameDetails";
import { Command } from "@cambox/common/types/models/Command";
import { IGameService } from "../../../../cambox-common/types/interfaces/api/IGameService";
import { GameState } from "../interfaces/GameState";
import Player from "./Player";
import { IRoom } from "@cambox/common/types/interfaces/api/IRoom";
import { IPlayer } from "@cambox/common/types/interfaces/api/IPlayer";
import got from "got";
import UiBuilder from "@cambox/common/util/UiBuilder";

class Room implements IRoom {    
    private roomCode: string;
    private players: IPlayer[];
    private inProgress: boolean;
    private recurringTasks: { [id: string]: number };
    private delayedTasks: { [id: string]: number };

    private gameState: GameState | null;
    private gameHandler: IGameService | null;
    private lastHttpRequestTime: Date | null;

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
        this.sendUi();
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

    public setState<T>( gameState: T, hostInitiated: boolean = false ) {
        this.gameState = { ...(this.gameState || {}), ...gameState };
        this.sendUi( !hostInitiated );
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

    public async httpGet(url: string, headers?: Object): Promise<any> {
        if( !this.canPerformHttpRequest() ) throw 'HTTP request rate limit exceeded';

        const response = await got.get( url, {
            headers: headers as any,
            responseType: 'json'
        } );

        this.lastHttpRequestTime = new Date;

        return response.body;
    }

    public async httpPost(url: string, payload: any, headers?: Object): Promise<any> {
        if( !this.canPerformHttpRequest() ) throw 'HTTP request rate limit exceeded';
        
        const response = await got.post( url, {
            headers: headers as any,
            json: payload,
            responseType: 'json'
        } );

        this.lastHttpRequestTime = new Date;

        return response.body;
    }

    private canPerformHttpRequest() {
        return !this.lastHttpRequestTime || ( Date.now() - this.lastHttpRequestTime.getTime() ) > 1000;
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

    private async sendUi( includeHost: boolean = true ) {
        if( !this.gameHandler || !this.gameState ) return;

        for( const player of this.players ) {
            const ui = UiBuilder.create();

            if( player.isHosting() ) {
                if( includeHost ) {
                    this.gameHandler.buildHostUi( this, ui );
                    player.getSocket()?.emit( 'ui', ui.build() );
                }
            } else {
                this.gameHandler.buildPlayerUi( this, player, ui );
                player.getSocket()?.emit( 'ui', ui.build() );
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