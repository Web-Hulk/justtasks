type VerifyEmailStatus = 'pending' | 'success' | 'failure';

export type VerifyEmailStatusProps = {
  status: VerifyEmailStatus;
  email: string;
  isResendButtonDisabled: boolean;
  timer?: number;
  onClick: () => void;
};

export type VerifyEmailStatusContentMap = {
  [key in 'pending' | 'success' | 'failure']: {
    title: string;
    content: (email: string) => React.ReactNode;
    buttonTitle: string;
  };
};
