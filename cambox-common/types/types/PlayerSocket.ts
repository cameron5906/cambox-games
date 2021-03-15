import { IPlayer } from '../interfaces/api/IPlayer';

export type PlayerSocket = any & {
    instance: IPlayer;
}