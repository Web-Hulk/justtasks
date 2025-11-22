import type { StoryObj } from '@storybook/react-vite';
import { VerifyEmailStatus } from './VerifyEmailStatus';

const meta = {
  title: 'Verify Email Status',
  component: VerifyEmailStatus,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    status: 'pending',
    email: 'john.doe@gmail.com',
    isResendButtonDisabled: false,
    timer: 60,
    onClick: () => {}
  }
};
