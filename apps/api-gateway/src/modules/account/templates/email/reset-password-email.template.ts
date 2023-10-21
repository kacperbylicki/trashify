import { SendEmailRequest } from '@trashify/transport';

interface GetResetPasswordEmailTemplatePayload {
  username: string;
  url: string;
  email: string;
}

export const getResetPasswordEmailTemplate = (
  payload: GetResetPasswordEmailTemplatePayload,
): SendEmailRequest => {
  const { email, url, username } = payload;

  return {
    attachments: [],
    content: {
      subject: 'DO NOT REPLY Trashify - Change password request.',
      html: `
        <h> Hello ${username}! </h>
        <p> Here is your reset password link: <a href="${url}">click-me</a> </p>
        <p> If you did not request a password reset, please read about keeping yourself secure online :) </p>
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
