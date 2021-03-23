import { ApiResponse } from '@cambox/common/types/models/api';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Token } from 'src/decorators/token.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/user.service';
import { AuthToken } from 'src/types/interfaces/AuthToken';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('key')
    @UseGuards( AuthGuard )
    async getDevKey( @Token() userToken: AuthToken ): Promise<ApiResponse<{ key: string }>> {
        const user = await this.userService.getUser( userToken.platform, userToken.id );

        if( !user ) return {
            ok: false,
            error: 'User does not exist'
        };
        
        return {
            ok: true,
            data: {
                key: user.developerKey
            }
        }
    }
}
