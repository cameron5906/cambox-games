import { GameDetails } from '@cambox/common';
import { AppState } from './AppState';
import { GameState } from "./GameState";
import { ProfileState } from "./ProfileState";
import { RoomState } from "./RoomState";
import { UiState } from "./UiState";

export interface RootState {
    app: AppState;
    game: GameState;
    games: GameDetails[];
    profile: ProfileState;
    room: RoomState;
    ui: UiState;
}