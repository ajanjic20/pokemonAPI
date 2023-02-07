import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IExtendedRequest } from './auth.types';

export const AuthenticatedUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IExtendedRequest>();
    return request.user;
  },
);
