import { Account } from '../../src/modules/account';
import { UserDataGenerator, UtilityGenerator } from '@trashify/testing';

export interface CreatePayload {
  email?: string;
  emailConfirmed?: boolean;
  password?: string;
  username?: string;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AccountTestFactory {
  public create(payload: CreatePayload): Account {
    const {
      updatedAt = UtilityGenerator.pastDate(),
      createdAt = UtilityGenerator.pastDate(),
      email = UserDataGenerator.email(),
      password = UserDataGenerator.password(10),
      username = UserDataGenerator.username(),
      uuid = UserDataGenerator.uuid(),
      emailConfirmed = true,
    } = payload;

    return {
      createdAt: createdAt.getTime(),
      email,
      emailConfirmed,
      password,
      updatedAt: updatedAt.getTime(),
      username,
      uuid,
    };
  }
}
