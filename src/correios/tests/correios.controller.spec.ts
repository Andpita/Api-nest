import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosController } from '../correios.controller';
import { CorreiosService } from '../correios.service';

describe('CorreiosController', () => {
  let controller: CorreiosController;
  let correiosService: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CorreiosService,
          useValue: {
            getFrete: jest.fn().mockResolvedValue(0),
            findCep: jest.fn().mockResolvedValue(0),
          },
        },
      ],
      controllers: [CorreiosController],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
    correiosService = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(correiosService).toBeDefined();
  });
});
