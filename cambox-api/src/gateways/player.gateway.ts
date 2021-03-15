import Player from 'src/types/classes/Player';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { GameService } from 'src/services/game.service';
import { SecurityService } from 'src/services/security.service';
import { AuthToken } from 'src/types/interfaces/AuthToken';
import { Command } from '@cambox/common/types/models/Command';
import { PlayerSocket } from '@cambox/common/types/types/PlayerSocket';

@WebSocketGateway({ transports: [ 'websocket', 'polling' ] } )
export class PlayerGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly gameService: GameService,
    private readonly securityService: SecurityService
  ) {}

  handleConnection( client: PlayerSocket ) {
    console.log( `New player connection from ${client.conn.remoteAddress}` );
  }

  handleDisconnect( client: PlayerSocket ) {
    console.log( `Client disconnected from ${client.conn.remoteAddress}` );
    if( !client.instance ) return;
    
    const room = client.instance.getRoom();
    if( !room ) return;

    room.onPlayerDisconnected( client.instance );
  }

  @SubscribeMessage('authenticate')
  handleAuthentication( 
    @ConnectedSocket() client: PlayerSocket, 
    @MessageBody() token: string 
  ): boolean {
    console.log( 'Authentication message received' );

    if( !this.securityService.validateToken( token ) ) return false; 
    
    const authData: AuthToken = this.securityService.getTokenData( token ); 
    if( typeof( authData.roomCode ) === 'undefined' ) return false;
    
    client.instance = new Player( client, this.securityService.getTokenData( token ) );

    return true;
  }

  @SubscribeMessage('command')
  handleCommand( 
    @ConnectedSocket() client: PlayerSocket, 
    @MessageBody() command: Command<any>
  ) {
    if( !client.instance ) return;
    
    const room = client.instance.getRoom();
    if( !room ) return;

    if( client.instance.isHosting() ) {
      room.onHostCommand( command );
    } else {
      room.onPlayerCommand( client.instance, command );
    }
  }

  @SubscribeMessage('join')
  handleJoin( 
    @ConnectedSocket() client: PlayerSocket, 
    @MessageBody() roomCode: string 
  ): boolean {
    console.log( `${client.instance.getName()} is joining room: ${roomCode}` );

    if( this.gameService.isRoomAvailable( roomCode ) ) {
      return this.gameService.addPlayerToRoom( roomCode, client.instance );
    } else {
      console.log( 'Room not available' );
      return false;
    }
  }
}
