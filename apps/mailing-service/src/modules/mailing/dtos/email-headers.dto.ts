import { IsRecord } from '../../../common/decorators/is-record.decorator';

export class EmailHeadersDto {
  /**
   * # Not to be used
   * This is just a way of expressing a Record for Class Validator :)
   */
  @IsRecord()
  anyElement!: string;

  [key: string]: string;
}
