import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const meSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(24, 'Name must be at most 24 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email')
    .transform((value) => value.trim().toLocaleLowerCase())
    .optional(),
  password: z
    .string()
    .refine((val) => passwordRules.test(val), {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
    .optional()
});

export const meUpdateController = async (req: Request, res: Response) => {
  try {
    const authUser = req.user;
    const validation = meSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: treeifyError(validation.error)
      });
    }

    if (!authUser) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Token missing or invalid'
      });
    }

    const { email } = authUser as { email: string };
    const userExisting = await prisma.user.findUnique({
      where: { email, isDeleted: false }
    });

    if (!userExisting) {
      console.log(`[AUDIT] Update attempt failed for email: ${email} (user not found)`);
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: 'User not found'
      });
    }

    const { name, email: newEmail, password } = validation.data;

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (newEmail) {
      if (newEmail === email) {
        return res.status(400).json({
          status: 400,
          error: 'Validation Error',
          message: 'New email must be different from current email'
        });
      }

      const isNewEmailExists = await prisma.user.findUnique({
        where: { email: newEmail }
      });

      if (isNewEmailExists) {
        return res.status(409).json({
          status: 409,
          error: 'Conflict',
          message: 'Email is already in use'
        });
      }

      updateData.email = newEmail;
    }
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: updateData
    });

    console.log(`[AUDIT] User updated: ${email} Fields: ${Object.keys(updateData).join(', ')}`);

    return res.status(200).json({
      status: 200,
      message: 'User data updated successfully'
    });
  } catch (error) {
    console.log(`[AUDIT] Internal error during update: ${error}`);
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
