import { IsRecord } from '../../../common/validators/is-record.validator';

export class EmailHeadersDto {
  @IsRecord()
  el!: string;

  [key: string]: string;
}
