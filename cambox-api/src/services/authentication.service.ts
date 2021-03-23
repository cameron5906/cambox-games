import { SocialNetwork } from '@cambox/common/dist/types/types';
import { Injectable } from '@nestjs/common';
import got from 'got/dist/source';
import { UserModel } from 'src/data/models/User.model';
import { SecurityService } from './security.service';

@Injectable()
export class AuthenticationService {
    constructor(
        private securityService: SecurityService
    ) {}
    
    async authenticate( platform: SocialNetwork, accessToken: string ): Promise<[UserModel, string]> {
        switch( platform ) {
            case 'facebook':
                return await this.authenticateFacebook( accessToken );
            case 'twitch':
                return await this.authenticateTwitch( accessToken );
        }
    }

    private async authenticateFacebook( accessToken: string ): Promise<[UserModel, string]> {
        const response = await got.get( `https://graph.facebook.com/me?fields=first_name,email,picture&access_token=${accessToken}`, { responseType: 'json' } );
        if( response.statusCode !== 200 ) throw 'Authentication failed';

        const { first_name: name, email, picture: { data: { url: imageUrl } }, id }: any = response.body;
        const token = this.securityService.generateToken({
            platform: 'facebook',
            name,
            imageUrl,
            id
        });

        return [
            {
                platform: 'facebook',
                name,
                email,
                userId: id,
                avatarUrl: imageUrl
            },
            token
        ]
    }

    private async authenticateTwitch( accessToken: string ): Promise<[UserModel, string]> {
        console.log(accessToken);
        const response = await got.get( 'https://api.twitch.tv/helix/users', {
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': process.env.CAMBOX_TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'json'
        } );
        
        if( response.statusCode !== 200 ) throw 'Authentication failed';
        if( !(response.body as any).data || (response.body as any).data.length === 0 ) throw 'Authentication failed. User not found';

        const { display_name: name, email, profile_image_url: imageUrl, id }: any = (response.body as any).data[0];
        const token = this.securityService.generateToken({
            platform: 'twitch',
            name,
            imageUrl,
            id
        });

        return [
            {
                platform: 'twitch',
                name,
                email,
                userId: id,
                avatarUrl: imageUrl
            },
            token
        ]
    }
}
