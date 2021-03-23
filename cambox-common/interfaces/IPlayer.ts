import { PlayerSocket } from "../types/PlayerSocket";
import { IRoom } from "./IRoom";

export interface IPlayer {
    setRoom: (room: IRoom) => void;
    getName: () => string;
    isHosting: () => boolean;
    set<T>( key: any, value: any ): void;
    clearGameData: () => void;
    get<T>( key: any ): T;
    getAvatar: () => string;
    getRoom: () => IRoom | null;
    getSocket: () => PlayerSocket;
}