import { z } from 'zod';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

export const loginSchema = z.strictObject({
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase()),
  password: z.string().refine((val) => passwordRules.test(val), {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }),
  rememberMe: z.boolean()
});

export const registrationSchema = z.strictObject({
  name: z.string().trim().min(1, 'Name is required').max(24, 'Name must be at most 24 characters'),
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase()),
  password: z.string().refine((val) => passwordRules.test(val), {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
});
