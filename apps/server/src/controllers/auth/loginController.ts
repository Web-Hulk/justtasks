import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UAParser } from 'ua-parser-js';
import { treeifyError } from 'zod';
import { PrismaClient } from '../../generated/prisma/index.js';
import { loginSchema } from '../../schemas/authSchemas.js';

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
      where: { email, isDeleted: false }
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

    const accessToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    );
    const refreshToken = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: rememberMe ? '180s' : '60s' }
    );

    // Move to reusable service
    const parser = new UAParser();
    const userAgent = req.headers['user-agent'] || '';
    const uaResult = parser.setUA(userAgent).getResult();
    const deviceName = [uaResult.os.name, uaResult.browser.name].join(' ') || userAgent;

    const existingSession = await prisma.session.findFirst({
      where: { deviceName, userId: existingUser.id }
    });

    let session;

    if (existingSession) {
      session = await prisma.session.update({
        where: { id: existingSession.id },
        data: {
          lastUsedAt: new Date(),
          refreshToken
        }
      });
    } else {
      session = await prisma.session.create({
        data: {
          id: randomUUID(),
          userId: existingUser.id,
          createdAt: new Date(),
          lastUsedAt: new Date(),
          ipAddress: 'N/A',
          userAgent,
          deviceName,
          // location: '',
          // oauthProvider: '',
          refreshToken,
          isRevoked: false
        }
      });
    }

    if (!session) {
      return res.status(404).json({
        status: 404,
        error: 'NotFound',
        message: `Session not found.`
      });
    }

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? 180 * 1000 : 60 * 1000
    });

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
        createdAt: existingUser.createdAt,
        session: session
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
