import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const loginSchema = z.strictObject({
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase()),
  password: z.string().refine((val) => passwordRules.test(val), { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }),
  rememberMe: z.boolean()
});

export const loginController = async (req: Request, res: Response) => {
  console.log('Login Endpoint!');
  console.log('Received body:', req.body);

  try {
    const result = loginSchema.safeParse(req.body);
    console.log('Validation result:', result);

    if (!result.success) {     
      return res.status(400).json({
        status: 400,
        error: "Validation Error",
        message: "Invalid input data",
        details: treeifyError(result.error)
      });
    }

    const { email, password, rememberMe } = result.data;
    console.log('Parsed data:', { email, password, rememberMe });

    const existingUser = await prisma.registration.findUnique({
      where: { email }
    });
    console.log('Existing user:', existingUser);

    if (!existingUser) {
      console.log('User not found');
      return res.status(401).json({
        status: 401,
        error: "Unauthorized",
        message: "Email or password is incorrect"
      });
    }

    // Check if account is locked
    console.log('LockUntil:', existingUser.lockUntil);
    if (existingUser.lockUntil && existingUser.lockUntil > new Date()) {
      console.log('Account is locked');
      return res.status(403).json({
        status: 403,
        error: 'AccountLocked',
        message: `Account is locked until ${existingUser.lockUntil.toISOString()}.`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      const attempts = (existingUser.failedLoginAttempts ?? 0) + 1;
      console.log('Failed login attempts:', attempts);

      if (attempts >= 5) {
        const lockUpdate = await prisma.registration.update({
          where: { email },
          data: {
            failedLoginAttempts: 0,
            lockUntil: new Date(Date.now() + 1 * 60 * 1000) // 15 minutes from now
          }
        });
        console.log('Lockout update:', lockUpdate);

        return res.status(403).json({
          status: 403,
          error: 'AccountLocked',
          message: 'Account locked due to too many failed login attempts. Try again later.'
        });
      } else {
        const attemptsUpdate = await prisma.registration.update({
          where: { email },
          data: {
            failedLoginAttempts: attempts
          }
        });
        console.log('Attempts update:', attemptsUpdate);

        return res.status(401).json({
          status: 401,
          error: "Unauthorized",
          message: "Email or password is incorrect"
        });
      }
    }

    // Successful login: reset failed attempts and lockUntil
    await prisma.registration.update({
      where: { email },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null
      }
    });
    console.log('Reset failedLoginAttempts and lockUntil for user:', email);

    const accessToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '15s' }
    );
    const refreshToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: rememberMe ? '180s' : '60s' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 180 * 1000 : 60 * 1000
    });

    res.status(200).json({
      status: 200,
      message: 'User logged in successfully',
      accessToken,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt
      }
    });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'An unexpected error occurred during login. Please try again later.',
    });
  }
}