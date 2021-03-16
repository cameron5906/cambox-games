import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { GamesModule } from './games/games.module';
import { PlayerGateway } from './gateways/player.gateway';
import { GameService } from './services/game.service';
import { SecurityService } from './services/security.service';
import { SlackService } from './services/slack.service';
import { GamesController } from './controllers/games.controller';
import { ZipService } from './services/zip.service';
import { UploadService } from './services/upload.service';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';

@Module({
  imports: [
    GamesModule,
    MulterModule
  ],
  controllers: [
    AppController,
    GamesController
  ],
  providers: [
    PlayerGateway,
    GameService,
    ZipService,
    UploadService,
    SecurityService,
    SlackService
  ],
})
export class AppModule {}