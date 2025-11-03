import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const registrationSchema = z.strictObject({
  name: z.string().trim().min(1, 'Name is required').max(24, 'Name must be at most 24 characters'),
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase()),
  password: z.string().refine((val) => passwordRules.test(val), { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
})

export const registrationController = async (req: Request, res: Response) => {
  const result = registrationSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: treeifyError(result.error) });
  }
  
  const { name, email, password } = result.data;

  const existingUser = await prisma.registration.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists!', })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.registration.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  })
}