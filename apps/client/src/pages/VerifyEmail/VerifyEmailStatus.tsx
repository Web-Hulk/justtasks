import CircularProgress from '@mui/material/CircularProgress';
import type { VerifyEmailStatusContentMap, VerifyEmailStatusProps } from './types';

const verifyEmailStatusContent: VerifyEmailStatusContentMap = {
  pending: {
    title: 'Verify your email',
    content: (email: string) => (
      <>
        We&apos;ve sent an email to <strong>{email}</strong>. Continue account creation using the link via email.
      </>
    ),
    buttonTitle: 'Resend Email'
  },
  success: {
    title: 'Account verified',
    content: (email: string) => (
      <>
        Congratulations! Your email account <strong>{email}</strong> has been verified.
      </>
    ),
    buttonTitle: 'Continue to your account'
  },
  failure: {
    title: 'Email verification link expired',
    content: () => <>Looks like the email verification link has expired. No worries we can send the link again.</>,
    buttonTitle: 'Resend verification link'
  }
};

export const VerifyEmailStatus = ({
  status,
  email,
  isResendButtonDisabled,
  timer,
  onClick
}: VerifyEmailStatusProps) => {
  const { title, content, buttonTitle } = verifyEmailStatusContent[status];

  return (
    <>
      <h1 className="text-center font-bold text-2xl">{title}</h1>

      <p className="text-center my-2">{content(email)}</p>

      <button
        type="button"
        className={`w-full relative rounded-md p-2 my-2 font-bold cursor-pointer ${
          isResendButtonDisabled ? 'bg-gray-300 text-black' : 'bg-[#3ca23c] text-white'
        }`}
        disabled={isResendButtonDisabled}
        onClick={onClick}
      >
        <span>{buttonTitle}</span>

        {isResendButtonDisabled ? (
          <div className="absolute right-0 top-0">
            <CircularProgress className="absolute right-2.5 w-5 h-5" />
            <span className="absolute right-5 top-1.5">{timer}</span>
          </div>
        ) : null}
      </button>
    </>
  );
};
