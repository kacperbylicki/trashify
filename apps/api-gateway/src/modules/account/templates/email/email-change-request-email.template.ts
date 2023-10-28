import { SendEmailRequest } from '@trashify/transport';

interface GetEmailChangeRequestEmailTemplatePayload {
  username: string;
  email: string;
  url: string;
}

export const getEmailChangeRequestEmailTemplate = (
  payload: GetEmailChangeRequestEmailTemplatePayload,
): SendEmailRequest => {
  const { email, username, url } = payload;

  return {
    attachments: [],
    content: {
      subject: 'DO NOT REPLY Trashify - Password successfully changed.',
      html: `
        <p>Hello ${username},</p>

        <p>You have requested an email change. Please confirm it using the following link: <a href="${url}">click-me</a> </p>

        <p>Sincerely, Trashify Team</p>
      `,
    },
    disableUserEngagementTracking: true,
    recipients: {
      to: [
        {
          address: email,
        },
      ],
      bcc: [],
      cc: [],
    },
  };
};
