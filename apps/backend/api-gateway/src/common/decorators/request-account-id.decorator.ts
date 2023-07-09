import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RequestAccountId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const { accountId } = ctx.switchToHttp().getRequest()?.user;

    if (!accountId) {
      throw new TypeError(
        `Current user id could not be found on request object.`,
      );
    }

    return accountId;
  },
);
