import { IPlayer } from "../interfaces";

export type PlayerSocket = any & {
    instance: IPlayer;
}