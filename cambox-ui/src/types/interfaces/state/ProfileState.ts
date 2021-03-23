import { GameDetails } from "@cambox/common";

export interface ProfileState {
    authToken: string | null;
    name: string;
    imageUrl: string;
    developerKey: string;
    games: GameDetails[];
}