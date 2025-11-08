import { zodResolver } from '@hookform/resolvers/zod';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Navigate } from 'react-router';
import { z } from 'zod';

const BASE_URL = 'http://127.0.0.1:3000';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const loginSchema = z.strictObject({
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase()),
  password: z.string().refine((val) => passwordRules.test(val), {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }),
  rememberMe: z.boolean()
});

type Schema = z.infer<typeof loginSchema>;

export const Login = () => {
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(loginSchema)
  });

  const postLogin = (loginData: Schema) => {
    return axios.post(`${BASE_URL}/login`, loginData);
  };

  const { isPending, isError, isSuccess, mutate, error } = useMutation({
    mutationFn: async (formData: Schema) => {
      return await postLogin(formData);
    }
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log('Form data: ', data);
    mutate(data);
  };

  // Will be rewritten to MUI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {isPending ? (
        <CircularProgress />
      ) : (
        <>
          {isError ? <span>{`Error: ${error.message}`}</span> : null}
          {isSuccess ? <Navigate replace to="/registration" /> : null}

          <div className="max-w-xl w-full border-2 border-black rounded-lg p-4 bg-white shadow">
            <h1 className="text-center">
              Welcome Back to <strong>JUSTTASKS</strong>
            </h1>

            <p className="text-center">Enter your username and password to continue.</p>

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

              <div>
                <input
                  {...register('password')}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border-2 border-black p-2 rounded-md"
                />
              </div>

              <div className="flex justify-between my-2">
                <div>
                  <input {...register('rememberMe')} id="rememberMe" type="checkbox" />
                  <label htmlFor="rememberMe" className="ml-1">
                    Remember me
                  </label>
                </div>

                <a href="/">
                  <strong>Forgot password</strong>
                </a>
              </div>

              <button
                className="w-full rounded-md bg-gray-300 p-2 font-bold cursor-pointer"
                type="submit"
                disabled={isPending}
              >
                Sign In
              </button>
            </form>

            <p className="text-center my-2">Or login with</p>

            <div>
              <button className="w-full border-2 border-black rounded-md p-2 cursor-pointer">Google</button>
            </div>

            <p className="text-center mt-2">
              Don&apos;t have an account?{' '}
              <a href="/registration">
                <strong>Register</strong>
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
