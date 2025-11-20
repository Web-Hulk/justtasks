import type { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

const emailSchema = z.object({
  email: z.email()
});

export const activationStatusController = async (req: Request, res: Response) => {
  console.log('Activation Status');

  try {
    const parseResult = emailSchema.safeParse(req.query);

    if (!parseResult.success) {
      return res.status(400).json({
        status: 400,
        error: 'InvalidEmail',
        message: 'Email not found'
      });
    }

    const { email } = parseResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return res.status(200).json({
        isActivated: false
      });
    }

    return res.status(200).json({
      isActivated: existingUser.isActivated,
      activationExpires: existingUser.activationExpires
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
