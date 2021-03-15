import { Injectable } from '@nestjs/common';
import { MadlibsGame } from 'src/games/madlibs/madlibs.game';
import { SplitTheRoomGame } from 'src/games/split-the-room/split-the-room.game';
import Player from 'src/types/classes/Player';
import Room from 'src/types/classes/Room';
import gamesList, { MADLIBS_ID, SPLIT_THE_ROOM_ID } from 'src/games/games.list';

@Injectable()
export class GameService {
    private activeRooms: Room[];

    constructor(
        private readonly madLibs: MadlibsGame,
        private readonly splitTheRoom: SplitTheRoomGame
    ) {
        this.activeRooms = [];
    }

    public async createRoom(): Promise<string> {
        const roomCode = await this.generateRoomCode( 4 );

        const room = new Room( roomCode );
        this.activeRooms.push( room );

        return roomCode;
    }

    /**
     * Triggers a game to begin in a Room
     * @param roomCode The code to the room in which the game is starting
     * @param gameId The identifier to the game
     */
    public startGame( roomCode: string, gameId: string ) {
        const room = this.activeRooms.find( room => room.getRoomCode() === roomCode );
        if( !room ) throw 'Room does not exist';
        
        const gameDetails = gamesList.find( g => g.id === gameId );
        if( !gameDetails ) throw 'Game does not exist';

        room.startGame( gameDetails, this.getGameHandler( gameId ) );
    }

    public stopGame( roomCode: string ) {
        const room = this.activeRooms.find( room => room.getRoomCode() === roomCode );
        if( !room ) throw 'Room does not exist';

        room.stopGame();
    }

    public roomReady( roomCode: string ) {
        const room = this.activeRooms.find( room => room.getRoomCode() === roomCode );
        if( !room ) throw 'Room does not exist';

        room.ready();
    }

    /***
     * Checks whether a given Room code points to an active Room, and if that Room is accepting players
     */
    public isRoomAvailable(roomCode: string) {
        return this.activeRooms.some( room => 
            room.getRoomCode() === roomCode && 
            !room.isInProgress() 
        );
    }

    /**
     * Adds a Player to a Room
     * @param roomCode The code to the Room the player is joining
     * @param player The Player object
     */
    public addPlayerToRoom(roomCode: string, player: Player): boolean {
        const room = this.activeRooms.find( room => 
            room.getRoomCode() === roomCode 
        );

        if( !room ) return false;
        if( room.isInProgress() ) return false;

        room.addPlayer( player );
        player.setRoom( room );

        return true;
    }

    /**
     * Called when a Player has disconnected from the websocket gateway
     * @param player The Player that disconnected
     */
    public onPlayerDisconnected(player: Player) {
        player.getRoom()?.onPlayerDisconnected( player );
    }

    /***
     * Generates a random Room code
     * @param length The amount of characters to generate
     */
    private async generateRoomCode(length: number): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split( '' );
        let buffer = '';
        
        for( let i = 0; i < length; i++ ) {
            buffer += characters[Math.floor( Math.random() * characters.length )];
            await this.wait( 1 );
        }

        return buffer;
    }

    private getGameHandler( id: string ) {
        switch( id ) {
            case MADLIBS_ID:
                return this.madLibs;
            case SPLIT_THE_ROOM_ID:
                return this.splitTheRoom;
        }
    }

    private async wait( ms: number ) {
        return new Promise(resolve => setTimeout( resolve, ms ) );
    }
}
