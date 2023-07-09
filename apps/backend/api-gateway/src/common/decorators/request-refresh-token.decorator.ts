import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RequestRefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const refreshToken = ctx.switchToHttp().getRequest()?.body?.refreshToken;

    if (!refreshToken) {
      throw new TypeError(
        `Refresh token could not be found on request object.`,
      );
    }

    return refreshToken;
  },
);
