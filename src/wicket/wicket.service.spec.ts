import { Test, TestingModule } from '@nestjs/testing';
import { WicketService } from './wicket.service';

describe('WicketService', () => {
  let service: WicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WicketService],
    }).compile();

    service = module.get<WicketService>(WicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
