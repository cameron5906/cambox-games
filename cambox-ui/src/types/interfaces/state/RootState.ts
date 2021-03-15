import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { GameState } from "./GameState";
import { ProfileState } from "./ProfileState";
import { RoomState } from "./RoomState";
import { UiState } from "./UiState";

export interface RootState {
    game: GameState;
    games: GameDetails[];
    profile: ProfileState;
    room: RoomState;
    ui: UiState;
}