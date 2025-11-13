import { registrationSchema } from '@/schemas/authSchemas';
import { sendActivationEmail } from '@/services/sendActivationEmail';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
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

    const existingUser = await prisma.user.findUnique({
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
    const activationToken = uuidv4();

    // In few places you add expiration time - awesome part to move to reusable function which create DateTime
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActivated: false,
        activationToken,
        activationExpires
      }
    });

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

    return res.status(201).json({
      status: 201,
      message: 'User registered successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong'
    });
  }
};
