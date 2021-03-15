import { Socket } from 'socket.io';
import Player from "../../../cambox-api/src/types/classes/Player";

export type PlayerSocket = Socket & {
    instance: Player;
}