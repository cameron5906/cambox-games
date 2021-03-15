import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { GamesModule } from './games/games.module';
import { PlayerGateway } from './gateways/player.gateway';
import { GameService } from './services/game.service';
import { SecurityService } from './services/security.service';
import { SlackService } from './services/slack.service';

@Module({
  imports: [
    GamesModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    PlayerGateway,
    GameService,
    SecurityService,
    SlackService
  ],
})
export class AppModule {}
