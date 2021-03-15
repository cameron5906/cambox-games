import { Test, TestingModule } from '@nestjs/testing';
import { SplitTheRoomGame } from './split-the-room.game';

describe('SplitTheRoomService', () => {
  let service: SplitTheRoomGame;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SplitTheRoomGame],
    }).compile();

    service = module.get<SplitTheRoomGame>(SplitTheRoomGame);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
