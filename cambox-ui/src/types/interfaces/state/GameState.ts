import { GameDetails } from "@cambox/common/types/models/GameDetails";

export interface GameState {
    details: GameDetails | null;
}