import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Token } from 'src/decorators/token.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { GameService } from 'src/services/game.service';
import { SecurityService } from 'src/services/security.service';
import { AuthToken } from 'src/types/interfaces/AuthToken';
import { GameDetails } from '@cambox/common/types/models/GameDetails';
import { 
  ApiResponse, 
  AuthenticateResponseData, 
  AuthenticationPayload, 
  CreateRoomResponseData, 
  JoinResponseData, 
  JoinRoomPayload, 
  StartGamePayload
} from '@cambox/common/types/models/api';
import { AuthenticationService } from 'src/services/authentication.service';
import { UserService } from 'src/services/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly gameService: GameService,
    private readonly securityService: SecurityService,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  @Post('authenticate')
  async authenticate( 
    @Body() { platform, accessToken }: AuthenticationPayload
  ): Promise<ApiResponse<AuthenticateResponseData>> {
    try {
      const [userInfo, token ] = await this.authenticationService.authenticate( platform, accessToken );

      if(!(await this.userService.userExists( platform, userInfo.userId ) ) ) {
        console.log('Creating user');
        await this.userService.createUser( platform, userInfo.email, userInfo.userId, userInfo.name, userInfo.avatarUrl );
      } else {
        console.log('User exists');
      }

      return { 
        ok: true, 
        data: { 
          token
        } 
      };
    } catch( ex ) {
      console.log( ex );
      return { 
        ok: false, 
        error: typeof( ex ) === 'object' ? 'Failed to authenticate' : ex 
      };
    }
  }

  @Post('join')
  @UseGuards( AuthGuard )
  async joinRoom( 
    @Body() { roomCode }: JoinRoomPayload, 
    @Token() userToken: AuthToken | null 
  ): Promise<ApiResponse<JoinResponseData>> {
    if( this.gameService.isRoomAvailable( roomCode ) ) {
      const token = this.securityService.generateToken({ 
        ...userToken, 
        roomCode, 
        isHost: false 
      });

      return { 
        ok: true, 
        data: { 
          token 
        } 
      };
    } else {
      return { 
        ok: false, 
        error: 'The room is either non-existent or already in progress' 
      };
    }
  }

  @Post('create')
  @UseGuards( AuthGuard )
  async createRoom( 
    @Token() userToken: AuthToken 
  ): Promise<ApiResponse<CreateRoomResponseData>> {
    const roomCode = await this.gameService.createRoom();
    const token = this.securityService.generateToken({
      ...userToken,
      roomCode,
      isHost: true
    });
    
    return {
      ok: true,
      data: {
        token,
        roomCode
      }
    }
  }
  
  @Post('ready')
  @UseGuards( AuthGuard )
  async roomReady(
    @Token() userToken: AuthToken
  ): Promise<ApiResponse<any>> {
    const { roomCode, isHost } = userToken;
    
    if( !isHost ) return {
      ok: false,
      error: 'You are not the host'
    }

    this.gameService.roomReady( roomCode );

    return {
      ok: true
    }
  }

  @Post('start')
  @UseGuards( AuthGuard )
  async startGame(
    @Body() { gameId }: StartGamePayload,
    @Token() userToken: AuthToken
  ): Promise<ApiResponse<any>> {
    const { roomCode, isHost } = userToken;

    if( !isHost ) return {
      ok: false,
      error: 'You are not the host'
    }

    this.gameService.startGame( roomCode, gameId );

    return {
      ok: true
    }
  }

  @Post('stop')
  @UseGuards( AuthGuard )
  async stopGame(
    @Token() userToken: AuthToken
  ): Promise<ApiResponse<any>> {
    const { roomCode, isHost } = userToken;

    if( !isHost ) return {
      ok: false,
      error: 'You are not the host'
    }

    this.gameService.stopGame( roomCode );

    return {
      ok: true
    }
  }

  @Get('games')
  @UseGuards( AuthGuard )
  async getGames(
    @Token() userToken: AuthToken
  ): Promise<ApiResponse<GameDetails[]>> {
    return {
      ok: true,
      data: this.gameService.getGameList()
    }
  }
}
