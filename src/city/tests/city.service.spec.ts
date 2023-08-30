import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityService } from '../city.service';
import { CityEntity } from '../entities/city.entity';
import { CacheService } from '../../cache/cache.service';
import { cityMock } from '../mocks/city.mock';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<CityEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCache: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cityMock),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get(getRepositoryToken(CityEntity));
  });

  //Service e Repository
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityRepository).toBeDefined();
  });

  it('should return city by id', async () => {
    const city = await service.findCityById(cityMock.id);

    expect(city).toEqual(cityMock);
  });

  it('should return city by id', async () => {
    jest.spyOn(cityRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findCityById(cityMock.id)).rejects.toThrowError();
  });

  it('should return cities in getAllCitiesByStateId', async () => {
    const cities = await service.getAllCitiesByStateId(cityMock.id);

    expect(cities).toEqual([cityMock]);
  });
});
