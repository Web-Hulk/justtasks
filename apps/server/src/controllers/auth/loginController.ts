import { loginSchema } from '@/schemas/authSchemas';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { treeifyError } from 'zod';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const loginController = async (req: Request, res: Response) => {
  console.log('Login Endpoint!');

  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: 'Validation Error',
        message: 'Invalid input data',
        details: treeifyError(result.error)
      });
    }

    const { email, password, rememberMe } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is locked
    if (existingUser.lockUntil && existingUser.lockUntil > new Date()) {
      return res.status(403).json({
        status: 403,
        error: 'AccountLocked',
        message: `Account is locked until ${existingUser.lockUntil.toISOString()}.`
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      const attempts = (existingUser.failedLoginAttempts ?? 0) + 1;

      if (attempts >= 5) {
        await prisma.user.update({
          where: { email },
          data: {
            failedLoginAttempts: 0,
            lockUntil: new Date(Date.now() + 1 * 60 * 1000) // 15 minutes from now
          }
        });

        return res.status(403).json({
          status: 403,
          error: 'AccountLocked',
          message: 'Account locked due to too many failed login attempts. Try again later.'
        });
      } else {
        await prisma.user.update({
          where: { email },
          data: {
            failedLoginAttempts: attempts
          }
        });

        return res.status(401).json({
          status: 401,
          error: 'Unauthorized',
          message: 'Email or password is incorrect'
        });
      }
    }

    // Successful login: reset failed attempts and lockUntil
    await prisma.user.update({
      where: { email },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null
      }
    });

    const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_SECRET as string, {
      expiresIn: '15s'
    });
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
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'An unexpected error occurred during login. Please try again later.'
    });
  }
};
