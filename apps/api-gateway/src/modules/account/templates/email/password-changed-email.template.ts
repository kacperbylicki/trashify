import { SendEmailRequest } from '@trashify/transport';

interface GetPasswordChangedEmailTemplatePayload {
  username: string;
  email: string;
}

export const getPasswordChangedEmailTemplate = (
  payload: GetPasswordChangedEmailTemplatePayload,
): SendEmailRequest => {
  const { email, username } = payload;

  return {
    attachments: [],
    content: {
      subject: 'DO NOT REPLY Trashify - Password successfully changed.',
      html: `
        <p>Hello ${username},</p>

        <p>Your password has been successfully changed. If you did not request the password change, please reach out to us. </p>

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
