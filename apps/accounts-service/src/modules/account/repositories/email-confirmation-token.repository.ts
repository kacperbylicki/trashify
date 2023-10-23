import dayjs from 'dayjs';
import { EmailConfirmationToken } from '../entities';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

interface SavePayload {
  accountUuid: string;
  token: string;
}

@Injectable()
export class EmailConfirmationTokenRepository {
  public constructor(
    @InjectModel(EmailConfirmationToken.name)
    private readonly emailConfirmationTokenModel: Model<EmailConfirmationToken>,
  ) {}

  public async findByToken(token: string): Promise<EmailConfirmationToken | null> {
    const entity = await this.emailConfirmationTokenModel
      .findOne({
        token,
      })
      .lean();

    if (!entity) {
      return null;
    }

    return entity;
  }

  public async save(payload: SavePayload): Promise<void> {
    const { accountUuid, token } = payload;

    const existsForAccount = await this.emailConfirmationTokenModel.findOne({
      accountUuid,
    });

    if (existsForAccount) {
      await this.emailConfirmationTokenModel
        .updateOne(
          {
            accountUuid,
          },
          {
            token,
          },
        )
        .lean();

      return;
    }

    await this.emailConfirmationTokenModel.create({
      accountUuid,
      token,
      createdAt: dayjs().unix(),
    });
  }

  public async delete(token: string): Promise<void> {
    await this.emailConfirmationTokenModel.deleteOne({
      token,
    });
  }
}
