import { SocialNetwork } from "@cambox/common/dist/types";

export interface AuthToken {
    platform: SocialNetwork;
    id: string;
    name: string;
    imageUrl: string;
    roomCode?: string;
    isHost?: boolean;
}