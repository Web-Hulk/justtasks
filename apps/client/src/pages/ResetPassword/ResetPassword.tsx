import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import * as z from 'zod';

const BASE_URL = 'http://127.0.0.1:3000';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const resetPasswordSchema = z
  .object({
    newPassword: z.string().refine((val) => passwordRules.test(val), {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type Schema = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const location = useLocation();
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const { isPending, isSuccess, mutate } = useMutation({
    mutationFn: async (data: Schema) => {
      return axios.post(`${BASE_URL}/reset-password?token=${token}`, data);
    }
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full border-2 border-black rounded-lg p-4 bg-white shadow">
        {isSuccess ? (
          <>
            <h1 className="text-center text-2xl">
              <strong>Password reset</strong>
            </h1>

            {/* Consider if you should return email from DB response */}
            <p className="text-center">Your password has been successfully reset.</p>

            <div className="text-center mt-2">
              <Link to={'/login'} className="w-full rounded-md bg-gray-300 p-2 font-bold cursor-pointer">
                Continue
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl">
              <strong>Reset password</strong>
            </h1>

            <p className="text-center">Your new password must be different to previously used passwords.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  {...register('newPassword')}
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border-2 border-black p-2 rounded-md my-2"
                />
              </div>

              <div>
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter confirm password"
                  className="w-full border-2 border-black p-2 rounded-md my-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-gray-300 p-2 font-bold cursor-pointer"
                disabled={isPending}
              >
                Reset password
              </button>

              <p className="text-center mt-2">
                <Link to={'/login'}>Back to login</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
