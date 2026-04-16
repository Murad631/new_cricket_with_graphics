import { Test, TestingModule } from '@nestjs/testing';
import { OversummaryService } from './oversummary.service';

describe('OversummaryService', () => {
  let service: OversummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OversummaryService],
    }).compile();

    service = module.get<OversummaryService>(OversummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
