import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EmailConfirmationToken {
  @Prop({ type: String })
  token!: string;

  @Prop({ type: String })
  accountUuid!: string;

  @Prop({ type: Number, expires: 7 * 24 * 60 * 60 })
  createdAt!: number;
}

export const EmailConfirmationTokenSchema = SchemaFactory.createForClass(EmailConfirmationToken);

export const EmailConfirmationTokenModelDefinition: ModelDefinition = {
  name: EmailConfirmationToken.name,
  schema: EmailConfirmationTokenSchema,
};
