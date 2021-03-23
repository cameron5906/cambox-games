import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { PlayerGateway } from './gateways/player.gateway';
import { GameService } from './services/game.service';
import { SecurityService } from './services/security.service';
import { GamesController } from './controllers/games.controller';
import { ZipService } from './services/zip.service';
import { UploadService } from './services/upload.service';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { AuthenticationService } from './services/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { User } from './data/entities/User.entity';
import { Game } from './data/entities/Game.entity';
import { GameCollaborator } from './data/entities/GameCollaborator';
import { UserController } from './controllers/user.controller';
import { DeveloperController } from './controllers/developer.controller';
import { GamesService } from './services/games.service';

@Module({
  imports: [
    MulterModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'postgres',
      entities: [ User, Game, GameCollaborator ]
    }),
    TypeOrmModule.forFeature([ User, Game, GameCollaborator ])
  ],
  controllers: [
    AppController,
    GamesController,
    UserController,
    DeveloperController
  ],
  providers: [
    AuthenticationService,
    GamesService,
    PlayerGateway,
    GameService,
    ZipService,
    UploadService,
    UserService,
    SecurityService
  ],
})
export class AppModule {}