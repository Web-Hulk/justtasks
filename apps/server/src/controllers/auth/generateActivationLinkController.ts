import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../../generated/prisma/index.js';
import { sendActivationEmail } from '../../services/sendActivationEmail.js';

const prisma = new PrismaClient();

export const generateActivationLinkController = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(200).json({
      status: 200,
      message: 'If this email exists, an activation link has been sent.'
    });
  }

  const activationToken = uuidv4();
  const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await sendActivationEmail(email, activationToken);
  } catch (error) {
    console.error('Email sending failed: ', error);

    await prisma.user.delete({
      where: { email }
    });

    return res.status(500).json({
      status: 500,
      error: 'MailboxUnavailable',
      message: 'Could not send email'
    });
  }

  await prisma.user.update({
    where: { email },
    data: {
      activationToken,
      activationExpires
    }
  });

  return res.status(200).json({
    status: 200,
    message: 'Email sent successfully'
  });
};
