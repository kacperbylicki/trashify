import dayjs from 'dayjs';
import { Account } from '../entities';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class AccountRepository {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
  ) {}

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountModel.findOne({ email }).lean().exec();
  }

  async findById(uuid: string): Promise<Account | null> {
    return this.accountModel.findOne({ uuid }).lean().exec();
  }

  async exists(email: string): Promise<boolean> {
    const persistedAccount = await this.findByEmail(email);
    return !!persistedAccount;
  }

  async save(data: Account): Promise<void> {
    const accountModel = new this.accountModel(data);
    await accountModel.save();
  }

  async update(uuid: string, data: Partial<Account>): Promise<Account | null> {
    const updatedAccount = await this.accountModel
      .findOneAndUpdate(
        { uuid },
        { ...data, updatedAt: dayjs().unix() },
        { new: true },
      )
      .lean()
      .exec();

    return updatedAccount;
  }

  async delete(uuid: string): Promise<boolean> {
    const result = await this.accountModel.deleteOne({ uuid }).exec();
    return result.acknowledged ?? false;
  }
}
