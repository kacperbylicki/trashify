import { SendEmailRequest } from '@trashify/transport';

interface GetRegistrationConfirmationEmailTemplatePayload {
  username: string;
  email: string;
  url: string;
}

export const getRegistrationConfirmationEmailTemplate = (
  payload: GetRegistrationConfirmationEmailTemplatePayload,
): SendEmailRequest => {
  const { email, url, username } = payload;

  return {
    attachments: [],
    content: {
      subject: 'DO NOT REPLY Trashify - Registration Confirmation.',
      html: `
            <h> Hello ${username}! </h>
            <p> Please click the following link to confirm your email address: <a href="${url}">click-me</a> </p>
            <p>Sincerely, Trashify Team</p>
          `,
    },
    disableUserEngagementTracking: true,
    recipients: {
      to: [
        {
          address: email,
          displayName: username,
        },
      ],
      bcc: [],
      cc: [],
    },
  };
};
