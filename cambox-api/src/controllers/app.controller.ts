import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Token } from 'src/decorators/token.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { GameService } from 'src/services/game.service';
import { SecurityService } from 'src/services/security.service';
import { SlackService } from 'src/services/slack.service';
import { AuthToken } from 'src/types/interfaces/AuthToken';
import { SlackUser } from 'src/types/interfaces/SlackUser';
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

@Controller()
export class AppController {
  constructor(
    private readonly gameService: GameService,
    private readonly slackService: SlackService,
    private readonly securityService: SecurityService
  ) {}

  @Post('authenticate')
  async authenticate( 
    @Body() { email }: AuthenticationPayload 
  ): Promise<ApiResponse<AuthenticateResponseData>> {
    try {
      const { firstName, lastName, imageUrl }: SlackUser = await this.slackService.getUserProfileFromEmail( email );
      const token = this.securityService.generateToken({
        firstName,
        lastName,
        imageUrl
      });

      return { 
        ok: true, 
        data: { 
          token, 
          firstName, 
          lastName, 
          imageUrl 
        } 
      };
    } catch( ex ) {
      return { 
        ok: false, 
        error: 'Failed to authenticate your Slack profile' 
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
      data: [
        {
          id: 'madlibs',
          name: 'Mad Libs',
          description: 'Who can come up with the funniest story?',
          iconUrl: 'https://www.perkinselearning.org/sites/elearning.perkinsdev1.org/files/styles/node_highlighted_image/public/Mad_Libs_logo.png?itok=w4w5j4AS'
        },
        {
          id: 'splittheroom',
          name: 'Split the Room',
          description: 'In this surreal game of what-ifs, players are given a weird hypothetical situation that’s missing one key detail.',
          iconUrl: 'https://static.wikia.nocookie.net/jackboxgames/images/1/18/Split-the-room-logo.png/revision/latest?cb=20190403125705'
        }
      ]
    }
  }
}
