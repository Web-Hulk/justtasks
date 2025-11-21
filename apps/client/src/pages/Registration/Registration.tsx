import { registrationSchema } from '@/schemas/authSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Navigate } from 'react-router';
import { z } from 'zod';

const BASE_URL = 'http://127.0.0.1:3000';

type Schema = z.infer<typeof registrationSchema>;

export const Registration = () => {
  const { register, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(registrationSchema)
  });

  const postRegistration = (registrationData: Schema) => {
    return axios.post(`${BASE_URL}/registration`, registrationData);
  };

  const { isPending, isError, isSuccess, error, mutate } = useMutation({
    mutationFn: async (formData: Schema) => {
      return await postRegistration(formData);
    }
  });

  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log('Registration data: ', data);
    console.log(data.email);

    // Add service to manage localStorage
    localStorage.setItem('email', data.email);
    mutate(data);
  };

  return (
    <div data-testid="registration" className="min-h-screen flex items-center justify-center bg-gray-100">
      {isPending ? (
        <CircularProgress />
      ) : (
        <>
          {isError ? <span>{`Error: ${error.message}`}</span> : null}
          {isSuccess ? <Navigate replace to="/verify-email" /> : null}

          <div className="max-w-xl w-full border-2 border-black rounded-lg p-4 bg-white shadow">
            <h1 className="text-center text-2xl">
              <strong>Get Started Now</strong>
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <input
                  {...register('name')}
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Enter your name"
                  className="w-full border-2 border-black p-2 rounded-md mt-2"
                />
              </div>

              <div>
                <input
                  {...register('email')}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full border-2 border-black p-2 rounded-md mt-2"
                />
              </div>

              <div>
                <input
                  {...register('password')}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border-2 border-black p-2 rounded-md mt-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-gray-300 p-2 my-2 font-bold cursor-pointer"
                disabled={isPending}
              >
                Sign Up
              </button>
            </form>

            <p className="text-center">
              Already have an account?{' '}
              <a href="/login">
                <strong>Log in</strong>
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
