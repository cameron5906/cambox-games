import { SocialNetwork } from "../../../types";

export interface AuthenticationPayload {
    platform: SocialNetwork;
    accessToken: string;
}