import { ReturnUserDTO } from 'src/user/dtos/returnUser.dto';

export class ReturnLoginDTO {
  user: ReturnUserDTO;
  accessToken: string;
}
