import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ForgotPassword } from './ForgotPassword';

const queryClient = new QueryClient();

const meta: Meta<typeof ForgotPassword> = {
  title: 'Forgot Password',
  component: ForgotPassword,
  decorators: [(Story) => <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>],
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Forgot Password'
  }
};
