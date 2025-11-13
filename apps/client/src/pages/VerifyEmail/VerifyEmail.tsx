import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { VerifyEmailStatus } from './VerifyEmailStatus';

const BASE_URL = 'http://127.0.0.1:3000';

export const VerifyEmail = () => {
  const [email, setEmail] = useState<string>('test@user.com');
  const [status, setStatus] = useState<'pending' | 'success' | 'failure'>('pending');
  const [isResendButtonDisabled, setIsResendButtonDisabled] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(5);
  const intervalRef = useRef(60);
  const navigate = useNavigate();

  // Add info that email is missed and add input to type email and send activation link to the email
  useEffect(() => {
    const getUserEmail = localStorage.getItem('email') || '';

    setEmail(getUserEmail);
  });

  useEffect(() => {
    if (timer < 0) {
      clearInterval(intervalRef.current);
      setIsResendButtonDisabled(false);
      setTimer(60);
    }
  }, [timer]);

  const isActivated = useQuery({
    queryKey: ['activation-status', email],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/activation-status?email=${email}`);
      return response.data;
    },
    enabled: !!email,
    refetchInterval: 2000
  });

  useEffect(() => {
    if (!isActivated.data) return;

    const { isActivated: activated, activationExpires } = isActivated.data;

    if (activated === true) {
      setStatus('success');
      localStorage.removeItem('email');
    } else if (activationExpires && new Date() > new Date(activationExpires)) {
      setStatus('failure');
    } else {
      setStatus('pending');
    }
  }, [isActivated.data]);

  const resendMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`${BASE_URL}/generate-activation-link`, { email });
    }
  });

  const resendEmail = () => {
    setIsResendButtonDisabled(true);

    resendMutation.mutate();

    intervalRef.current = setInterval(() => {
      setTimer((prevSeconds) => prevSeconds - 1);
    }, 1000);
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  if (isActivated.isLoading) return <div>Loading...</div>;
  if (isActivated.isError) return <div>Error loading activation status.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full border-2 border-black rounded-lg p-4 bg-white shadow">
        <VerifyEmailStatus
          status={status}
          email={email}
          isResendButtonDisabled={isResendButtonDisabled}
          timer={timer}
          onClick={status === 'success' ? redirectToLogin : resendEmail}
        />
      </div>
    </div>
  );
};
