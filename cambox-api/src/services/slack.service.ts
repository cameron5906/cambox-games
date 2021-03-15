import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SlackUser } from 'src/types/interfaces/SlackUser';

const SLACK_TOKEN = process.env.CAMBOX_GAMES_SLACK_TOKEN;

@Injectable()
export class SlackService {
    slack: WebClient;

    constructor() {
        this.slack = new WebClient( SLACK_TOKEN );
    }

    /**
     * Searches the Slack workspace for the intended profile information for the email specified
     * @param email The RSI email to search for
     */
    async getUserProfileFromEmail( email: string ): Promise<SlackUser> {
        const { ok, user }: { ok: boolean, user: any } = await this.slack.users.lookupByEmail({
            email
        }) as any;
        if( !ok || !user ) throw 'User not found';

        return {
            firstName: user.real_name.split(' ')[0],
            lastName: user.real_name.split(' ')[1],
            imageUrl: user.profile.image_192
        };
    }
}
