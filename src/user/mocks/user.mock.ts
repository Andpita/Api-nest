import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userMock: UserEntity = {
  name: 'UserMock',
  email: 'mock@email.com',
  phone: '48999002020',
  password: '123456',
  cpf: '12312312300',
  createdAt: new Date(),
  updatedAt: new Date(),
  typeUser: UserType.User,
  id: 6212,
};
