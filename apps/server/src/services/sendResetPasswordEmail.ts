import { TRANSPORTER } from './transporter';

interface MailTemplateOptions {
  from: string;
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

export const sendResetPasswordEmail = (resetPasswordToken: string) => {
  console.log('sendResetPasswordEmail');

  return TRANSPORTER.sendMail({
    // Set business email address
    from: 'welcome@justtasks.com',
    // Change 'test@user.com' to email before going to production
    to: 'test@user.com',
    subject: 'Reset your JUSTTASKS password',
    template: 'resetPassword',
    // Keep hardcoded customer email for development purpose
    // Change 'test@user.com' to email before going to production
    context: {
      resetPasswordLink: `http://localhost:5173/reset-password?token=${resetPasswordToken}`
    }
  } as MailTemplateOptions);
};
