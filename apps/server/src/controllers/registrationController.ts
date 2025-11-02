import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const registrationController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await prisma.registration.findUnique({
    where: {
      email
    }
  })

  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists!' })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.registration.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  })
}