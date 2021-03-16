import { Module } from '@nestjs/common';
import { MadlibsGame } from './madlibs-1/madlibs.game';
import { SplitTheRoomGame } from './split-the-room/split-the-room.game';

@Module({
  providers: [
    MadlibsGame,
    SplitTheRoomGame
  ],
  exports: [
    MadlibsGame,
    SplitTheRoomGame
  ]
})
export class GamesModule {}
