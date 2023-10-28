import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ResetPasswordToken {
  @Prop({ type: String })
  token!: string;

  @Prop({ type: String })
  accountUuid!: string;

  @Prop({ type: Number, expires: 8 * 60 * 60 })
  createdAt!: number;
}

export const ResetPasswordTokenSchema = SchemaFactory.createForClass(ResetPasswordToken);

export const ResetPasswordTokenModelDefinition: ModelDefinition = {
  name: ResetPasswordToken.name,
  schema: ResetPasswordTokenSchema,
};
