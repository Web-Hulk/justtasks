import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';
import { PrismaClient } from '../../generated/prisma/index.js';
import { sendResetPasswordEmail } from '../../services/sendResetPasswordEmail.js';

const prisma = new PrismaClient();

const emailSchema = z.object({
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase())
});

export const forgotPasswordController = async (req: Request, res: Response) => {
  console.log('Forgot Pasword');

  try {
    const result = emailSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error'
      });
    }

    const { email } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return res.status(200).json({
        status: 200,
        message: 'If this email exists, a reset link has been sent.'
      });
    }

    try {
      const resetPasswordToken = uuidv4();
      const resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { email },
        data: {
          resetPasswordToken,
          resetPasswordExpires
        }
      });

      await sendResetPasswordEmail(resetPasswordToken); // Pass email here, to set email receiver!
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'MailboxUnavailable',
        message: 'Could not send email'
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Reset Password Email Sent'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
