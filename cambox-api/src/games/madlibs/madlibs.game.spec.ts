import { Test, TestingModule } from '@nestjs/testing';
import { MadlibsGame } from './madlibs.game';

describe('MadlibsService', () => {
  let service: MadlibsGame;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MadlibsGame],
    }).compile();

    service = module.get<MadlibsGame>(MadlibsGame);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
