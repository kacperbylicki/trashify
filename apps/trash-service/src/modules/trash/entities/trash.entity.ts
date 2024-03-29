import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TrashTagsEnum } from '../enums/trash-tags.enum';

@Schema()
export class TrashRawEntity {
  @Prop({ type: String, unique: true })
  uuid!: string;

  @Prop({ type: String, required: true })
  tag!: TrashTagsEnum;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  geolocation!: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ type: Number, required: true })
  createdAt!: number;

  @Prop({ type: Number, required: true })
  updatedAt!: number;
}

export const TrashSchema = SchemaFactory.createForClass(TrashRawEntity).index({
  geolocation: '2dsphere',
});

export const TrashModelDefinition: ModelDefinition = {
  name: TrashRawEntity.name,
  schema: TrashSchema,
};
