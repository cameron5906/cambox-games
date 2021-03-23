import { SocialNetwork } from "@cambox/common/types/types";

export interface AuthToken {
    platform: SocialNetwork;
    id: string;
    name: string;
    imageUrl: string;
    roomCode?: string;
    isHost?: boolean;
}