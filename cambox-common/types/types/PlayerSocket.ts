import { Socket } from 'socket.io';
import Player from "../classes/Player";

export type PlayerSocket = Socket & {
    instance: Player;
}