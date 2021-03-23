import { ApiResponse } from '@cambox/common/types/models/api';
import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Token } from 'src/decorators/token.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { GamesService } from 'src/services/games.service';
import { SecurityService } from 'src/services/security.service';
import { UserService } from 'src/services/user.service';
import { AuthToken } from 'src/types/interfaces/AuthToken';

@Controller('developer')
export class DeveloperController {
    constructor(
        private readonly securityService: SecurityService,
        private readonly gamesService: GamesService,
        private readonly userService: UserService
    ) {}

    @Get('token')
    async getDeveloperToken( @Query('key') key: string ): Promise<ApiResponse<{ token: string}>> {
        const user = await this.userService.getUserByDevKey( key );

        if( !user ) return {
            ok: false,
            error: 'Invalid developer key'
        };

        const token = this.securityService.generateToken({
            id: user.id
        });

        return {
            ok: true,
            data: {
                token
            }
        };
    }

    @Get('games')
    @UseGuards( AuthGuard )
    async getGames( @Token() userData: AuthToken ): Promise<ApiResponse<{ games: GameDetails[] }>> {
        const user = await this.userService.getUser( userData.platform, userData.id );
        const games = await this.gamesService.getUserDevelopedGames( user.id );

        return {
            ok: true,
            data: {
                games
            }
        }
    }
}
