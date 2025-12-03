import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

// Add zod to validate req.body
const passwordSchema = z.object({
  currentPassword: z.string().refine((val) => passwordRules.test(val), {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  }),
  newPassword: z.string().refine((val) => passwordRules.test(val), {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
});

export const changePasswordController = async (req: Request, res: Response) => {
  const result = passwordSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: 400,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: treeifyError(result.error)
    });
  }

  try {
    const userId = Number((req.user as { id?: string | number })?.id);
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        error: 'BadRequest',
        message: 'Invalid credentials'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      status: 200,
      message: 'Successfully updated password'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
