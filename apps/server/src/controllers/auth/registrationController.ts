import { registrationSchema } from '@/schemas/authSchemas';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { treeifyError } from 'zod';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const registrationController = async (req: Request, res: Response) => {
  console.log('Registration Endpoint!');

  try {
    const result = registrationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: treeifyError(result.error)
      });
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.registration.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(409).json({
        status: 409,
        error: 'Conflict',
        message: 'Email already exists!',
        details: { email: ['Email already exists'] }
      });
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
      status: 201,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
