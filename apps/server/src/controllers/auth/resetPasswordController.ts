import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import * as z from 'zod';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

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

export const resetPasswordController = async (req: Request, res: Response) => {
  console.log('Reset Password');

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      status: 400,
      error: 'TokenMissing',
      message: 'No token provided'
    });
  }

  try {
    const result = resetPasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: result.error.flatten()
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token
      }
    });

    if (
      !existingUser ||
      !existingUser.resetPasswordExpires ||
      new Date() > new Date(existingUser.resetPasswordExpires)
    ) {
      return res.status(400).json({
        status: 400,
        error: 'TokenInvalidOrExpired',
        message: 'Token is invalid or expired'
      });
    }

    const { newPassword } = result.data;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    return res.status(200).json({
      status: 200,
      message: 'Updated password'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
