import { registrationSchema } from '@/schemas/authSchemas';
import { EmailContent } from '@/services/emailContent';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { treeifyError } from 'zod';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

const TRANSPORTER = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false
});

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
    const activationToken = uuidv4();

    // In few places you add expiration time - awesome part to move to reusable function which create DateTime
    const activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.registration.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActivated: false,
        activationToken,
        activationExpires
      }
    });

    await TRANSPORTER.sendMail({
      // Set business email address
      from: 'welcome@justtasks.com',
      // Change 'test@user.com' to email before going to production
      to: 'test@user.com',
      subject: 'Confirm your email and launch your tasks on JUSTTASKS!',
      // Keep hardcoded customer email for development purpose
      // Change 'test@user.com' to email before going to production
      html: EmailContent('test@user.com', activationToken)
    });

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
