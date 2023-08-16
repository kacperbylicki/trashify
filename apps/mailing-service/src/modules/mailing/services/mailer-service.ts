import { Email } from '@trashify/transport';

export interface MailerService {
  sendEmail(payload: Email): Promise<void>;
}
