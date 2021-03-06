import { IPlayer, IRoom } from "@cambox/common/interfaces";
import { PlayerSocket } from "@cambox/common/types/PlayerSocket";
import { AuthToken } from "../interfaces/AuthToken";

class Player implements IPlayer {
    private userData: AuthToken;
    private room: IRoom;
    private gameData: any;
    private socket: PlayerSocket;

    constructor( socket: PlayerSocket, userData: AuthToken ) {
        this.userData = userData;
        this.room = null;
        this.socket = socket;
        this.gameData = {};
    }

    setRoom( room: IRoom ) {
        this.room = room;
    }

    getName() {
        return this.userData.name;
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

    getRoom(): IRoom | null {
        return this.room;
    }

    getSocket(): PlayerSocket {
        return this.socket;
    }
}

export default Player;