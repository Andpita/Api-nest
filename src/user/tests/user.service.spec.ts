import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userMock } from '../mocks/user.mock';
import { createUserMock } from '../mocks/createUser.mock';
import { UserType } from '../enum/user-type.enum';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userMock),
            save: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  //Service e Repository
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  //FindUserByEmail
  it('should return in findUserByEmail', async () => {
    const user = await service.findUserByEmail(userMock.email);

    expect(user).toEqual(userMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findUserByEmail(userMock.email)).rejects.toThrowError();
  });

  it('should return error in findUserByEmail (Erro DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findUserByEmail(userMock.email)).rejects.toThrowError();
  });

  //FindUserById
  it('should return in findUserById', async () => {
    const user = await service.findUserById(userMock.id);

    expect(user).toEqual(userMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(service.findUserById(userMock.id)).rejects.toThrowError();
  });

  it('should return error in findUserById (Erro DB)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.findUserById(userMock.id)).rejects.toThrowError();
  });

  //getUserByIdUsingRelations
  it('should return in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userMock.id);

    expect(user).toEqual(userMock);
  });

  //Create User
  it('should return error if user exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrowError();
  });

  it('should return new user if user not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    const user = await service.createUser(createUserMock);

    expect(user).toEqual(userMock);
  });
});
