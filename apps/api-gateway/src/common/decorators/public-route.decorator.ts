import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = `PUBLIC_ROUTE_KEY`;

export const Public = (): CustomDecorator => SetMetadata(PUBLIC_KEY, true);
