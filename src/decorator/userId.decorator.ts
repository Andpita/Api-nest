import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { authPayload } from '../utils/converter-64';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const { authorization } = context.switchToHttp().getRequest().headers;

    const auth = authorization.split(' ');

    const loginPayload = authPayload(auth[1]);

    return loginPayload?.id;
  },
);
