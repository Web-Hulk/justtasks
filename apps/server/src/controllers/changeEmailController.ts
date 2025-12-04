import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../generated/prisma/index.js';
import { sendAuthorizedActivationEmail } from '../services/sendAuthorizedActivationEmail.js';

const prisma = new PrismaClient();

const emailSchema = z.object({
  currentEmail: z.email(),
  newEmail: z.email()
});

export const changeEmailController = async (req: Request, res: Response) => {
  res.send(500);

  const userId = Number((req.user as { id?: string | number })?.id);

  const validationResult = emailSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      status: 400,
      error: 'ValidationError',
      message: 'Invalid input data',
      details: treeifyError(validationResult.error)
    });
  }

  try {
    const { newEmail } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'User not authorized'
      });
    }

    if (newEmail === existingUser.email) {
      return res.status(400).json({
        status: 400,
        error: 'BadRequest',
        message: 'New email must be different from current email'
      });
    }

    const emailTaken = await prisma.user.findUnique({ where: { email: newEmail } });

    if (emailTaken) {
      return res.status(409).json({
        status: 409,
        error: 'Conflict',
        message: 'Email already in use'
      });
    }

    const pendingEmailToken = uuidv4();
    const pendingEmailExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        pendingEmail: newEmail,
        pendingEmailToken,
        pendingEmailExpires
      }
    });

    try {
      await sendAuthorizedActivationEmail(newEmail, pendingEmailToken);
    } catch (error) {
      // Optionally clear pending fields, but do NOT delete user
      await prisma.user.update({
        where: { id: userId },
        data: {
          pendingEmail: null,
          pendingEmailToken: null,
          pendingEmailExpires: null
        }
      });
      return res.status(500).json({
        status: 500,
        error: 'MailboxUnavailable',
        message: 'Could not send email'
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Verification email sent to new address'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalSystemError',
      message: 'Something went wrong'
    });
  }
};
