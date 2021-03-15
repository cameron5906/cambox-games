import { Player } from "../room/Player";

export interface RoomState {
    roomCode: string | null;
    isHost: boolean;
    isReady: boolean;
    players: Player[];
}