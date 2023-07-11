import { EmailClient } from '@azure/communication-email';

export type Poller = Awaited<ReturnType<EmailClient['beginSend']>>;
