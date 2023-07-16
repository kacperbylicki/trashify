import { Exclude } from 'class-transformer';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Account {
  @Prop({ type: String, unique: true })
  uuid!: string;

  @Prop({ type: String, unique: true })
  email!: string;

  @Prop({ type: String })
  username!: string;

  @Prop({ type: String })
  @Exclude()
  password!: string;

  @Prop({ type: String, optional: true })
  refreshToken?: string | null;

  @Prop({ type: Number })
  createdAt!: number;

  @Prop({ type: Number })
  updatedAt!: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
export const AccountModelDefinition: ModelDefinition = {
  name: Account.name,
  schema: AccountSchema,
};
