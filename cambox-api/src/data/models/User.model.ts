import { SocialNetwork } from "@cambox/common/dist/types/types";

export class UserModel {
    platform: SocialNetwork;
    userId: string;
    avatarUrl: string;
    name: string;
    email: string;
}