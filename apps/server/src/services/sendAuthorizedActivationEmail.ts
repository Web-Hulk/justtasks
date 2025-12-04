import { TRANSPORTER } from './transporter.js';

interface MailTemplateOptions {
  from: string;
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export const sendAuthorizedActivationEmail = (email: string, activationToken: string) => {
  return TRANSPORTER.sendMail({
    // Set business email address
    from: 'welcome@justtasks.com',
    // Change 'test@user.com' to email before going to production
    to: 'test@user.com',
    subject: 'Confirm your new email address for JUSTTASKS',
    template: 'verifyAuthorizedEmail',
    // Keep hardcoded customer email for development purpose
    // Change 'test@user.com' to email before going to production
    context: {
      email: 'test@user.com',
      activationLink: `http://127.0.0.1:3000/email/verify?token=${activationToken}`
    }
  } as MailTemplateOptions);
};
