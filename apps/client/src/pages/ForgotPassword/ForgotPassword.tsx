import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router';
import * as z from 'zod';

const BASE_URL = 'http://127.0.0.1:3000';

const emailSchema = z.object({
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase())
});

type Schema = z.infer<typeof emailSchema>;

// Add view when Send Email button clicked
export const ForgotPassword = () => {
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(emailSchema)
  });

  // Add react-query to send request to forgot-password endpoint - POST request, so use useMutation
  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: (email: Schema) => {
      return axios.post(`${BASE_URL}/forgot-password`, email);
    }
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log(data);
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full border-2 border-black rounded-lg p-4 bg-white shadow">
        {isSuccess ? (
          <>
            <h1 className="text-center text-2xl">
              <strong>Check your email</strong>
            </h1>

            {/* Consider if you should return email from DB response */}
            <p className="text-center">
              {/* We sent you a password reset link to <strong>{email}</strong>. */}
              We sent you a password reset link to ...
            </p>

            <p className="text-center">
              {/* Did not receive the email? <button onClick={() => console.log('Sent email')}>Click to resend</button> */}
              Did not receive the email? <button onClick={handleSubmit(onSubmit)}>Click to resend</button>
            </p>

            <p className="text-center">
              <Link to={'/login'}>Back to login</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl">
              <strong>Forgot password</strong>
            </h1>

            <p className="text-center">No worries, we will send you reset instructions.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  {...register('email')}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border-2 border-black p-2 rounded-md my-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-gray-300 p-2 font-bold cursor-pointer"
                disabled={isPending}
              >
                Send email
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
