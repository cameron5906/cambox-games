import { GameDetails } from "@cambox/common/types/models/GameDetails";

export interface ProfileState {
    authToken: string | null;
    name: string;
    imageUrl: string;
    developerKey: string;
    games: GameDetails[];
}