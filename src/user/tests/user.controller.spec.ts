import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userMock } from '../mocks/user.mock';
import { createUserMock } from '../mocks/createUser.mock';
import { updatePasswordMock } from '../mocks/updatePassword.mock';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            getAllUsers: jest.fn().mockResolvedValue([userMock]),
            createUser: jest.fn().mockResolvedValue(userMock),
            getUserById: jest.fn().mockResolvedValue(userMock),
            updateUserPassword: jest.fn().mockResolvedValue(userMock),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return all users (get)', async () => {
    const users = await controller.getAllUsers();

    expect(users).toEqual([
      {
        ...userMock,
        createdAt: undefined,
        updatedAt: undefined,
        password: undefined,
        typeUser: undefined,
      },
    ]);
  });

  it('should return new user (post)', async () => {
    const user = await controller.createUser(createUserMock);

    expect(user).toEqual(userMock);
  });

  it('should return update user password (patch)', async () => {
    const spyUpdate = jest.spyOn(userService, 'updateUserPassword');
    const user = await controller.updateUserPassword(
      userMock.id,
      updatePasswordMock,
    );

    expect(user).toEqual({
      ...userMock,
      createdAt: undefined,
      updatedAt: undefined,
      password: undefined,
      typeUser: undefined,
    });
    expect(spyUpdate.mock.calls.length).toEqual(1);
  });
});
