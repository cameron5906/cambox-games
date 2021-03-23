import io from 'socket.io-client';
import { setGameDetails } from '../redux/actions/game.actions';
import { setPlayerRoster, setRoomReady } from '../redux/actions/room.actions';
import { setUi } from '../redux/actions/ui.actions';
import store from '../redux/store';
import { Player } from '../types/interfaces/room/Player';
import { websocketHost } from '../settings.json';
import { Command, UiElement, GameDetails } from '@cambox/common';

class WebsocketService {
    private socket: SocketIOClient.Socket;
    private roomCode?: string;

    constructor() {
        this.socket = io( websocketHost, {
            secure: false,
            autoConnect: false
        } );

        this.socket.on( 'connect', this.onConnected.bind( this ) );
        this.socket.on( 'disconnect', this.onDisconnected.bind( this ) );
        this.socket.on( 'roster', this.onPlayerRoster.bind( this ) );
        this.socket.on( 'room_ready', this.onRoomReady.bind( this ) );
        this.socket.on( 'ui', this.onUi.bind( this ) );
        this.socket.on( 'game', this.onNewGame.bind( this ) );
    }

    public connect( roomCode: string ) {
        console.log( 'Connecting to WS Server' );
        this.roomCode = roomCode;
        this.socket.connect();
    }

    public sendCommand( command: Command<any> ) {
        this.socket.emit( 'command', command );
    }

    public disconnect() {
        this.socket.disconnect();
    }

    private onPlayerRoster( players: Player[] ) {
        store.dispatch( setPlayerRoster( players ) );
    }

    private onGameState() {

    }

    private onUi( elements: UiElement[] ) {
        store.dispatch( setUi( elements ) );
    }

    private onNewGame( details: GameDetails ) {
        store.dispatch( setGameDetails( details ) );
    }

    private onRoomReady( isReady: boolean ) {
        store.dispatch( setRoomReady( isReady ) );
    }

    private onConnected() {
        console.log( 'Connected' );
        this.socket.emit( 'authenticate', localStorage.getItem( 'token' ), ( success: boolean ) => {
            console.log( `WS Auth: ${success}` );
            this.socket.emit( 'join', this.roomCode );
        });
    }

    private onDisconnected() {
        console.log( 'Disconnected' );
    }
}

export default new WebsocketService;