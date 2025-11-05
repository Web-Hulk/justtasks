import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { treeifyError, z } from 'zod';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;

const loginSchema = z.strictObject({
  email: z.email('Invalid email').transform((val) => val.trim().toLocaleLowerCase()),
  password: z.string().refine((val) => passwordRules.test(val), { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
})

export const loginController = async (req: Request, res: Response) => {
  console.log('Login Endpoint!');

  try {
    const result = loginSchema.safeParse(req.body);
    console.log('Result: ', result);

    if (!result.success) {     
      return res.status(400).json({
        status: 400,
        error: "Validation Error",
        message: "Invalid input data",
        details: treeifyError(result.error)
      });
    }

    const { email, password } = result.data;
    const existingUser = await prisma.registration.findUnique({
      where: { email }
    })

    if (!existingUser) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized",
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser?.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        error: "Unauthorized",
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({ id: existingUser?.id, email: existingUser?.email }, process.env.JWT_SECRET as string, { expiresIn: '1800s' })

    res.status(200).json({
      status: 200,
      message: 'User logged in successfully',
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: 'InternalServerError',
      message: 'Something went wrong',
    })
  }
}