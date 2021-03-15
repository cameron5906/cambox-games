import { AuthToken } from "../interfaces/AuthToken";
import { PlayerSocket } from "../types/PlayerSocket";
import Room from "./Room";

class Player {
    private userData: AuthToken;
    private room: Room;
    private gameData: any;
    private socket: PlayerSocket;

    constructor( socket: PlayerSocket, userData: AuthToken ) {
        this.userData = userData;
        this.room = null;
        this.socket = socket;
        this.gameData = {};
    }

    setRoom(room: Room) {
        this.room = room;
    }

    getName() {
        return this.userData.firstName;
    }

    isHosting() {
        return this.userData.isHost || false;
    }

    set<T>( key: any, value: any ) {
        this.gameData[ key ] = value as T;
        this.room.setState( this.room.getState() );
    }

    clearGameData() {
        this.gameData = {};
    }

    get<T>( key: any ) {
        return this.gameData[ key ] as T;
    }

    getAvatar() {
        return this.userData.imageUrl;
    }

    getRoom(): Room | null {
        return this.room;
    }

    getSocket(): PlayerSocket {
        return this.socket;
    }
}

export default Player;