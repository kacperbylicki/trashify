import dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ResetPasswordToken } from '../entities';

interface SavePayload {
  accountUuid: string;
  token: string;
}

@Injectable()
export class ResetPasswordTokenRepository {
  public constructor(
    @InjectModel(ResetPasswordToken.name)
    private readonly resetPasswordTokenModel: Model<ResetPasswordToken>,
  ) {}

  public async findByToken(token: string): Promise<ResetPasswordToken | null> {
    const resetPasswordToken = await this.resetPasswordTokenModel
      .findOne({
        token,
      })
      .lean();

    if (!resetPasswordToken) {
      return null;
    }

    return resetPasswordToken;
  }

  public async save(payload: SavePayload): Promise<void> {
    const { accountUuid, token } = payload;

    const existsForAccount = await this.resetPasswordTokenModel.findOne({
      accountUuid,
    });

    if (existsForAccount) {
      await this.resetPasswordTokenModel
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

    await this.resetPasswordTokenModel.create({
      accountUuid,
      token,
      createdAt: dayjs().unix(),
    });
  }

  public async delete(accountUuid: string): Promise<void> {
    await this.resetPasswordTokenModel.deleteOne({
      accountUuid,
    });
  }
}
